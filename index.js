const ig = require("./instagram");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");

const content = require("./content");

require("dotenv").config();

(async () => {
  let k = schedule.scheduleJob("0 */6 * * *", async () => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    try {
      await ig.initialize();

      await ig.login(process.env.USERNAME, process.env.PASSWORD);

      let mailOptions = {
        from: process.env.EMAIL,
        to: "someEmail@email.com",
        subject: "Bot online",
        text: "Makin cash money baby"
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.log("Email error occured", err);
        } else {
          console.log("Email sent");
        }
      });

      await ig.likeTagsProcess(content.hashtagSet, content.comments);
    } catch (e) {
      let mailOptions = {
        from: process.env.EMAIL,
        to: "someEmail@email.com",
        subject: "Bot online",
        text: `e`
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          console.log("Email error occured", err);
        } else {
          console.log("Email sent");
        }
      });
    }

    await ig.unFollowUsersProcess();
  });
})();