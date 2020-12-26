//JS library for formatting dates
const moment = require('moment');

//Formats the messages in Chat from string to objects
function formatMessage(username, text) {

    return {
        username, 
        text, 
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage; 