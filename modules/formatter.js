"use strict";

let moment = require("moment"),
    numeral = require("numeral");

moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});

exports.formatProperties = properties => {
    let elements = [];
    properties.forEach(property => {
            elements.push({
                title: property.get("Title__c"),
                subtitle: `${property.get("Address__c")}, ${property.get("City__c")} ${property.get("State__c")} · ${numeral(property.get("Price__c")).format('￥0,0')}`,
                "image_url": property.get("Picture__c"),
                "buttons": [
                    {
                        "type": "postback",
                        "title": "内覧を予約",
                        "payload": "schedule_visit," + property.getId()
                    },
                    {
                        "type": "postback",
                        "title": "担当者を表示",
                        "payload": "contact_broker," + property.getId()
                    },
                    {
                        "type": "postback",
                        "title": "連絡を希望",
                        "payload": "contact_me," + property.getId()
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

exports.formatPriceChanges = priceChanges => {
    let elements = [];
    priceChanges.forEach(priceChange => {
            let property = priceChange.get("Parent");
            elements.push({
                title: `${property.Address__c}, ${property.City__c} ${property.State__c}`,
                subtitle: `過去の価格: ${numeral(priceChange.get("OldValue")).format('￥0,0')} · 新しい価格: ${numeral(priceChange.get("NewValue")).format('￥0,0')} 変更日: ${moment(priceChange.get("CreatedDate")).format("MM/DD (ddd)")}`,
                "image_url": property.Picture__c,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "内覧を予約",
                        "payload": "schedule_visit," + property.Id
                    },
                    {
                        "type": "postback",
                        "title": "担当者を表示",
                        "payload": "contact_broker," + property.Id
                    },
                    {
                        "type": "postback",
                        "title": "連絡を希望",
                        "payload": "contact_me," + property.Id
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


exports.formatAppointment = property => {
    var options = [
        moment().add(1, 'days').format('MM/DD (ddd)') + ' 午前10時',
        moment().add(2, 'days').format('MM/DD (ddd)') + ' 午前9時',
        moment().add(2, 'days').format('MM/DD (ddd)') + ' 午後5時',
        moment().add(3, 'days').format('MM/DD (ddd)') + ' 午後1時',
        moment().add(3, 'days').format('MM/DD (ddd)') + ' 午後6時',
    ];
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": `以下の中から ${property.get("City__c")} - ${property.get("Address__c")} の物件への内覧可能な日程を選択してください。`,
                "buttons": [
                    {
                        "type": "postback",
                        "title": options[0],
                        "payload": "confirm_visit," + property.getId() + ", " + property.get("Address__c") + "  (" + property.get("City__c") + ")," + options[0]
                    },
                    {
                        "type": "postback",
                        "title": options[1],
                        "payload": "confirm_visit," + property.getId() + ", " + property.get("Address__c") + "  (" + property.get("City__c") + ")," + options[1]
                    },
                    {
                        "type": "postback",
                        "title": options[2],
                        "payload": "confirm_visit," + property.getId() + ", " + property.get("Address__c") + "  (" + property.get("City__c") + ")," + options[2]
                    }]
            }
        }
    };
};

exports.formatBroker = (broker,propertyId) => {
    let elements = [];
    elements.push({
        title: broker.get("name"),
        subtitle: broker.get("title__c") + " · " + broker.get("phone__c") + " · " +  broker.get("email__c"),
        "image_url": broker.get("picture__c"),
        "buttons": [
            {
                "type": "postback",
                "title": "連絡を希望",
                "payload": "contact_me," + propertyId
            }]
    });
    console.log(elements[0]);
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
