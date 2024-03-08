// Customize the fields that are needed in search results and to be removed from the algolia record.
const winston = require("winston");
const fieldsToStrip = ["address", "workflow", "taxonomy", "planning"];
const ANS_ID_NAME = "_id";
const REQUIRED_ALGOLIA_OBJECT_NAME = "objectID";
function stripFields(event) {
    let result = event
    fieldsToStrip.forEach((field) => {
        if(result[field] !== undefined) {
            delete result[field];
        }
    })
    return result;
}

function addObjectId(record) {
    if(record[ANS_ID_NAME] !== undefined) {
        record[REQUIRED_ALGOLIA_OBJECT_NAME] = record[ANS_ID_NAME];
    } else {
        throw "No Story ID found.";
    }
}

function getStoryId(record) {
    if(record[ANS_ID_NAME] !== undefined) {
        return record[ANS_ID_NAME];
    } else {
        throw "No Story ID found.";
    }
}

function validateAlgoliaConfigExists(logger) {
    if(process.env.ALGOLIA_APP_ID === undefined) {
        throw "Algolia Application ID not defined in environment.";
    }
    if(process.env.ALGOLIA_API_KEY === undefined) {
        throw "Algolia API Key not defined in environment.";
    }
    if(process.env.ALGOLIA_INDEX_NAME === undefined) {
        throw "Algolia Destination Index Name not defined in environment."
    }
}

function getLogger() {
    const LOG_LEVEL = (process.env.LOG_LEVEL!== undefined)?process.env.LOG_LEVEL:"Error";
    const logger = winston.createLogger({
        level: LOG_LEVEL,
        format: winston.format.json(),
        transports: [new winston.transports.Console()],
    });
    return logger;
}

module.exports = {
    stripFields,
    addObjectId,
    getStoryId,
    validateAlgoliaConfigExists,
    getLogger
};
