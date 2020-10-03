// import deps
const fs = require("fs");
const path = require("path");
const util = require("util");
const inquirer = require("inquirer");
const renderHtml = require("./render-html");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

main();

async function main() {
  // prompt user for name of the site
  try {
    const { siteTitle, useJquery, useBootstrap } = await inquirer.prompt([
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
        name: "useBootstrap",
        type: "confirm",
        message: "Include Bootstrap 4?",
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

    await writeFile(
      path.join(siteName, "index.html"),
      renderHtml({ title: siteTitle, useJquery, useBootstrap })
    );

    // save html string in <site-name>/index.html
    console.log(`Created ${siteName}: ${sitePath}`);
  } catch (error) {
    console.log(error);
  }
}
