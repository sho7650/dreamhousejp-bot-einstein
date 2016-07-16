"use strict";

let salesforce = require('./salesforce'),
    messenger = require('./messenger'),
    formatter = require('./formatter');

exports.searchHouse = (sender) => {
    messenger.send({text: `かしこまりました。現在売り出し中の物件を検索しています...`}, sender);
    salesforce.findProperties().then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_City = (sender, values) => {
    messenger.send({text: `かしこまりました。 場所:${values[1]} の物件を検索しています...`}, sender);
    salesforce.findProperties({city: values[1]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Bedrooms_City_Range = (sender, values) => {
    messenger.send({text: `かしこまりました。部屋数:${values[1]} 場所:${values[2]} 価格帯: ${values[3]} から ${values[4]} の物件を検索しています...`}, sender);
    var priceMin = values[3] <= 1000000 ? values[3] * 10000 : values[3];
    var priceMax = values[4] <= 1000000 ? values[4] * 10000 : values[4];
    salesforce.findProperties({bedrooms: values[1], city: values[2], priceMin: priceMin, priceMax: priceMax}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Bedrooms_City = (sender, values) => {
    messenger.send({text: `かしこまりました。部屋数:${values[1]} 場所:${values[2]} の物件を検索しています...`}, sender);
    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Bedrooms = (sender, values) => {
    messenger.send({text: `かしこまりました。部屋数:${values[1]}の物件を検索しています...`}, sender);
    salesforce.findProperties({bedrooms: values[1]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Range = (sender, values) => {
    messenger.send({text: `かしこまりました。価格帯:${values[1]}から${values[2]}の物件を検索しています`}, sender);
    var priceMin = values[1] <= 100000 ? values[1] * 10000 : values[1];
    var priceMax = values[1] <= 100000 ? values[2] * 10000 : values[2];
    salesforce.findProperties({priceMin: priceMin, priceMax: priceMax}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.priceChanges = (sender, values) => {
    messenger.send({text: `かしこまりました。直近の価格変更を検索しています...`}, sender);
    salesforce.findPriceChanges().then(priceChanges => {
        messenger.send(formatter.formatPriceChanges(priceChanges), sender);
    });
};

exports.hi = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `こんにちは。 ${response.last_name} 様!`}, sender);
    });
};

exports.help = (sender) => {
    messenger.send({text: `ようこそドリームハウスへ。\n物件はメッセージから検索することもできます。 "場所:品川", "部屋数:3 場所:品川", "部屋数:3 場所:品川 価格:5000から7500の間", "価格変更" などのように、さまざまなキーワードを使って条件を指定できます`}, sender);
};

exports.unknown = (sender) => {
    messenger.send({text: `申し訳ございません。リクエストの内容を認識できません。 \nヘルプ とメッセージを頂ければ物件の検索方法をお送りいたします`}, sender);
};
