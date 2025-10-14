(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  let turndownService = null;
  const hasTurndown = typeof root.TurndownService !== "undefined";
  if (!hasTurndown) {
    turndownService = { turndown: function (text) { return text; } };
    turndownService.addRule = function () {};
  }
  if (hasTurndown) turndownService = new root.TurndownService();
  app.turndown = turndownService;

  let markedRef = root.marked;
  const hasMarked = typeof markedRef !== "undefined";
  if (!hasMarked) markedRef = { parse: function (text) { return text; } };
  app.marked = markedRef;
})(typeof globalThis === "undefined" ? window : globalThis);
