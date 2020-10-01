// import deps
const fs = require("fs");
const path = require("path");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

main();

async function main() {
  // prompt user for name of the site

  try {
    const siteTitle = "My Super Site";
    const siteName = siteTitle.replace(/\s+/g, "-").toLowerCase();
    const sitePath = path.join(process.cwd(), siteName)
    const siteFolders = ["images", "scripts", "stylesheets"];

    await mkdir(siteName);
    await Promise.all(
      siteFolders.map((folder) => mkdir(path.join(sitePath, folder)))
    );

    await writeFile(
      path.join(siteName, "index.html"),
      renderHtml({ title: siteTitle })
    );

    // save html string in <site-name>/index.html
    console.log(`Created ${siteName}: ${sitePath}`);
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
