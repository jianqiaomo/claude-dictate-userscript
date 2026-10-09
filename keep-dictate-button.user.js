// ==UserScript==
// @name         Keep Dictate button while typing (for Claude.ai, unofficial)
// @namespace    https://jqmo.top/
// @version      2.1
// @description  Keeps Claude.ai's own Dictate button visible next to Send when the message box has text. May break if Claude.ai changes its page.
// @author       Jianqiao Cambridge Mo
// @homepageURL  https://github.com/jianqiaomo/claude-dictate-userscript
// @supportURL   https://github.com/jianqiaomo/claude-dictate-userscript/issues
// @license      MIT
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/*
How Claude's composer works (from the page's HTML):

- The trailing area has ONE grid cell holding two overlapping "slots":
    [data-cds-part="send-slot"]  -> Send button
    [data-cds-part="idle-slot"]  -> Dictate button (a split button with a
                                    "Microphone" dropdown; older versions also
                                    had a separate "Use voice mode" button)
- Box empty:    send-slot is hidden (invisible opacity-0 pointer-events-none, and/or inert)
- Box has text: idle-slot is hidden (invisible opacity-0 pointer-events-none, and/or inert)

So the Dictate button never leaves the page; it's just hidden and disabled.
This script un-hides it and puts it beside Send instead of on top of it.

v2.1: the "hide voice mode" rule now matches by aria-label. In v2.0 it matched
[data-cds="SplitDropdownButton"], which Claude.ai now uses for Dictate itself,
so the script was hiding the very button it meant to keep.
*/

(function () {
  'use strict';

  const CSS = `
    /* Lay the two slots out side by side instead of stacked in one grid cell */
    .grid:has(> [data-cds-part="send-slot"]):has(> [data-cds-part="idle-slot"]) {
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
    }

    /* Always show the Dictate slot, to the left of Send */
    [data-cds-part="idle-slot"] {
      order: 0;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }
    [data-cds-part="send-slot"] {
      order: 1;
    }

    /* When the box is empty, Send is hidden anyway: remove it from the layout so it leaves no gap */
    [data-cds-part="send-slot"][inert],
    [data-cds-part="send-slot"].invisible {
      display: none !important;
    }

    /* When the box has text, hide "Use voice mode" (if present) so only Dictate + Send show */
    .grid:has(> [data-cds-part="send-slot"]:not([inert]):not(.invisible)) > [data-cds-part="idle-slot"] [aria-label*="voice mode" i] {
      display: none !important;
    }
  `;

  const style = document.createElement('style');
  style.id = 'tm-keep-dictate-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  // `inert` blocks clicks even when the slot is visible, so strip it from the idle slot.
  function unInert(root) {
    root.querySelectorAll('[data-cds-part="idle-slot"][inert]').forEach((el) => el.removeAttribute('inert'));
  }

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes') {
        const el = m.target;
        if (el.getAttribute('data-cds-part') === 'idle-slot' && el.hasAttribute('inert')) {
          el.removeAttribute('inert');
        }
      } else if (m.addedNodes.length) {
        unInert(document);
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['inert'],
  });

  unInert(document);
})();
