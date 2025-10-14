(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;
  const turndown = app.turndown;
  if (!turndown) return;
  const canAddRule = typeof turndown.addRule === "function";
  if (!canAddRule) return;

  function isElement(node) {
    if (!node) return false;
    if (node.nodeType !== 1) return false;
    return true;
  }

  function isSemanticBlock(node) {
    if (!isElement(node)) return false;
    const allowed = ["HEADER", "MAIN", "FOOTER", "ASIDE", "NAV", "SECTION"];
    if (!allowed.includes(node.tagName)) return false;
    return true;
  }

  function replaceSemantic(content, node) {
    if (!node) return content;
    const tag = node.tagName.toLowerCase();
    if (tag === "section") return "\n---\n" + content + "\n---\n";
    return "\n[block:" + tag + "]\n" + content + "\n[/block:" + tag + "]\n";
  }

  function isHeading(node) {
    if (!isElement(node)) return false;
    const tag = node.tagName;
    if (!/^H[1-6]$/.test(tag)) return false;
    return true;
  }

  function replaceHeading(content, node) {
    if (!node) return content;
    const raw = node.tagName;
    const level = Number(raw[1]);
    const header = Array(level).fill("#").join("");
    return "\n" + header + " " + content.trim() + "\n";
  }

  function isButtonLink(node) {
    if (!isElement(node)) return false;
    if (node.tagName !== "A") return false;
    let classes = node.className;
    if (!classes) classes = "";
    const patterns = ["elementor-button", "btn", "button"];
    for (const marker of patterns) {
      if (classes.indexOf(marker) !== -1) return true;
    }
    return false;
  }

  function replaceButtonLink(content, node) {
    if (!node) return content;
    let href = node.getAttribute("href");
    if (!href) href = "";
    const text = node.textContent.trim();
    return "\n[button-link:" + text + "](" + href + ")\n";
  }

  function isStandardLink(node) {
    if (!isElement(node)) return false;
    if (node.tagName !== "A") return false;
    if (isButtonLink(node)) return false;
    return true;
  }

  function replaceStandardLink(content, node) {
    if (!node) return content;
    let href = node.getAttribute("href");
    if (!href) href = "";
    let label = "";
    const isMail = href.indexOf("mailto:") === 0;
    if (isMail) label += " [mailto]";
    const isTel = href.indexOf("tel:") === 0;
    if (isTel) label += " [tel]";
    const isInternalStart = href.indexOf("/") === 0;
    if (isInternalStart) label += " [internal]";
    const isHash = href.indexOf("#") === 0;
    if (isHash) label += " [internal]";
    let target = node.getAttribute("target");
    if (!target) target = "";
    const isBlank = target === "_blank";
    if (isBlank) label += " [newtab]";
    let rel = node.rel;
    if (!rel) rel = "";
    const hasNoFollow = rel.indexOf("nofollow") !== -1;
    if (hasNoFollow) label += " [nofollow]";
    return "[" + content + "](" + href + ")" + label;
  }

  function replaceButton(content, node) {
    if (!node) return content;
    const text = node.textContent.trim();
    return "\n[button:" + text + "]\n";
  }

  function replaceForm(content, node) {
    if (!node) return content;
    let action = node.getAttribute("action");
    if (!action) action = "";
    let method = node.getAttribute("method");
    if (!method) method = "get";
    return "\n[form:action=" + action + " method=" + method + "]\n" + content + "\n[/form]\n";
  }

  function replaceTable(content) {
    return "\n[block:table]\n" + content + "\n[/block:table]\n";
  }

  function isDetails(node) {
    if (!isElement(node)) return false;
    if (node.tagName !== "DETAILS") return false;
    return true;
  }

  function replaceDetails(content, node) {
    if (!node) return content;
    const summaryNode = node.querySelector("summary");
    let summary = "Details";
    if (summaryNode) summary = summaryNode.textContent.trim();
    let body = content.trim();
    if (summaryNode) {
      const markup = summaryNode.outerHTML;
      body = body.replace(markup, "").trim();
    }
    return "\n[details: " + summary + "]\n" + body + "\n[/details]\n";
  }

  function isAuthorBox(node) {
    if (!isElement(node)) return false;
    const classes = node.classList;
    if (!classes) return false;
    const hasContains = typeof classes.contains === "function";
    if (!hasContains) return false;
    const match = classes.contains("elementor-author-box");
    if (!match) return false;
    return true;
  }

  function replaceAuthor(content) {
    return "\n[author]\n" + content + "\n[/author]\n";
  }

  turndown.addRule("semanticBlocks", {
    filter: function (node) {
      return isSemanticBlock(node);
    },
    replacement: function (content, node) {
      return replaceSemantic(content, node);
    },
  });

  turndown.addRule("headings", {
    filter: function (node) {
      return isHeading(node);
    },
    replacement: function (content, node) {
      return replaceHeading(content, node);
    },
  });

  turndown.addRule("specialLinks", {
    filter: function (node) {
      return isButtonLink(node);
    },
    replacement: function (content, node) {
      return replaceButtonLink(content, node);
    },
  });

  turndown.addRule("linkType", {
    filter: function (node) {
      return isStandardLink(node);
    },
    replacement: function (content, node) {
      return replaceStandardLink(content, node);
    },
  });

  turndown.addRule("buttonBlock", {
    filter: "button",
    replacement: function (content, node) {
      return replaceButton(content, node);
    },
  });

  turndown.addRule("formBlock", {
    filter: "form",
    replacement: function (content, node) {
      return replaceForm(content, node);
    },
  });

  turndown.addRule("tableBlock", {
    filter: "table",
    replacement: function (content) {
      return replaceTable(content);
    },
  });

  turndown.addRule("detailsBlock", {
    filter: function (node) {
      return isDetails(node);
    },
    replacement: function (content, node) {
      return replaceDetails(content, node);
    },
  });

  turndown.addRule("authorBox", {
    filter: function (node) {
      return isAuthorBox(node);
    },
    replacement: function (content) {
      return replaceAuthor(content);
    },
  });
})(typeof globalThis === "undefined" ? window : globalThis);
