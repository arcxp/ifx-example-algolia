const algoliasearch = require("algoliasearch");
const utils = require("../utils/algoliaUtils");
const winston = require('winston');

const storyDeleteHandler = async (event) => {
  const logger = utils.getLogger();
  logger.debug(`Running Story Delete Handler`);
  try {
    utils.environmentCheck();
  } catch(e) {
    logger.error(`Undefined required secret: ${e}`);
    return {"status": `FAILED. ${e}`};
  }
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
  let index;

  try {
    let storyIdToDelete = utils.getStoryId(event.body);
    logger.info(`Removing storyID: ${storyIdToDelete} from Algolia`);
    index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
    if(index) {
      index.deleteObject(storyIdToDelete);
    }
  } catch(e) {
    logger.error(LOG_LEVEL, `Error removing story from Algolia: ${e}`);
    return { "status": `failed -- ${e}` }
  }
  logger.debug(`Successfully removed story from Algolia`);
  return {"status": "successfully removed story from Algolia"}
}

module.exports = storyDeleteHandler;
