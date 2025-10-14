(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function collectSentences(text) {
    if (!text) return [];
    const matches = text.match(/[^.!?]+[.!?]*/g);
    if (!matches) {
      const trimmed = text.trim();
      if (trimmed === "") return [];
      return [trimmed];
    }
    const sentences = [];
    for (const raw of matches) {
      const trimmed = raw.trim();
      if (trimmed === "") continue;
      sentences.push(trimmed);
    }
    if (sentences.length > 0) return sentences;
    const fallback = text.trim();
    if (fallback === "") return [];
    return [fallback];
  }

  function splitTwitterThread(text) {
    if (!text) return "";
    const trimmed = text.trim();
    if (trimmed === "") return "";
    const sentences = collectSentences(trimmed);
    if (sentences.length === 0) return "";
    const limit = 240;
    const tweets = [];
    let chunk = "";
    for (const sentence of sentences) {
      const clean = sentence.trim();
      if (clean === "") continue;
      if (chunk === "") {
        chunk = clean;
        continue;
      }
      const candidate = (chunk + " " + clean).trim();
      if (candidate.length <= limit) {
        chunk = candidate;
        continue;
      }
      tweets.push(chunk);
      chunk = clean;
      if (chunk.length <= limit) continue;
      tweets.push(chunk);
      chunk = "";
    }
    if (chunk !== "") tweets.push(chunk);
    if (tweets.length === 0) return "";
    return tweets.join("\n\n");
  }

  const twitterTemplate = "Paste long-form copy here.\n\nClick Split Thread to chunk into ≤240 char tweets.";

  function initTemplatePanel() {
    const hasDocument = typeof document !== "undefined";
    if (!hasDocument) return;
    const box = document.getElementById("template_box");
    if (!box) return;
    const select = box.querySelector("select");
    if (!select) return;
    const area = box.querySelector("textarea");
    if (!area) return;
    const splitBtn = box.querySelector(".thread_split");
    if (!splitBtn) return;
    const storedText = app.loadPanel("template_box");
    if (storedText !== "") area.value = storedText;
    const storedChoice = app.loadPref("template.choice");
    if (storedChoice) select.value = storedChoice;

    function applyTemplate() {
      const choice = select.value;
      app.savePref("template.choice", choice);
      if (choice !== "twitter") return;
      const existing = area.value.trim();
      if (existing !== "") return;
      area.value = twitterTemplate;
      app.savePanel("template_box", area.value);
    }

    splitBtn.addEventListener("click", function () {
      const result = splitTwitterThread(area.value);
      if (result === "") {
        area.value = "";
        app.savePanel("template_box", "");
        return;
      }
      area.value = result;
      app.savePanel("template_box", area.value);
    });

    area.addEventListener("input", function () {
      app.savePanel("template_box", area.value);
    });

    select.addEventListener("change", applyTemplate);

    if (area.value === "") applyTemplate();
  }

  app.collectSentences = collectSentences;
  app.splitTwitterThread = splitTwitterThread;
  app.initTemplatePanel = initTemplatePanel;
  app.twitterTemplate = twitterTemplate;
})(typeof globalThis === "undefined" ? window : globalThis);
