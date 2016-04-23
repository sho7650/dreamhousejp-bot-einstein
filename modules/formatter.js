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
                        "title": "Contact broker",
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
    console.log("####formatAppointment");
    console.log(property);
    var options = [
        moment().add(1, 'days').format('ddd MMM Do') + ' at 10am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 9am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 5pm',
        moment().add(3, 'days').format('ddd MMM Do') + ' at 1pm',
    ];
    let elements = [];
    elements.push({
        title: property.get("Title__c"),
        subtitle: property.get("Address__c") + " " + property.get("City__c") + " " + property.get("State__c") + " · " + property.get("Price__c"),
        "image_url": property.get("Picture__c"),
        "buttons": [
            {
                "type": "postback",
                "title": options[0],
                "payload": "confirm_visit," + property.get("Address__c") + " " + property.get("City__c") + "," + options[0]
            },
            {
                "type": "postback",
                "title": options[1],
                "payload": "confirm_visit," + property.get("Address__c") + " " + property.get("City__c") + "," + options[1]
            },
            {
                "type": "postback",
                "title": options[2],
                "payload": "confirm_visit," + property.get("Address__c") + " " + property.get("City__c") + "," + options[2]
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

exports.formatProperties = formatProperties;
exports.formatAppointment = formatAppointment;