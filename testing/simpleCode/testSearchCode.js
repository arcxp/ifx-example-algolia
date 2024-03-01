// hello_algolia.js
const algoliasearch = require('algoliasearch')
require('dotenv').config();

    const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    let results;
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        index.search('exposing').then(({ hits }) => {
            console.log(hits);
        });
