let readline = require('readline'),
    fs = require('fs'),
    handlers,
    utterances;


let init = (fileName, _handlers) => {

    handlers = _handlers;

    const rl = readline.createInterface({
        input: fs.createReadStream(fileName)
    });

    rl.on('line', (line) => {
        var index = line.indexOf(' ');
        if (index>0) {
            var handler = line.substring(0, index);
            var utterance = line.substring(index + 1);
            utterances.push({utterance: utterance, handler:handler});
        }
    });

    rl.on('close', () => {
        console.log('end of file');
    });

};


let match = text => {
    for (var i=0; i<utterances.length; i++) {
        var match = text.match(utterances[i].utterance);
        if (match) {
            var handler = handlers[utterances[i].handler];
            return {handler, match};
            //if (handler && typeof handler === "function") {
            //    handler(match);
            //} else {
            //    console.log("Handler " + utterances[i].handler + " is not defined");
            //}
        } else {
            console.log('no match');
        }
    }
};

exports.init = init;
exports.match = match;