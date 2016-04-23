"use strict";

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
    var dates = ["Tuesday", "Wednesday", "Thursday"];
    let elements = [];
    elements.push({
        title: property.get("Title__c"),
        subtitle: property.get("Address__c") + " " + property.get("City__c") + " " + property.get("State__c") + " · " + property.get("Price__c"),
        "image_url": property.get("Picture__c"),
        "buttons": [
            {
                "type": "postback",
                "title": dates[0],
                "payload": "confirm_visit," + property.getId() + "," + dates[0]
            },
            {
                "type": "postback",
                "title": dates[1],
                "payload": "confirm_visit," + property.getId() + "," + dates[1]
            },
            {
                "type": "postback",
                "title": dates[2],
                "payload": "confirm_visit," + property.getId() + "," + dates[2]
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
exports.formatAppointments = formatAppointments;