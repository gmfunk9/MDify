(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function debounce(fn, wait) {
    let timer = null;
    return function () {
      const args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  function attach(id, fn) {
    const hasDocument = typeof document !== "undefined";
    if (!hasDocument) return;
    const box = document.getElementById(id);
    if (!box) return;
    const input = box.querySelector('textarea, [contenteditable="true"]');
    if (!input) return;
    const tagName = input.tagName;
    const isEditable = tagName !== "TEXTAREA";

    function readValue() {
      if (isEditable) return input.innerHTML;
      return input.value;
    }

    function writeValue(value) {
      if (isEditable) {
        input.innerHTML = value;
        return;
      }
      input.value = value;
    }

    const stored = app.loadPanel(id);
    if (stored !== "") writeValue(stored);

    function run() {
      const value = fn(readValue());
      writeValue(value);
      app.savePanel(id, value);
    }

    input.addEventListener("input", debounce(run, 300));
  }

  app.debounce = debounce;
  app.attach = attach;
})(typeof globalThis === "undefined" ? window : globalThis);
