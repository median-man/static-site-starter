// import deps
const fs = require("fs");
const path = require("path");
const util = require("util");
const inquirer = require("inquirer");
const { renderHtml, BOOTSTRAP_4, RESET, NONE } = require("./render-html");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);

main();

async function main() {
  // prompt user for name of the site
  try {
    const { siteTitle, useJquery, cssOption } = await inquirer.prompt([
      {
        name: "siteTitle",
        type: "input",
        message: "Enter a title for your site: (e.g. My Site)",
      },
      {
        name: "useJquery",
        type: "confirm",
        message: "Include jQuery 3.5 from cdnjs?",
      },
      {
        name: "cssOption",
        type: "list",
        message: "Choose css reset/framework",
        choices: [
          {
            name: "CSS Reset (myerweb.com 2.0)",
            value: RESET,
          },
          {
            name: "Bootstrap 4",
            value: BOOTSTRAP_4,
          },
          {
            name: "None",
            value: NONE,
          },
        ],
      },
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

    if (cssOption === RESET) {
      await addCssReset(path.join(sitePath, "stylesheets/reset.css"));
    }

    await writeFile(
      path.join(siteName, "index.html"),
      renderHtml({ title: siteTitle, useJquery, cssOption })
    );

    // save html string in <site-name>/index.html
    console.log(`Created ${siteName}: ${sitePath}`);
  } catch (error) {
    console.log(error);
  }
}

function addCssReset(destinationPath) {
  const cssResetSourcePath = path.join(__dirname, "./assets/reset.css");
  return copyFile(cssResetSourcePath, destinationPath);
}
