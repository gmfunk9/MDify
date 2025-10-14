(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function mdToRich(text) {
    const markedRef = app.marked;
    return markedRef.parse(text);
  }

  function richToMd(html) {
    const turndown = app.turndown;
    return turndown.turndown(html);
  }

  function htmlToMd(html) {
    const turndown = app.turndown;
    return turndown.turndown(html);
  }

  function mdToHtml(text) {
    const markedRef = app.marked;
    return markedRef.parse(text);
  }

  function extractH2fromHTML(html) {
    const hasDocument = typeof document !== "undefined";
    if (!hasDocument) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    const headings = [];
    const h2List = div.querySelectorAll("h2");
    for (const node of h2List) {
      const text = node.textContent.trim();
      if (text === "") continue;
      headings.push("## " + text);
    }
    if (headings.length > 0) return headings.join("\n");
    const guesses = [];
    const altNodes = div.querySelectorAll("strong, b, h1, h3");
    for (const node of altNodes) {
      const text = node.textContent.trim();
      if (text === "") continue;
      guesses.push("## " + text);
    }
    return guesses.join("\n");
  }

  app.mdToRich = mdToRich;
  app.richToMd = richToMd;
  app.htmlToMd = htmlToMd;
  app.mdToHtml = mdToHtml;
  app.extractH2fromHTML = extractH2fromHTML;
})(typeof globalThis === "undefined" ? window : globalThis);
