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

function renderHtml({ title, useJquery, useBootstrap }) {
  const jqueryScript =
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg=="crossorigin="anonymous"></script>';
  const jquerySlimScript = `<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>`;
  const popperScript = `<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>`;
  const bs4Script = `<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>`;
  
  const scripts = [];
  if (useJquery && useBootstrap) {
    // don't use slim jquery
    scripts.push(jqueryScript, popperScript, bs4Script);
  } else if (useJquery) {
    scripts.push(jqueryScript);
  } else if (useBootstrap) {
    scripts.push(jquerySlimScript, popperScript, bs4Script);
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>Welcome to ${title}</h1>
  ${scripts.join("\n  ")}
</body>
</html>`;
}
