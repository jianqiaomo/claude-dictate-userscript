// ==UserScript==
// @name         Keep Dictate button while typing (for Claude.ai, unofficial)
// @namespace    https://jqmo.top/userscripts
// @version      2.0
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
    [data-cds-part="idle-slot"]  -> Dictate + "Use voice mode" buttons
- Box empty:    send-slot gets invisible opacity-0 pointer-events-none + inert
- Box has text: idle-slot gets invisible opacity-0 pointer-events-none + inert

So the Dictate button never leaves the page; it's just hidden and disabled.
This script un-hides it and puts it beside Send instead of on top of it.
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
    [data-cds-part="send-slot"][inert] {
      display: none !important;
    }

    /* When the box has text, hide "Use voice mode" so only Dictate + Send show (keeps it compact) */
    .grid:has(> [data-cds-part="send-slot"]:not([inert])) > [data-cds-part="idle-slot"] [data-cds="SplitDropdownButton"] {
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
