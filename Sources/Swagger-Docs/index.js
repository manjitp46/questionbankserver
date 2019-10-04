/**
 * Using this file as json-refs npm module not working with typescript
 * TODO: Later find a way to remove this file and use directly with typescript
 */

const JsonRefs = require("json-refs");
const path = require("path");
const fs = require("fs");
/**
 *
 * @param {string} location file location where root file exists
 * @param {object} options object that contains json-refs options more info fount @ https://github.com/whitlockjc/json-refs/blob/master/docs/API.md#module_json-refs.resolveRefsAt
 */

async function resolvedRefernceJson(location, options = {}) {
  try {
    var response = null;
    if (options) {
      response = await JsonRefs.resolveRefsAt(location, options);
      return response.resolved;
    } else {
      response = await JsonRefs.resolveRefsAt(location, options);
      return response.resolved;
    }
  } catch (e) {
    throw e;
  }
}

resolvedRefernceJson(path.join(__dirname, "./docs.json")).then(data => {
  fs.writeFileSync(
    path.join(__dirname, "./swagger-docs.json"),
    JSON.stringify(data, null, 4),
    "utf-8"
  );
  console.log("Swagger docs prepared");
});
