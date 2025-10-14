(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function initSplash() {
    const hasDocument = typeof document !== "undefined";
    if (!hasDocument) return;
    const splash = document.getElementById("intro-splash");
    if (!splash) return;

    function close() {
      splash.remove();
    }

    document.addEventListener("keydown", function () {
      close();
    }, { once: true });

    document.addEventListener("click", function () {
      close();
    }, { once: true });

    const btn = document.getElementById("splash-close");
    if (btn) {
      btn.addEventListener("click", function () {
        close();
      });
    }
  }

  function showTooltip(event) {
    const tooltipBox = document.getElementById("global-tooltip");
    if (!tooltipBox) return;
    const icon = event.currentTarget;
    if (!icon) return;
    const tooltipContent = icon.querySelector(".tooltip");
    if (!tooltipContent) return;
    tooltipBox.innerHTML = tooltipContent.innerHTML;
    tooltipBox.style.display = "block";
    setTimeout(function () {
      tooltipBox.classList.add("active");
    }, 1);
  }

  function hideTooltip() {
    const tooltipBox = document.getElementById("global-tooltip");
    if (!tooltipBox) return;
    tooltipBox.classList.remove("active");
    setTimeout(function () {
      tooltipBox.style.display = "none";
      tooltipBox.innerHTML = "";
    }, 150);
  }

  function initTooltips() {
    const hasDocument = typeof document !== "undefined";
    if (!hasDocument) return;
    const infoIcons = document.querySelectorAll(".info-icon");
    for (const icon of infoIcons) {
      icon.addEventListener("mouseenter", showTooltip);
      icon.addEventListener("focus", showTooltip);
      icon.addEventListener("mouseleave", hideTooltip);
      icon.addEventListener("blur", hideTooltip);
      icon.addEventListener("click", showTooltip);
    }
  }

  app.initSplash = initSplash;
  app.showTooltip = showTooltip;
  app.hideTooltip = hideTooltip;
  app.initTooltips = initTooltips;
})(typeof globalThis === "undefined" ? window : globalThis);
