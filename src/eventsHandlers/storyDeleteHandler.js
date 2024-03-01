const algoliasearch = require("algoliasearch");
const utils = require("../utils/algoliaUtils");

const storyDeleteHandler = async (event) => {
  console.log(`Running Story Delete Handler`);
  console.log(event.body);

  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
  let index;

  try {
    let storyIdToDelete = utils.getStoryId(event.body);
    index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
    if(index) {
      index.deleteObject(storyIdToDelete);
    }
  } catch(e) {
    console.error(e);
    return { "status": `failed -- ${e}` }
  }
  return {"status": "successfully removed story from Algolia"}
}

module.exports = storyDeleteHandler;
