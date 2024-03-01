const algoliasearch = require('algoliasearch')

const fs = require("fs");
const inputJSON = require("../../contentAPIExampleUpdate.json");
require('dotenv').config();

// Connect and authenticate with your Algolia app
(async() => {

    const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    let results;
    try {
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        results = await index.partialUpdateObject(inputJSON);
    } catch (e) {
        console.error(e);
    }
    console.log(results);
})();
