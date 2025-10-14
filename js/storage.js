(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  const storageAllowed = typeof localStorage !== "undefined";

  function panelKey(id) {
    return "mdify.panel." + id;
  }

  function prefKey(id) {
    return "mdify.pref." + id;
  }

  function loadPanel(id) {
    if (!storageAllowed) return "";
    const key = panelKey(id);
    const stored = localStorage.getItem(key);
    if (!stored) return "";
    return stored;
  }

  function savePanel(id, value) {
    if (!storageAllowed) return;
    if (typeof value === "undefined") return;
    const key = panelKey(id);
    localStorage.setItem(key, value);
  }

  function loadPref(id) {
    if (!storageAllowed) return "";
    const key = prefKey(id);
    const stored = localStorage.getItem(key);
    if (!stored) return "";
    return stored;
  }

  function savePref(id, value) {
    if (!storageAllowed) return;
    if (typeof value === "undefined") return;
    const key = prefKey(id);
    localStorage.setItem(key, value);
  }

  app.storageAllowed = storageAllowed;
  app.panelKey = panelKey;
  app.prefKey = prefKey;
  app.loadPanel = loadPanel;
  app.savePanel = savePanel;
  app.loadPref = loadPref;
  app.savePref = savePref;
})(typeof globalThis === "undefined" ? window : globalThis);
