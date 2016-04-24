"use strict";

let moment = require("moment");

let formatProperties = properties => {
    let elements = [];
    properties.forEach(property => {
            elements.push({
                title: property.get("Title__c"),
                subtitle: property.get("Address__c") + " " + property.get("City__c") + " " + property.get("State__c") + " · " + property.get("Price__c"),
                "image_url": property.get("Picture__c"),
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Schedule visit",
                        "payload": "schedule_visit," + property.getId()
                    },
                    {
                        "type": "postback",
                        "title": "View broker info",
                        "payload": "contact_broker," + property.getId()
                    },
                    {
                        "type": "web_url",
                        "url": "https://login.salesforce.com/" + property.getId(),
                        "title": "Start directions"
                    }
                ]
            })
        }
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};


let formatAppointment = property => {
    var options = [
        moment().add(1, 'days').format('ddd MMM Do') + ' at 10am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 9am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 5pm',
        moment().add(3, 'days').format('ddd MMM Do') + ' at 1pm',
        moment().add(3, 'days').format('ddd MMM Do') + ' at 6pm',
    ];
    let elements = [];
    elements.push({
        title: "Scheduling a visit",
        subtitle: property.get("Address__c") + " " + property.get("City__c") + " " + property.get("State__c") + " · " + property.get("Price__c"),
        "image_url": property.get("Picture__c"),
        "buttons": [
            {
                "type": "postback",
                "title": options[0],
                "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[0]
            },
            {
                "type": "postback",
                "title": options[1],
                "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[1]
            },
            {
                "type": "postback",
                "title": options[2],
                "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[2]
            }
        ]
    });
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

let formatBroker = broker => {
    let elements = [];
    elements.push({
        title: "Caroline Kingsley",
        subtitle: "Senior Broker  · 617-219-6363 · ckingsley@dreamhouse.com",
        "image_url": "https://s3-us-west-1.amazonaws.com/sfdc-demo/messenger/caroline_500x260.png",
        "buttons": [
            {
                "type": "postback",
                "title": "Contact Me",
                "payload": "contact_me"
            }]
    });
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

exports.formatProperties = formatProperties;
exports.formatAppointment = formatAppointment;
exports.formatBroker = formatBroker;