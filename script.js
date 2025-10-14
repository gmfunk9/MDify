// V1.2
const turndown =
  typeof TurndownService === "undefined"
    ? { turndown: (t) => t }
    : new TurndownService();
const mk = typeof marked === "undefined" ? { parse: (t) => t } : marked;

if (turndown.addRule) {
  // Generic semantic blocks (header, main, footer, aside, nav, section)
  turndown.addRule("semanticBlocks", {
    filter: (node) =>
      node.nodeType === 1 &&
      ["HEADER", "MAIN", "FOOTER", "ASIDE", "NAV", "SECTION"].includes(
        node.tagName
      ),
    replacement: (content, node) => {
      const tag = node.tagName.toLowerCase();
      if (tag === "section") return `\n---\n${content}\n---\n`;
      return `\n[block:${tag}]\n${content}\n[/block:${tag}]\n`;
    },
  });

  // Headings: keep markdown style
  turndown.addRule("headings", {
    filter: (node) => node.nodeType === 1 && /^H[1-6]$/.test(node.tagName),
    replacement: function (content, node) {
      const level = Number(node.tagName[1]);
      return "\n" + "#".repeat(level) + " " + content.trim() + "\n";
    },
  });

  // Annotate button-like links (a.elementor-button, a.btn, a.button)
  turndown.addRule("specialLinks", {
    filter: (node) =>
      node.nodeType === 1 &&
      node.tagName === "A" &&
      /\b(elementor-button|btn|button)\b/.test(node.className),
    replacement: function (content, node) {
      const href = node.getAttribute("href") || "";
      return `\n[button-link:${content.trim()}](${href})\n`;
    },
  });

  // Standard links, with internal/external/mailto/tel/nofollow
  turndown.addRule("linkType", {
    filter: (node) =>
      node.nodeType === 1 &&
      node.tagName === "A" &&
      !/\b(elementor-button|btn|button)\b/.test(node.className),
    replacement: function (content, node) {
      const href = node.getAttribute("href") || "";
      let label = "";
      if (href.startsWith("mailto:")) label = " [mailto]";
      else if (href.startsWith("tel:")) label = " [tel]";
      else if (href.startsWith("/")) label = " [internal]";
      else if (href.startsWith("#")) label = " [internal]";
      if (node.getAttribute("target") === "_blank") label += " [newtab]";
      if ((node.rel || "").includes("nofollow")) label += " [nofollow]";
      return `[${content}](${href})${label}`;
    },
  });

  // Buttons (native <button>)
  turndown.addRule("buttonBlock", {
    filter: "button",
    replacement: function (content, node) {
      return `\n[button:${node.textContent.trim()}]\n`;
    },
  });

  // Forms
  turndown.addRule("formBlock", {
    filter: "form",
    replacement: function (content, node) {
      const action = node.getAttribute("action") || "";
      const method = node.getAttribute("method") || "get";
      return `\n[form:action=${action} method=${method}]\n${content}\n[/form]\n`;
    },
  });

  // Table
  turndown.addRule("tableBlock", {
    filter: "table",
    replacement: function (content) {
      return `\n[block:table]\n${content}\n[/block:table]\n`;
    },
  });

    turndown.addRule('detailsBlock', {
    filter: 'details',
    replacement: function(content, node) {
        // Grab <summary> text if present
        const summaryNode = node.querySelector('summary');
        const summary = summaryNode ? summaryNode.textContent.trim() : 'Details';
        // Exclude <summary> from content
        const body = summaryNode
        ? content.replace(summaryNode.outerHTML, '').trim()
        : content.trim();
        return `\n[details: ${summary}]\n${body}\n[/details]\n`;
    }
    });


    turndown.addRule('authorBox', {
    filter: node =>
        node.nodeType === 1 && node.classList.contains('elementor-author-box'),
    replacement: function(content) {
        return `\n[author]\n${content}\n[/author]\n`;
    }
    });





}

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

function replaceDash(text) {
  return text
    .replace(/(\d+)–(\d+)/g, "$1-$2")
    .replace(/–/g, "-")
    .replace(/(\$?\d{1,3}(?:,\d{3})*)—(\$?\d+)/g, "$1-$2")
    .replace(/^ *[-*+] +(\w+( +\w+){0,4})—/gm, (match, p1) => {
      return match.replace(/—/, ":");
    })
    .replace(/(\w{3,}) ?— ?(?=\w{3,})/g, "$1; ")
    .replace(/ ?— ?/g, ", ");           
}

function trimBlank(t) {
  return t
    .split("\n")
    .filter((l) => !/^\s*$/.test(l))
    .join("\n");
}

function stripComments(t) {
  return t
    // JS/CSS-style: /* comment */
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // HTML-style: <!-- comment -->
    .replace(/<!--[\s\S]*?-->/g, "")
    // Python-style: """docstring""" or '''docstring'''
    .replace(/("""|''')[\s\S]*?\1/g, "");
}

function mdToRich(t) {
  return mk.parse(t);
}

// CHANGED: Now works on .innerHTML of a contenteditable
function richToMd(html) {
  return turndown.turndown(html);
}

function htmlToMd(t) {
  return turndown.turndown(t);
}

function mdToHtml(t) {
  return mk.parse(t);
}

function countSyllables(w) {
  const m = w.toLowerCase().match(/[aeiouy]+/g);
  if (!m) return 1;
  return m.length;
}

function extractH2fromHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  const h2s = Array.from(div.querySelectorAll("h2"))
    .map((h) => "## " + h.textContent.trim())
    .filter(Boolean);

  if (h2s.length) return h2s.join("\n");

  const guesses = Array.from(div.querySelectorAll("strong, b, h1, h3"))
    .map((e) => "## " + e.textContent.trim())
    .filter(Boolean);

  return guesses.join("\n");
}

function minifyString(t) {
  return t.replace(/\s+/g, " ").trim();
}

function stats(t) {
  const found = t.match(/\b\w+\b/g);
  const words = found ? found : [];
  const chars = t.length;
  const sentences = t.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paras = t.split(/\n\s*\n/).filter((p) => p.trim()).length;
  let syllables = 0;
  for (const w of words) syllables += countSyllables(w);
  const wps = words.length / Math.max(sentences, 1);
  const spw = syllables / Math.max(words.length, 1);
  const reading = 206.835 - 1.015 * wps - 84.6 * spw;
  const readTime = words.length / 200;
  const speakTime = words.length / 130;
  const freq = {};
  const stops = [
    "the",
    "and",
    "a",
    "to",
    "of",
    "in",
    "is",
    "it",
    "that",
    "for",
  ];
  for (const w of words) {
    const x = w.toLowerCase();
    if (stops.includes(x)) continue;
    if (!freq[x]) freq[x] = 0;
    freq[x] = freq[x] + 1;
  }
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  let dens = "";
  for (const [k, v] of sorted)
    dens += `${k}: ${v} (${((v / words.length) * 100).toFixed(1)}%)\n`;
  return `Words: ${
    words.length
  }\nChars: ${chars}\nSentences: ${sentences}\nParagraphs: ${paras}\nRead min: ${readTime.toFixed(
    2
  )}\nSpeak min: ${speakTime.toFixed(2)}\nFlesch: ${reading.toFixed(
    1
  )}\n${dens}`;
}

function sortLinesAsc(t) {
  const lines = Array.from(new Set(t.split("\n")));
  lines.sort((a, b) => a.localeCompare(b));
  return lines.join("\n");
}

function sortLinesDesc(t) {
  const lines = Array.from(new Set(t.split("\n")));
  lines.sort((a, b) => b.localeCompare(a));
  return lines.join("\n");
}

// Attach logic for textarea and contenteditable blocks
function attach(id, fn) {
  const box = document.getElementById(id);
  if (!box) return;
  const input = box.querySelector('textarea, [contenteditable="true"]');
  if (!input) return;
  const isEditable = input.tagName !== "TEXTAREA";
  const getVal = () => (isEditable ? input.innerHTML : input.value);
  const setVal = (v) =>
    isEditable ? (input.innerHTML = v) : (input.value = v);

  const run = () => setVal(fn(getVal()));
  input.addEventListener("input", debounce(run, 300));
}

if (typeof document !== "undefined") {
  attach("dash_box", replaceDash);
  attach("blank_box", trimBlank);
  attach("comment_box", stripComments);
  attach("md_to_rich", mdToRich);
  attach("rich_to_md", richToMd); // uses .innerHTML
  attach("html_to_md", htmlToMd);
  attach("md_to_html", mdToHtml);
  attach("stat_box", stats);
  attach("rich_to_h2", extractH2fromHTML);
  attach("minify_box", minifyString);
}

function initSortBox() {
  const sortBox = document.getElementById("sort_box");
  if (!sortBox) return;
  const toggle = sortBox.querySelector(".sort_toggle");
  if (!toggle) return;
  const input = sortBox.querySelector("textarea");
  if (!input) return;
  let desc = false;
  const run = () => {
    input.value = desc ? sortLinesDesc(input.value) : sortLinesAsc(input.value);
  };
  toggle.addEventListener("click", () => {
    desc = !desc;
    toggle.textContent = desc ? "Desc" : "Asc";
    run();
  });
  input.addEventListener("input", debounce(run, 300));
}

if (typeof document !== "undefined") {
  initSortBox();
}



(function(){
  const splash = document.getElementById("intro-splash");
  const close = () => splash?.remove();

  document.addEventListener("keydown", close, { once: true });
  document.addEventListener("click", close, { once: true });

  const btn = document.getElementById("splash-close");
  if (btn) btn.addEventListener("click", close);
})();



document.querySelectorAll('.info-icon').forEach(function(icon) {
    icon.addEventListener('mouseenter', showTooltip);
    icon.addEventListener('focus', showTooltip);
    icon.addEventListener('mouseleave', hideTooltip);
    icon.addEventListener('blur', hideTooltip);
    icon.addEventListener('click', showTooltip); // for keyboard access
});

function showTooltip(e) {
    var tooltipBox = document.getElementById('global-tooltip');
    var tooltipContent = this.querySelector('.tooltip');
    if (!tooltipContent) return;
    tooltipBox.innerHTML = tooltipContent.innerHTML;
    tooltipBox.style.display = 'block';
    setTimeout(function(){
        tooltipBox.classList.add('active');
    }, 1);
}
function hideTooltip() {
    var tooltipBox = document.getElementById('global-tooltip');
    tooltipBox.classList.remove('active');
    setTimeout(function(){
        tooltipBox.style.display = 'none';
        tooltipBox.innerHTML = '';
    }, 150);
}


