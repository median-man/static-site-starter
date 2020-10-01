// import deps
const fs = require("fs");
const path = require("path");
const util = require("util");
const inquirer = require("inquirer");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

main();

async function main() {
  // prompt user for name of the site
  try {
    const { siteTitle, useJquery } = await inquirer.prompt([
      {
        name: "siteTitle",
        type: "input",
        message: "Enter a title for your site: (e.g. My Site)",
      },
      {
        name: "useJquery",
        type: "confirm",
        message: "Include jQuery 3.5 from cdnjs?"
      }
    ]);
    const siteName = siteTitle
      .replace(/[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const sitePath = path.join(process.cwd(), siteName);
    const siteFolders = ["images", "scripts", "stylesheets"];

    await mkdir(siteName);
    await Promise.all(
      siteFolders.map((folder) => mkdir(path.join(sitePath, folder)))
    );

    await writeFile(
      path.join(siteName, "index.html"),
      renderHtml({ title: siteTitle, useJquery })
    );

    // save html string in <site-name>/index.html
    console.log(`Created ${siteName}: ${sitePath}`);
  } catch (error) {
    console.log(error);
  }
}

function renderHtml({ title, useJquery }) {
  const jqueryScript = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg=="crossorigin="anonymous"></script>';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>Welcome to ${title}</h1>
  ${useJquery ? jqueryScript : ""}
</body>
</html>`;
}
