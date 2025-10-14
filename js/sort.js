(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function dedupeLines(lines) {
    const seen = {};
    const unique = [];
    for (const line of lines) {
      if (seen[line]) continue;
      seen[line] = true;
      unique.push(line);
    }
    return unique;
  }

  function sortLinesAsc(text) {
    const lines = text.split("\n");
    const unique = dedupeLines(lines);
    unique.sort(function (a, b) {
      return a.localeCompare(b);
    });
    return unique.join("\n");
  }

  function sortLinesDesc(text) {
    const lines = text.split("\n");
    const unique = dedupeLines(lines);
    unique.sort(function (a, b) {
      return b.localeCompare(a);
    });
    return unique.join("\n");
  }

  function label(desc) {
    if (desc) return "Desc";
    return "Asc";
  }

  function valueForStorage(desc) {
    if (desc) return "true";
    return "false";
  }

  function initSortBox() {
    const hasDocument = typeof document !== "undefined";
    if (!hasDocument) return;
    const box = document.getElementById("sort_box");
    if (!box) return;
    const toggle = box.querySelector(".sort_toggle");
    if (!toggle) return;
    const input = box.querySelector("textarea");
    if (!input) return;
    const storedText = app.loadPanel("sort_box");
    if (storedText !== "") input.value = storedText;
    const storedPref = app.loadPref("sort.desc");
    let desc = storedPref === "true";
    toggle.textContent = label(desc);

    function run() {
      const source = input.value;
      let sorted = sortLinesAsc(source);
      if (desc) sorted = sortLinesDesc(source);
      input.value = sorted;
      app.savePanel("sort_box", sorted);
    }

    toggle.addEventListener("click", function () {
      desc = !desc;
      toggle.textContent = label(desc);
      const value = valueForStorage(desc);
      app.savePref("sort.desc", value);
      run();
    });

    input.addEventListener("input", app.debounce(run, 300));
  }

  app.sortLinesAsc = sortLinesAsc;
  app.sortLinesDesc = sortLinesDesc;
  app.initSortBox = initSortBox;
})(typeof globalThis === "undefined" ? window : globalThis);
