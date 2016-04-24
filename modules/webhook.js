"use strict";

let request = require('request'),
    //salesforce = require('./salesforce'),
    processor = require('./processor'),
    handlers = require('./handlers'),
    postbacks = require('./postbacks');
    //formatter = require('./formatter');

//let sendMessage = (message, recipient) => {
//    request({
//        url: 'https://graph.facebook.com/v2.6/me/messages',
//        qs: {access_token: process.env.PAGE_TOKEN},
//        method: 'POST',
//        json: {
//            recipient: {id: recipient},
//            message: message
//        }
//    }, (error, response) => {
//        if (error) {
//            console.log('Error sending message: ', error);
//        } else if (response.body.error) {
//            console.log('Error: ', response.body.error);
//        }
//    });
//};
//
//let handlers = {};
//
//handlers.searchHouse = (sender) => {
//    sendMessage({text: `OK, looking for houses for sale around you...`}, sender);
//    salesforce.findProperties().then(properties => {
//        sendMessage(formatter.formatProperties(properties), sender);
//    });
//};
//
//handlers.searchHouse_City = (sender, values) => {
//    sendMessage({text: `OK, looking for houses in ${values[1]}`}, sender);
//    salesforce.findProperties({city: values[1]}).then(properties => {
//        sendMessage(formatter.formatProperties(properties), sender);
//    });
//};
//
//handlers.searchHouse_Bedrooms_City_Range = (sender, values) => {
//    sendMessage({text: `OK, looking for values[1] bedrooms in ${values[2]} between ${values[3]} and ${values[4]}`}, sender);
//    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
//        sendMessage(formatter.formatProperties(properties), sender);
//    });
//};
//
//handlers.searchHouse_Bedrooms_City = (sender, values) => {
//    sendMessage({text: `OK, looking for values[1] bedroom houses in ${values[2]}`}, sender);
//    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
//        sendMessage(formatter.formatProperties(properties), sender);
//    });
//};
//
//handlers.searchHouse_Bedrooms = (sender, values) => {
//    sendMessage({text: `OK, looking for values[1] bedroom houses`}, sender);
//    salesforce.findProperties({bedrooms: values[1]}).then(properties => {
//        sendMessage(formatter.formatProperties(properties), sender);
//    });
//};
//
//handlers.searchHouse_Range = (sender, values) => {
//    sendMessage({text: `OK, looking for houses between ${values[1]} and ${values[2]}`}, sender);
//    salesforce.findProperties({priceMin: values[1], priceMax: values[2]}).then(properties => {
//        sendMessage(formatter.formatProperties(properties), sender);
//    });
//};
//
//let postbacks = {};
//
//postbacks.schedule_visit = (sender, values) => {
//    salesforce.findProperties({id: values[1]}).then(properties => {
//        sendMessage({text: "OK, here is what I found. Select one of the times below"}, sender);
//        sendMessage(formatter.formatAppointment(properties[0]), sender);
//    });
//};
//
//postbacks.contact_broker = (sender, values) => {
//    sendMessage({text: "Here is the broker information for this property"}, sender);
//    sendMessage(formatter.formatBroker(), sender);
//};
//
//postbacks.confirm_visit = (sender, values) => {
//    sendMessage({text: `OK, your appointment is confirmed for ${values[2]}. ${values[1]}.`}, sender);
//};
//
//postbacks.contact_me = (sender, values) => {
//    sendMessage({text: `OK, I asked Caroline Kingsley to contact you. She will get in touch with you soon.`}, sender);
//};
//
let handleGet = (req, res) => {
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
};

let handlePost = (req, res) => {
    let events = req.body.entry[0].messaging;
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let sender = event.sender.id;
        if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
            sendMessage({text: `Sorry I'm taking a break right now.`}, sender);
        } else if (event.message && event.message.text) {
            let result = processor.match(event.message.text);
            if (result) {
                let handler = handlers[result.handler];
                if (handler && typeof handler === "function") {
                    handler(sender, result.match);
                } else {
                    console.log("Handler " + result.handlerName + " is not defined");
                }
            }
        } else if (event.postback) {
            let payload = event.postback.payload.split(",");
            let postback = postbacks[payload[0]];
            if (postback && typeof postback === "function") {
                postback(sender, payload);
            } else {
                console.log("Postback " + postback + " is not defined");
            }
        }
    }
    res.sendStatus(200);
};

//processor.init("dictionary.txt");

exports.handleGet = handleGet;
exports.handlePost = handlePost;