// import deps
const fs = require("fs");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);

main();

async function main() {
  // prompt user for name of the site

  /*
    create the following folders:
      - <site-name> (all lower case, use dashes for spaces)
        - images
        - scripts
        - stylesheets
  */

  try {
    await writeFile("index.html", renderHtml({ title: "My Site" }));
    // save html string in <site-name>/index.html
    console.log("Created SITE_NAME: PATH_TO_SITE_FOLDER");
  } catch (error) {
    console.log(error);
  }
    
}

function renderHtml({ title }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>Welcome to ${title}</h1>
</body>
</html>`;
}
