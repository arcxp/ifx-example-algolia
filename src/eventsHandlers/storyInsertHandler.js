const algoliasearch = require("algoliasearch");
const utils = require("../utils/algoliaUtils");

const storyInsertHandler = (event) => {
  console.log(`Running Story Insert Handler`);
  console.log(event);

  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
  let index;

  try {
    let outboundRecord = utils.stripFields(event.body);
    utils.addObjectId(outboundRecord);
    index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
    if(index) {
      index.saveObject(outboundRecord);
    }
  } catch(e) {
    console.error(e);
    return { "status": `failed -- ${e}` }
  }
  return {"status": "successfully inserted story in Algolia"}
}

module.exports = storyInsertHandler;
