const algoliasearch = require("algoliasearch");
const utils = require("../utils/algoliaUtils");
const winston = require('winston');

const storyInsertHandler = async (event) => {
  const logger = utils.getLogger();
  logger.debug(`Running Story Insert Handler`);
  logger.debug(`Full inbound event: ${event}`);
  try {
    utils.validateAlgoliaConfigExists();
  } catch(e) {
    logger.error(`Undefined required secret: ${e}`);
    return {"status": `FAILED. ${e}`};
  }

  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)

  try {
    // only write what is necessary to index
    let outboundRecord = utils.stripFields(event.body);
    utils.addObjectId(outboundRecord);
    let index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
    logger.debug(`Writing event for storyId: ${outboundRecord.objectID} to Algolia`);
    if(index) {
      await index.saveObject(outboundRecord);
    }
  } catch(e) {
    logger.error(`failed to insert story into Algolia -- ${e}`);
    return { "status": `failed -- ${e}` }
  }
  logger.debug(`Successfully inserted story to Algolia`);
  return {"status": "successfully inserted story in Algolia"}
}

module.exports = storyInsertHandler;
