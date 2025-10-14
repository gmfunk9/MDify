(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function bootstrap() {
    const hasDocument = typeof document !== "undefined";
    if (!hasDocument) return;
    app.attach("dash_box", app.replaceDash);
    app.attach("blank_box", app.trimBlank);
    app.attach("comment_box", app.stripComments);
    app.attach("md_to_rich", app.mdToRich);
    app.attach("rich_to_md", app.richToMd);
    app.attach("html_to_md", app.htmlToMd);
    app.attach("md_to_html", app.mdToHtml);
    app.attach("stat_box", app.stats);
    app.attach("rich_to_h2", app.extractH2fromHTML);
    app.attach("minify_box", app.minifyString);
    app.attach("template_box", app.splitTwitterThread);
    app.initSortBox();
    app.initSplash();
    app.initTooltips();
  }

  bootstrap();
  app.bootstrap = bootstrap;
})(typeof globalThis === "undefined" ? window : globalThis);
