// option values
const RESET = "reset";
const BOOTSTRAP_4 = "bs4";
const NONE = "none";

function renderHtml({ title, useJquery, cssOption }) {
  const resetCssLink = `<link rel="stylesheet" href="./stylesheets/reset.css">`;
  const bs4CssLink = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">`;
  const jqueryScript =
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg=="crossorigin="anonymous"></script>';
  const jquerySlimScript = `<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>`;
  const popperScript = `<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>`;
  const bs4Script = `<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>`;

  const useBootstrap = cssOption === BOOTSTRAP_4;

  let cssLink;
  if (cssOption === RESET) {
    cssLink = resetCssLink;
  } else if (useBootstrap) {
    cssLink = bs4CssLink;
  } else {
    cssLink = "";
  }

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
  ${cssLink}
</head>
<body>
  <h1>Welcome to ${title}</h1>
  ${scripts.join("\n  ")}
</body>
</html>`;
}

module.exports = { renderHtml, BOOTSTRAP_4, RESET, NONE };
