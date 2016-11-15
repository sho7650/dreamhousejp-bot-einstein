"use strict";

let fs = require('fs'),
jwt = require('jsonwebtoken'),
salesforce = require('./salesforce'),
messenger = require('./messenger'),
formatter = require('./formatter'),
request = require('request'),
unirest = require('unirest'),
TOKEN_ENDPOINT_URL = 'https://api.metamind.io/v1/oauth2/token',
ISSUER = 'developer.force.com',
AUDIENCE = 'https://api.metamind.io/v1/oauth2/token',
SUBJECT = 'hinaba@salesforce.com',
cert = fs.readFileSync('./cert/private_key', 'UTF8');

// JWTに記載されるメッセージの内容
let options = {
  issuer: ISSUER,
  audience: AUDIENCE,
  subject: SUBJECT, // 接続するSalesforceのユーザアカウント名
  algorithm: 'RS256',
  expiresIn: 600
}

// JWTの生成と署名
//let token = jwt.sign({ foo: 'bar'}, cert, options);
//let token = jwt.sign(claim, cert, { algorithm: 'RS256'});
//let token = jwt.sign(claim, cert);

exports.getStyle = (url) => {

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

      console.log(access_token);

      unirest.post('https://api.metamind.io/v1/vision/predict')
      .headers({
        'Authorization': "Bearer "+access_token
      })
      .field({
        'modelId': 'QG3LM7HTKQMRKLDIAEGVOYMSOE',
        'sampleLocation': url
      })
      .end(function (res) {
        console.log(res.body);
        messenger.send({text: `実行結果 ${res.body}`}, sender);
      });
    }
  });
};
