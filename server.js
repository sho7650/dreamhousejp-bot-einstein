"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    metamind = require('./modules/metamind'),
    FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN,
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('エラー : FacebookのVerifyトークンが不正です');
    }
});

app.post('/webhook', (req, res) => {
//    console.log(req.body.entry[0].messaging[0].message.attachments[0].payload.url);
    let events = req.body.entry[0].messaging;
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let sender = event.sender.id;
        if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
            sendMessage({text: `申し訳ござませんが、現在メンテナンスモード中です。`}, sender);
        } else if (event.message && event.message.text) {
            let result = processor.match(event.message.text);
            if (result) {
                let handler = handlers[result.handler];
                if (handler && typeof handler === "function") {
                    handler(sender, result.match);
                } else {
                    console.log("Handler " + result.handlerName + " は定義されていません");
                }
            }
        } else if (event.postback) {
            let payload = event.postback.payload.split(",");
            let postback = postbacks[payload[0]];
            if (postback && typeof postback === "function") {
                postback(sender, payload);
            } else {
                console.log("Postback " + postback + " は定義されていません");
            }
        } else if (event.message && event.message.attachments) {
          let attachments = event.message.attachments;
          for (let j = 0; j < attachments.length; j++) {
            let attachment = attachments[j];
            let url        = attachment.payload.url;
            metamind.getStyle(url, (label) => {
              handlers.searchStyle(sender, url);
            });
          }
        }
    }
    res.sendStatus(200);
});

app.listen(app.get('port'), function () {
    console.log('xpress serverが起動 - ポート : ' + app.get('port'));
});
