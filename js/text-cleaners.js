(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function normalizeDashLine(line) {
    let current = line.replace(/\u2013/g, "\u2014");
    current = current.replace(/(\$?\d[\d,]*)\s*\u2014\s*(\$?\d[\d,]*)/g, "$1-$2");
    current = current.replace(/(\d)\s*-\s*(\d)/g, "$1-$2");
    const listStart = /^\s*[-*+]\s/.test(current);
    if (listStart) return current.replace(/\s*\u2014\s*/g, ": ");
    current = current.replace(/\u2014/g, " - ");
    current = current.replace(/\s{2,}/g, " ");
    return current.trimEnd();
  }

  function replaceDash(text) {
    if (!text) return "";
    const lines = text.split("\n");
    const cleaned = [];
    for (const line of lines) cleaned.push(normalizeDashLine(line));
    return cleaned.join("\n");
  }

  function trimBlank(text) {
    return text
      .split("\n")
      .filter((line) => !/^\s*$/.test(line))
      .join("\n");
  }

  function stripComments(text) {
    let result = text.replace(/\/\*[\s\S]*?\*\//g, "");
    result = result.replace(/<!--[\s\S]*?-->/g, "");
    result = result.replace(/("""|''')[\s\S]*?\1/g, "");
    result = result.replace(/(^|[^:])\/\/.*(?=\n|$)/g, function (_, prefix) {
      return prefix;
    });
    result = result.replace(/(^|\n)\s*#(?![\{!]).*?(?=\n|$)/g, "$1");
    result = result.replace(/{{[\s\S]*?}}/g, "");
    result = result.replace(/{%[\s\S]*?%}/g, "");
    return result;
  }

  function minifyString(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  app.normalizeDashLine = normalizeDashLine;
  app.replaceDash = replaceDash;
  app.trimBlank = trimBlank;
  app.stripComments = stripComments;
  app.minifyString = minifyString;
})(typeof globalThis === "undefined" ? window : globalThis);
