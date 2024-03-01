// Customize the fields that are needed in search results and to be removed from the algolia record.
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

module.exports = {
    stripFields,
    addObjectId,
    getStoryId
};
