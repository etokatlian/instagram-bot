const Instagram = require('./instagram');
const schedule = require('node-schedule');

const content = require('./content');

require('dotenv').config();

(async () => {
  let k = schedule.scheduleJob('0 */6 * * *', async () => {
    console.log('running');
    let ig = new Instagram();
    try {
      await ig.initialize();
      await ig.login(process.env.USERNAME, process.env.PASSWORD);
      await ig.likeTagsProcess(content.hashtagSet, content.comments);
      await ig.browser.close();
    } catch (e) {
      await ig.browser.close();
    }
  });
})();
