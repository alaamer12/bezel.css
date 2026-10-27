(function () {
  "use strict";

  var BASE_WIDTH = 375;
  var SHELL_SELECTOR =
    ".pf-shell, .pf-iphone-14-pro, .pf-iphone-x, .pf-pixel-7, .pf-galaxy-s23, [class*='device-'], [class*='marvel-device']";

  function scaleIframe(iframe) {
    var screen = iframe.closest(".pf-screen, .device-screen");
    if (!screen) return;

    var rect = screen.getBoundingClientRect();
    var targetW = rect.width;
    var targetH = rect.height;

    if (targetW === 0 || targetH === 0) return;

    var scale = targetW / BASE_WIDTH;
    var hasHorizontalSafeArea = screen.classList.contains("pf-safe-area-view--horizontal") || 
                                iframe.classList.contains("pf-safe-area-view--horizontal") ||
                                screen.classList.contains("device-screen"); // Default legacy to safe horizontal for now

    // Apply an even more aggressive overlap to ensure sub-pixel gaps are covered.
    // We use a slightly larger scale and negative margins to force the iframe into the bezel.
    // If the horizontal safe area class is present, we revert to standard scale/position.
    var fineScale = hasHorizontalSafeArea ? scale : scale + 0.012;
    iframe.style.width = BASE_WIDTH + "px";
    iframe.style.height = (targetH / scale) + "px";
    iframe.style.transform = "scale(" + fineScale + ") translateZ(0)";
    iframe.style.transformOrigin = "top left";
    iframe.style.position = "absolute";
    iframe.style.top = hasHorizontalSafeArea ? "0" : "-2px";
    iframe.style.left = hasHorizontalSafeArea ? "0" : "-2px";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.style.border = "none";
    iframe.style.background = "transparent";
    iframe.style.willChange = "transform";
    iframe.style.backfaceVisibility = "hidden";
    iframe.style.webkitBackfaceVisibility = "hidden";
    
    // Force the iframe's internal body to be edge-to-edge
    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      if (doc && doc.body) {
        doc.body.style.margin = "0";
        doc.body.style.padding = "0";
      }
    } catch(e) {}

    injectScrollbarStyles(iframe);
  }

  function injectScrollbarStyles(iframe) {
    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || doc.getElementById("pf-scrollbar-styles")) return;

      var shell = iframe.closest(SHELL_SELECTOR);
      if (!shell) return;

      var isIos = shell.classList.contains("pf-iphone-14-pro") || 
                  shell.classList.contains("pf-iphone-x") ||
                  shell.classList.contains("pf-status-bar--ios") ||
                  shell.className.indexOf("device-iphone") !== -1 ||
                  shell.className.indexOf("device-ipad") !== -1;
      var isAndroid = shell.classList.contains("pf-pixel-7") || 
                      shell.classList.contains("pf-galaxy-s23") ||
                      shell.classList.contains("pf-status-bar--android") ||
                      shell.className.indexOf("device-google") !== -1 ||
                      shell.className.indexOf("device-galaxy") !== -1;
      var isNone = shell.classList.contains("pf-scroll-view--none");

      var css = "html, body { border: 0 !important; outline: 0 !important; background: transparent !important; } ";
      if (isNone) {
        css = "html { scrollbar-width: none !important; -ms-overflow-style: none !important; } " +
              "::-webkit-scrollbar { display: none !important; }";
      } else if (isIos) {
        css = "html { overflow-y: overlay; scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.45) transparent; } " +
              "::-webkit-scrollbar { display: block; width: 6px; } " +
              "::-webkit-scrollbar-track { background: transparent; } " +
              "::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.45); border-radius: 10px; border: 1.5px solid transparent; background-clip: padding-box; }";
      } else if (isAndroid) {
        css = "html { overflow-y: overlay; scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.5) transparent; } " +
              "::-webkit-scrollbar { display: block; width: 5px; } " +
              "::-webkit-scrollbar-track { background: transparent; } " +
              "::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.5); border-radius: 0; }";
      }

      if (css) {
        var style = doc.createElement("style");
        style.id = "pf-scrollbar-styles";
        style.textContent = css;
        doc.head.appendChild(style);
      }
    } catch (e) {
      // Cross-origin iframe, cannot inject styles
    }
  }

  function init() {
    window.scaleAllIframes = function () {
      var iframes = document.querySelectorAll(".pf-screen iframe, .device-screen iframe");
      iframes.forEach(function (iframe) {
        scaleIframe(iframe);
      });
    };

    // 1. Initial scale
    var iframes = document.querySelectorAll(".pf-screen iframe, .device-screen iframe");
    iframes.forEach(function (iframe) {
      observeAndScale(iframe);
    });

    // 2. MutationObserver for dynamic iframes
    if (typeof MutationObserver !== "undefined") {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return;

            if (node.tagName === "IFRAME") {
               if (node.closest(".pf-screen, .device-screen")) {
                 observeAndScale(node);
               }
            } else if (node.querySelectorAll) {
              node.querySelectorAll(".pf-screen iframe, .device-screen iframe").forEach(function (iframe) {
                observeAndScale(iframe);
              });
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

  function observeAndScale(iframe) {
    if (iframe._pf_observed) return;
    iframe._pf_observed = true;

    scaleIframe(iframe);
    
    iframe.addEventListener("load", function () {
      scaleIframe(iframe);
    });

    var screen = iframe.closest(".pf-screen, .device-screen");
    if (!screen || typeof ResizeObserver === "undefined") return;
    
    new ResizeObserver(function () {
      scaleIframe(iframe);
    }).observe(screen);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
