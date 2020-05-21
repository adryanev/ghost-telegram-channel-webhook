const express = require("express");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
require("dotenv").config();
const axios = require("axios");
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const channelID = process.env.TELEGRAM_CHANNEL_ID;
const telegram_url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${channelID}&text=`;

const app = express();
const PORT = 3000;
let lastRequest = 0;

app.use(bodyParser.json());

app.use(
  basicAuth({
    users: {
      [process.env.AUTH_USERNAME]: process.env.AUTH_PASSWORD,
    },
  })
);

app.post("/publish", (req, res) => {
  if (Date.now() - 5000 > lastRequest) {
    handlePublish(req);
  }
  res.status(200).send("OK");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const handlePublish = (req) => {
  const { html, url, feature_image, title } = req.body.post.current;
  let message = `🚀Artikel baru telah ditambahkan!\n [${title}](${url}) di [${process.env.SITE_NAME}](${process.env.SITE_URL}). \n`;
  let content = message + `${url}\n`;
  sendToBot(content);
};

const sendToBot = (content) => {
  const contentEncoded = encodeURIComponent(content);
  const urlEncoded = telegram_url + contentEncoded + "&parse_mode=markdown";
  axios
    .get(urlEncoded)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => console.log(err));
};
