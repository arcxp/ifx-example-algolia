Example code is provided by a community of developers. They are intended to help you get started more quickly, but are not guaranteed to cover all scenarios nor are they supported by Arc XP.

> These examples are licensed under the [MIT license](https://mit-license.org/): THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Reiterated from license above, all code in this example is free to use, and as such, there is NO WARRANTY, SLA or SUPPORT for these examples.

## Description
This example code can be used as a starting point for integrating Algolia as your site's primary search partner. The integration uses the storyID as the Algolia required "objectId" for indexing. Each call to Algolia uses their `.wait()` functionality to properly wait for a full call response.  This can increase response time significantly. For larger data sets or larger indices, this may or may not run closer to the IFX integration timeout limit (60 seconds). Be aware this may need to be changed depending on the size of your index.

## What it does
- The integration will update your Algolia search index when it receives the following events:
  - `story:create` - Adds the story data to your Algolia search index
  - `story:delete` - Removes the story (by storyID) from your Algolia search index
  - `story:update` - Updates the existing story data (by storyID) in your Algolia search index

## What it does not do
- The integration assumed you already have an index up and running in Algolia, it will not create a new index.
- The integration does not perform any searches. Integrating search will need to be done on your front end.
- 
## Secrets needed
You will need to create 4 secrets using the [IFX API](https://dev.arcxp.com/api/ifx/ifx-production/) endpoint `/ifx/api/v1/admin/secret?integrationName=<integrationName>`. You can find these values in your Algolia account settings page.
1. ALGOLIA_API_KEY
2. ALGOLIA_APP_ID
3. ALGOLIA_INDEX_NAME
4. LOG_LEVEL

## Logging
This recipe uses winston as a logger, but feel free to use any logger of your choice. If you decide to log to multiple places, please make sure to include the console as one of your loggers to ensure logs are written to CloudWatch. Secrets can be used as a work-around solution for setting environment variables such as log level on the fly. Secrets are loaded into integrations on every run with no caching, so updates will be seen upon the next invocation of your integration.

## Building your integration

### Prerequisites


1. Create a personal access token with `read:package` scope in your GitHub account. See ["Creating a personal access token."](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

2. Once a PAT is created, there are two ways to install the Node.js SDK dependency. The first option is to create your local .npmrc file directly. Another option is to use npm login command.

    - Create your local .npmrc file directly
      ```
      export GITHUB_TOKEN=<your PAT generated through the GitHub console>
      npm config set @arcxp:registry=https://npm.pkg.github.com/
      echo '//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' >> ~/.npmrc
      ```
    - Use `npm login`
      ```
      npm login --scope=@arcxp --auth-type=legacy --registry=https://npm.pkg.github.com
     
      Username: your GitHub username
      Password: your PAT generated through the GitHub console
      Email: your GitHub email
      ```

### Installation


1. Install NPM packages
   ```
   npm install
   ```
2. Optional: Reset NPM configuration
   ```
   npm config delete @arcxp:registry
   npm logout --registry=https://npm.pkg.github.com/
   ```


## Running your Integration

If all succeeded, then you can run:
```
npm run localTestingServer
```


## Configuration


### Environment Files

Utilize the `.env.{my-environment}` files in the root directory to provide environment specific
configuration to your application. Do not store secrets or api keys in these files, for those see [Secrets](#secrets)


### Secrets
Secrets are managed via the Arc Admin API. Secrets that you add to your integration via that API get placed as environment variables available to your application on the `process.env` object.

To test secrets while running the local development server, you should create a file called `.env` in
the root directory of your project and store them there. **Note: This file containing secrets should NOT be committed to version control.**

## Moving your Integration from local to IFX
In IFX, code is zipped, uploaded, deployed, and promoted.

A nominal deploy process looks as follows:

     │ Bundle ├───────►│ Upload ├──────►│ Deploy ├─────►│ Promote │

You can find more information in ALC: [Bundle Deployment Workflow](https://docs.arcxp.com/alc/en/bundle-deployment-workflow?sys_kb_id=24f19bb687b48210637f315d0ebb355d&id=kb_article_view&sysparm_rank=14&sysparm_tsqueryId=2ed0645947419650a87626c2846d43f3)

### Bundling your code
Once your code is tested locally, it can be bundled into a zip file for uploading to IFX.
```
npm run build
npm run zip
```

### Uploading your bundle
After bundling, upload your bundle to IFX.
```
curl -X POST \
 --location 'https://api.{:org}.arcpublishing.com/ifx/api/v1/admin/bundles/:integrationName' \
 --header 'Authorization: Bearer ' \
 -F 'name=myIntegration-1-1-0' \
 -F 'bundle=@/path/to/zip/myIntegration.zip;type=application/zip'
```

### Deploying your bundle
Once your zip is uploaded, it must be deployed into the IFX framework. This is a discrete step from uploading, as some uploaded bundles may not need to be used or are immediately replaced.
```
POST /ifx/api/v1/admin/bundles/{integrationName}/deploy/{bundleName}
```

### Promoting your bundle
After deploying, your code will be ready to handle invocations, but it is not yet set to be used by default (referred to as being "live").  Promoting your bundle will set it to be the "live" version of your integration that will be invoked.
```
POST /ifx/api/v1/admin/bundles/{integrationName}/promote/{version}
```

### Subscribing to events
Your integration will not be invoked unless you are subscribed to the desired events. You can find more information about this on the [IFX Events](https://docs.arcxp.com/alc/en/ifx-events?id=kb_article_view&sys_kb_id=526d6dcf47841610a87626c2846d4382) page.