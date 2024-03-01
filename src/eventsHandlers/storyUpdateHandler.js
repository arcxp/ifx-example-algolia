const algoliasearch = require("algoliasearch");
const utils = require("../utils/algoliaUtils");
const storyUpdateHandler = (event) => {
  console.log(`Running Story Update Handler`);
  console.log(event);

  try {
    utils.environmentCheck();
  } catch(e) {
    return {"status": `FAILED. ${e}`};
  }

  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
  let index;

  try {
    let outboundRecord = utils.stripFields(event.body);
    utils.addObjectId(outboundRecord);
    index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
    if(index) {
      index.partialUpdateObject(outboundRecord);
    }
  } catch(e) {
    console.error(e);
    return { "status": `failed -- ${e}` }
  }
  return {"status": "successfully updated story in Algolia"}
}

module.exports = storyUpdateHandler;
