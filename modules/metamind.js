"use strict";

let fs = require('fs'),
jwt = require('jsonwebtoken'),
handlers = require('./handlers'),
request = require('request'),
unirest = require('unirest'),
TOKEN_ENDPOINT_URL = 'https://api.metamind.io/v1/oauth2/token',
ISSUER = process.env.METAMIND_ISSUER,
AUDIENCE = process.env.METAMIND_AUDIENCE,
SUBJECT = process.env.METAMIND_SUBJECT,
cert = fs.readFileSync(process.env.METAMIND_CERT, 'UTF8');

// JWTに記載されるメッセージの内容
let options = {
  issuer: ISSUER,
  audience: AUDIENCE,
  subject: SUBJECT, // 接続するSalesforceのユーザアカウント名
  algorithm: 'RS256',
  expiresIn: 600
}

exports.getStyle = (sender, url) => {

  // JWTの生成と署名
  let token = jwt.sign({ foo: 'bar'}, cert, options);

  request({
    method: 'POST',
    url: TOKEN_ENDPOINT_URL,
    form: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    }
  }, function(err, response, body) {
    if (err) {
      return console.error(err);
    } else {
      let ret = JSON.parse(body);
      let access_token = ret.access_token;

      unirest.post('https://api.metamind.io/v1/vision/predict')
      .headers({
        'Authorization': "Bearer "+access_token
      })
      .field({
        'modelId': process.env.METAMIND_MODEL,
        'sampleLocation': url
      })
      .end(function (res) {
        let label = res.body.probabilities[0].label;
        return label;
//        handlers.searchStyle(sender, label);
      });
    }
  });
};
