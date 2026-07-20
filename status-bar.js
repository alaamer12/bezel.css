(function () {
  "use strict";

  var WIFI_SVG =
    '<svg class="pf-status-bar__wifi" width="18" height="13" viewBox="0 0 18 13" aria-hidden="true">' +
    '<path d="M9 13C10.1 13 11 12.1 11 11C11 9.9 10.1 9 9 9C7.9 9 7 9.9 7 11C7 12.1 7.9 13 9 13Z" fill="currentColor"/>' +
    '<path d="M15 7.5C13.4 5.9 11.3 5 9 5C6.7 5 4.6 5.9 3 7.5L1.5 6C3.4 4.1 6.1 3 9 3C11.9 3 14.6 4.1 16.5 6L15 7.5Z" fill="currentColor"/>' +
    '<path d="M18 4.5C15.5 2 12.4 0.5 9 0.5C5.6 0.5 2.5 2 0 4.5L1.5 6C3.6 3.9 6.1 2.5 9 2.5C11.9 2.5 14.4 3.9 16.5 6L18 4.5Z" fill="currentColor"/>' +
    "</svg>";

  var SIGNAL_SVG =
    '<svg class="pf-status-bar__signal" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">' +
    '<rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor"/>' +
    '<rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor"/>' +
    '<rect x="10" y="2" width="3" height="10" rx="0.5" fill="currentColor"/>' +
    '<rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor"/>' +
    "</svg>";

  var BATTERY_SVG =
    '<svg class="pf-status-bar__battery" width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">' +
    '<rect x="0.5" y="0.5" width="22" height="12" rx="2.5" fill="none" stroke="currentColor"/>' +
    '<rect x="2.5" y="2.5" width="16" height="8" rx="1.5" fill="currentColor"/>' +
    '<rect x="23.5" y="4" width="2.5" height="5" rx="1" fill="currentColor"/>' +
    "</svg>";

  function formatTime(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  function fillBar(bar) {
    if (bar.children.length > 0) return;
    
    // If user provided manual icons via classes, don't auto-fill
    if (bar.querySelector('[class*="apps-statusbar-"]')) return;

    bar.innerHTML =
      '<span class="pf-status-bar__time apps-statusbar-time">' +
      formatTime(new Date()) +
      "</span>" +
      '<span class="pf-status-bar__icons">' +
      '<span class="apps-statusbar-wifi"></span>' +
      '<span class="apps-statusbar-signal"></span>' +
      '<span class="apps-statusbar-battery"></span>' +
      "</span>";
  }

  function tick() {
    document.querySelectorAll(".pf-status-bar__time, .apps-statusbar-time").forEach(function (el) {
      el.textContent = formatTime(new Date());
    });
  }

  function init() {
    document.querySelectorAll(".pf-status-bar:empty").forEach(fillBar);
    setInterval(tick, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
