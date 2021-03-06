const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

global.navigator = {
  userAgent: 'node.js',
};

// 首页
app.get("/", async (req, res) => {
  const ua = navigator.userAgent.toLowerCase();
  const isWeixin = ua.indexOf('micromessenger') != -1;
  if (!isWeixin) {
    res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2a73de42aa936d63redirect_uri=https://express-9vkv-1825942-1311202647.ap-shanghai.run.tcloudbase.com/");
  } else {
    res.send("Hello World!")
  }
  //res.sendFile(path.join(__dirname, "index.html"));
});

// 验证Signature
app.get("/checkSignature", async (req, res) => {
  const query = req.query;
  const isFromWechatServer = require("./checkSignature")(query);
  if (isFromWechatServer) {
    res.send(query.echostr);
  } else {
    res.send('');
  }

  //res.send("Hello World!")
  //res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
