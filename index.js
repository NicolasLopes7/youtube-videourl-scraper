const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const getDirectVideoUrl = async (videoUrl) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
      `https://pt.savefrom.net/9/#url=${videoUrl}&utm_source=youtube.com&utm_medium=short_domains&utm_campaign=www.ssyoutube.com&a_ts=${new Date().getTime()}`
    );
    await page.waitForSelector("div.def-btn-box");

    const url = await page.evaluate(() => {
      const elements = document.querySelectorAll("div.def-btn-box a");
      const exactElement = elements[0];
      return exactElement.href;
    });

    browser.close();
    return url;
  };

  const videoUrl = await getDirectVideoUrl(req.query.url);
  return res.json({ videoUrl });
});

app.listen(process.env.PORT || 5000);
