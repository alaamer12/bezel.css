(function () {
  "use strict";

  var TICK_INTERVAL = 1000; // Check every second for better sync

  function formatTime(date, is12h) {
    var h = date.getHours();
    var m = date.getMinutes();
    var ampm = "";

    if (is12h) {
      ampm = h >= 12 ? " PM" : " AM";
      h = h % 12;
      h = h ? h : 12;
    }

    return (h < 10 && !is12h ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ampm;
  }

  function fillBar(bar) {
    if (!bar || bar.children.length > 0) return;
    if (bar.querySelector('[class*="apps-statusbar-"]')) return;

    var is12h = bar.classList.contains("pf-status-bar--12h");
    var now = new Date();

    bar.innerHTML =
      '<span class="pf-status-bar__time apps-statusbar-time">' +
      formatTime(now, is12h) +
      "</span>" +
      '<span class="pf-status-bar__icons">' +
      '<span class="apps-statusbar-wifi"></span>' +
      '<span class="apps-statusbar-signal"></span>' +
      '<span class="apps-statusbar-battery"></span>' +
      "</span>";
  }

  function tick() {
    var now = new Date();
    document.querySelectorAll(".pf-status-bar__time, .apps-statusbar-time").forEach(function (el) {
      var bar = el.closest(".pf-status-bar");
      var is12h = bar ? bar.classList.contains("pf-status-bar--12h") : false;
      var newTime = formatTime(now, is12h);
      if (el.textContent !== newTime) {
        el.textContent = newTime;
      }
    });
  }

  function init() {
    // 1. Initial fill
    document.querySelectorAll(".pf-status-bar:empty").forEach(fillBar);

    // 2. Reliable Clock Sync
    // We check every second to see if the minute has changed. 
    // This is more reliable than a 60s interval which drifts and doesn't align with system clock.
    setInterval(tick, TICK_INTERVAL);
    tick(); // Run once immediately

    // 3. MutationObserver for dynamic content
    if (typeof MutationObserver !== "undefined") {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return;
            
            // Check if the added node is a status bar
            if (node.matches && node.matches(".pf-status-bar:empty")) {
              fillBar(node);
            }
            
            // Or if it contains a status bar
            if (node.querySelectorAll) {
              node.querySelectorAll(".pf-status-bar:empty").forEach(fillBar);
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
