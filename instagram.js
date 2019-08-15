const puppeteer = require('puppeteer');

const BASE_URL = `https://instagram.com/`;
const TAG_URL = tag => `${BASE_URL}explore/tags/${tag}`;
const FOLLOWING_URL = accountName =>
  `https://www.instagram.com/${accountName}/following/`;

class Instagram {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      this.page = await this.browser.newPage();
    } catch (e) {
      console.log(e);
    }
  }

  async login(username, password) {
    try {
      await this.page.goto(BASE_URL, {
        waitUntil: 'networkidle2'
      });
      let loginButton = await this.page.$x('//a[contains(text(), "Log in")]');
      await this.page.waitFor(3000);
      await loginButton[0].click();
      await this.page.waitForNavigation({
        waitUntil: 'networkidle2'
      });
      await this.page.waitFor(1500);
      await this.page.type(`input[name="username"]`, username, {
        delay: 50
      });
      await this.page.type(`input[name="password"]`, password, {
        delay: 50
      });
      loginButton = await this.page.$x('//div[contains(text(), "Log In")]');
      await loginButton[0].click();
      await this.page.waitFor(1000);
      await this.page.waitFor('a > span[aria-label="Profile"]');
    } catch (e) {
      console.log(e);
    }
  }

  async likeTagsProcess(tags = [], comments = []) {
    try {
      for (let i = 0; i < tags.length; i++) {
        if (i === tags.length - 1) {
          await this.browser.close();
        }
        await this.page.goto(TAG_URL(tags[i]), {
          waitUntil: 'networkidle2'
        });
        await this.page.waitFor(1500);
        let posts = await this.page.$$(
          'article > div:nth-child(3) img[decoding="auto"]'
        );
        for (let i = 0; i < 3; i++) {
          let post = posts[i];
          try {
            await post.click();
            await this.page.waitFor(
              'span[id="react-root"][aria-hidden="true"]'
            );
            await this.page.waitFor(2000);
            let isLikeable = await this.page.$('span[aria-label="Like"]');
            let allButtons = await this.page.$$('button');
            var randomComment =
              comments[Math.floor(Math.random() * comments.length)];
            await this.page.type('.Ypffh', randomComment, {
              delay: 50
            });
            await this.page.waitFor(1500);
            await allButtons[1].click();
            if (isLikeable) {
              await this.page.click('span[aria-label="Like"]');
            } else {
              await this.page.keyboard.press('Escape');
            }
            let postButtonTwo = await this.page.$x(
              '//button[contains(text(), "Post")]'
            );
            await this.page.waitFor(1500);
            if (postButtonTwo.length >= 1) {
              await postButtonTwo[0].click();
            }
            await this.page.waitFor(2000);
            await this.page.keyboard.press('Escape');
          } catch (error) {
            console.log('error', error);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async unFollowUsersProcess() {
    await this.page.goto(FOLLOWING_URL(process.env.USERNAME), {
      waitUntil: 'networkidle2'
    });
    let followersButton = await this.page.$$('a');
    await this.page.waitFor(2000);
    await followersButton[2].click();
    await this.page.waitFor(2000);
    let allVisibleButtons = await this.page.$$('button');
    for (let i = 12; i < 30; i++) {
      await allVisibleButtons[i].click();
      await this.page.waitFor(1000);
      await this.page.click('button[tabindex="0"]');
    }
  }
}

module.exports = Instagram;
