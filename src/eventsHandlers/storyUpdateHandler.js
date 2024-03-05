const algoliasearch = require("algoliasearch");
const utils = require("../utils/algoliaUtils");
const winston = require('winston');

const storyUpdateHandler = async (event) => {
  const logger = utils.getLogger();
  logger.debug(`Running Story Update Handler`);
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
    if(index) {
      logger.debug(`Updating event for storyId: ${outboundRecord.objectID} to Algolia`);
      await index.partialUpdateObject(outboundRecord);
    }
  } catch(e) {
    logger.error(`failed to update story in Algolia -- ${e}`);
    return { "status": `failed -- ${e}` }
  }
  return {"status": "successfully updated story in Algolia"}
}

module.exports = storyUpdateHandler;
