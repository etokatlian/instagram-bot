Instagram Bot
---

I used puppeteer to write my own version of an instagram bot which:
-  Likes posts in a certain genre (hashtags) you provide
-  Follows users in that genre
-  Writes comments on people's posts
-  Unfollows users
-  Emails you when the bot goes online so you can watch it in action :)

I have this running on an **AWS EC2 instance**, where the bot goes online every 6 hours. Intitially I was using PM2 and node-scheduler to simulate a cron-job but I was having issues with memory leaks and my EC2 instance shutting down so I've since switched to using ForeverJS to keep the script running. I'm also using nodemailer for email alerts so I know when the bot goes online.

The results have been really solid and I've amassed over 500 followers in just a couple weeks!

Some things I plan to include in the near future are the ability for my bot to automatically generate its own content by scraping images (I'll also use pupeteer for this) and then categorizing them as either good or bad content using a machine learning algorithm (linear regression seems suitable). I'll have the bot repost the good images only. Some of the metrics that seem valuable for this training model are: number of likes the image has received, number of comments, whether people have been tagged etc.