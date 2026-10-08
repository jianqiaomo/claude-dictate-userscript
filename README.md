# Keep Dictate button while typing (for Claude.ai, unofficial)

A small userscript that keeps Claude.ai's Dictate button available while
your message box has text.

## The problem

On Claude.ai, the Dictate button sits where the Send button appears. As soon
as you type or dictate anything, Send replaces Dictate, so you can't continue
dictating. You have to delete your text or send the message first.

## The fix

This script shows Claude.ai's own Dictate button next to Send instead of
underneath it. Type, dictate, then dictate some more, and send when you're
ready. When the box has text, the "Use voice mode" button is hidden to keep
the composer compact.

## Install

1. Install a userscript manager, such as Tampermonkey or Violentmonkey.
2. Install the script from
   [Greasy Fork](https://greasyfork.org/en/scripts/599303-keep-dictate-button-while-typing-for-claude-ai-unofficial),
   or open
   [keep-dictate-button.user.js](https://github.com/jianqiaomo/claude-dictate-userscript/raw/main/keep-dictate-button.user.js)
   and your manager will offer to install it.
3. Reload claude.ai.

## How it works

Claude.ai's composer stacks two "slots" in the same spot: one holds Send,
the other holds Dictate and "Use voice mode". Whichever is not in use is
hidden and disabled with `inert`, but it stays on the page. The script lays
the slots out side by side and keeps the Dictate slot visible and clickable.

## Limitations

- Not affiliated with or endorsed by Anthropic.
- It relies on Claude.ai's page structure (for example
  `data-cds-part="idle-slot"`). If Claude.ai changes its page, the script may
  stop working until it's updated. Please
  [open an issue](https://github.com/jianqiaomo/claude-dictate-userscript/issues)
  if that happens.

## License

MIT
