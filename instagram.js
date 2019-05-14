const puppeteer = require("puppeteer");

const BASE_URL = `https://instagram.com/`;
const TAG_URL = tag => `${BASE_URL}explore/tags/${tag}`;
const FOLLOWING_URL = accountName =>
	`https://www.instagram.com/${accountName}/following/`;

const instagram = {
	browser: null,
	page: null,

	initialize: async () => {
		instagram.browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"]
		});

		instagram.page = await instagram.browser.newPage();
	},

	login: async (username, password) => {
		try {
			await instagram.page.goto(BASE_URL, {
				waitUntil: "networkidle2"
			});

			let loginButton = await instagram.page.$x(
				'//a[contains(text(), "Log in")]'
			);

			await instagram.page.waitFor(2000);

			await loginButton[0].click();

			await instagram.page.waitForNavigation({
				waitUntil: "networkidle2"
			});

			await instagram.page.waitFor(1000);

			await instagram.page.type(`input[name="username"]`, username, {
				delay: 120
			});
			await instagram.page.type(`input[name="password"]`, password, {
				delay: 120
			});

			loginButton = await instagram.page.$x(
				'//div[contains(text(), "Log In")]'
			);

			await loginButton[0].click();

			await instagram.page.waitFor(1000);
			await instagram.page.waitFor('a > span[aria-label="Profile"]');
		} catch (e) {
			console.log(e);
		}
	},

	likeTagsProcess: async (tags = [], comments = []) => {
		try {
			for (let i = 0; i < tags.length; i++) {
				if (i === tags.length - 1) {
					await instagram.browser.close();
				}

				await instagram.page.goto(TAG_URL(tags[i]), {
					waitUntil: "networkidle2"
				});

				await instagram.page.waitFor(1500);

				let posts = await instagram.page.$$(
					'article > div:nth-child(3) img[decoding="auto"]'
				);

				for (let i = 0; i < 3; i++) {
					let post = posts[i];

					await post.click();

					await instagram.page.waitFor(
						'span[id="react-root"][aria-hidden="true"]'
					);
					await instagram.page.waitFor(2000);

					let isLikeable = await instagram.page.$('span[aria-label="Like"]');

					let allButtons = await instagram.page.$$("button");

					var randomComment =
						comments[Math.floor(Math.random() * comments.length)];

					await instagram.page.type("textarea", randomComment, {
						delay: 80
					});

					await instagram.page.waitFor(1500);

					await allButtons[1].click();

					if (isLikeable) {
						await instagram.page.click('span[aria-label="Like"]');
					} else {
						await instagram.page.keyboard.press("Escape");
					}

					let postButtonTwo = await instagram.page.$x(
						'//button[contains(text(), "Post")]'
					);

					await instagram.page.waitFor(1500);

					console.log("postButtonTwo", postButtonTwo);

					if (postButtonTwo.length >= 1) {
						await postButtonTwo[0].click();
					}

					await instagram.page.waitFor(2000);

					await instagram.page.keyboard.press("Escape");
				}
			}
		} catch (e) {
			console.log(e);
		}
	},

	unFollowUsersProcess: async () => {
		await instagram.page.goto(FOLLOWING_URL(process.env.USERNAME), {
			waitUntil: "networkidle2"
		});

		let followersButton = await instagram.page.$$("a");

		await instagram.page.waitFor(2000);

		await followersButton[2].click();

		await instagram.page.waitFor(2000);

		let allVisibleButtons = await instagram.page.$$("button");

		for (let i = 12; i < 30; i++) {
			await allVisibleButtons[i].click();

			await instagram.page.waitFor(1000);

			await instagram.page.click('button[tabindex="0"]');
		}
	}
};

module.exports = instagram;