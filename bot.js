const T = require("./config/keys");
const track = require("./config/track");
const bannedUsers = require("./config/users");

let user;
T.get("account/settings", (err, data, response) => {
  user = data;
});

const stream = T.stream("statuses/filter", { track });
console.log("Bot is starting\n");

try {
  stream.on("tweet", tweet => {
    if (tweet.user.screen_name === user.screen_name) {
      return;
    }
    for (let i = 0; i < bannedUsers.length; i++) {
      if (tweet.user.screen_name === bannedUsers[i])
        return console.log(`Tweet from banned user "@${bannedUsers[i]}" ignored\n`);
    }
    T.post("statuses/retweet/:id", { id: tweet.id_str }, (err, data, response) => {
      if (data.text) console.log(`Retweeted user "@${tweet.user.screen_name}":\n"${tweet.text}"\n`);
    });
  });
} catch (err) {
  console.log("An error ocurred:\n" + err + "\n");
}
