# You Got This — browser extension

A small heart icon docks itself to the bottom-right corner of every page you
browse. Click it, and a little card pops up with a warm message in your own
recorded voice, plus a soft chime. It closes on its own after ~9 seconds, or
click the X.

## How to install (Chrome or Edge, takes about a minute)

1. Unzip this folder somewhere you won't accidentally delete it (e.g.
   Documents).
2. Open Chrome (or Edge) and go to: `chrome://extensions` (Edge:
   `edge://extensions`)
3. Turn on **Developer mode** (toggle, usually top-right of that page).
4. Click **Load unpacked**.
5. Select this folder (the one containing `manifest.json`).
6. Done — the heart icon should now appear in the bottom-right corner of any
   page you visit.

That's it — no app store, no review process, completely free since it's just
loaded locally on your own browser.

## Currently uses 7 real recordings

| File          | Message                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------|
| `audio/01.m4a` | Hey, you got this. Don't worry about it.                                                          |
| `audio/02.m4a` | Come on, one step at a time. You don't need to win the whole day, just this next minute. You got this. |
| `audio/03.m4a` | You've handled hard things before. This is no different. Just relax.                             |
| `audio/04.m4a` | It's okay to not have it all figured out right now.                                               |
| `audio/05.m4a` | Everyone's proud of you for just trying. You're really doing good.                                |
| `audio/06.m4a` | I believe in you more than you believe in yourself right now, and that's completely fine. Let me hold that for a bit. |
| `audio/07.m4a` | You're closer than you think. Just keep going.                                                    |

## Adding more recordings later

1. Record a new line, save it as `audio/08.m4a` (next number).
2. Open `content.js`, find the `messages` array near the top, and add:

   ```js
   { id: "08", text: "Your new message text here." }
   ```
3. Go back to `chrome://extensions` and click the refresh icon on this
   extension's card — that's it, no other steps needed.

## Notes

- This only shows the icon inside the browser, on browser tabs/pages — it
  won't appear over other apps like Spotify, Notes, or your code editor. If
  you ever want that, it would need to become a small desktop app instead.
- If you ever want to publish this on the Chrome Web Store, that's a separate
  (and not free) process — this version is just for personal use on your own
  browser, which is completely free.
- Audio files only play once Chrome is fully loaded the page — if a site has
  unusual security restrictions, the icon may not appear on it; this is rare
  and mostly affects banking sites etc.
