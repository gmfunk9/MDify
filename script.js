(function (root) {
  if (!root.MDify) root.MDify = {};
})(typeof globalThis === "undefined" ? window : globalThis);

const hasModule = typeof module !== "undefined";
if (hasModule) {
  const hasExports = module.exports;
  if (hasExports) {
    require('./js/mdify-core.js');
    require('./js/turndown-rules.js');
    require('./js/text-cleaners.js');
    require('./js/markdown-tools.js');
    require('./js/stats.js');
    require('./js/storage.js');
    require('./js/attachers.js');
    require('./js/sort.js');
    require('./js/thread.js');
    require('./js/ui.js');
    require('./js/bootstrap.js');

    let app = globalThis.MDify;
    if (!app) app = {};
    module.exports = {
      replaceDash: app.replaceDash,
      trimBlank: app.trimBlank,
      stripComments: app.stripComments,
      mdToRich: app.mdToRich,
      richToMd: app.richToMd,
      htmlToMd: app.htmlToMd,
      mdToHtml: app.mdToHtml,
      countSyllables: app.countSyllables,
      extractH2fromHTML: app.extractH2fromHTML,
      minifyString: app.minifyString,
      stats: app.stats,
      splitTwitterThread: app.splitTwitterThread,
      sortLinesAsc: app.sortLinesAsc,
      sortLinesDesc: app.sortLinesDesc,
    };
  }
}
