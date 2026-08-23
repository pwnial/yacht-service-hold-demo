# Yacht Service Ltd — Fall 2026

A mock phone app for a working boat yard at 144 Ocean Ave, Amityville NY.
Forty-odd slips, three acres of land storage, and one fall season to get
every boat hauled, winterized, wrapped and blocked before the weather turns.

**Live:** https://pwnial.github.io/yacht-service-hold-demo/

## The idea

Todd already knows every boat in his yard. So the customer never types a
boat name, a length, an engine or a hull type — anywhere. Sal gets a link
that already *is* his boat, makes one decision (which haul week), and taps
once for the $200 hold. Todd gets a different screen: who said yes, who to
chase, sorted so the phone calls come first.

Two phones. The customer does almost nothing; the yard sees everything.

## Screens

| Route | |
|---|---|
| `#/` | Switchboard — pick a phone |
| `#/b/reel-therapy` | Your boat — Todd's plan, one button |
| `#/b/reel-therapy/week` | Which week works |
| `#/b/reel-therapy/pay` | The $200 hold (with a designed decline) |
| `#/b/reel-therapy/confirmed` | You're in |
| `#/b/reel-therapy/status` | How's she doing |
| `#/todd` | Tonight — the chase list |
| `#/todd/boat/:slug` | Boat card, yard notes, actions |
| `#/todd/season` | The season board |

Every boat has a status route: try `#/b/tin-knocker/status` (wrapped and
blocked) or `#/b/miss-peggy/status` (out of the water, wrap goes on Friday).

## How it's built

Four static files, no build step, no backend.

- `index.html` — the shell
- `data.js` — ten boats, five haul weeks, the whole roster
- `art.js` — seven hull profiles drawn as SVG, plus the water, the north
  lot, the shrink wrap and the cleat hitch
- `app.js` — hash router, screens, state
- `styles.css` — the design system

State lives in memory and `localStorage`, so holding a week on Sal's phone
really does move Reel Therapy from *waiting* to *held* on Todd's, and the
tally and the week counts follow. "Put it back" on the switchboard resets it.

Nothing here is real. No card is charged, no text is sent, there is no
Stripe, no Twilio, no server. The only outbound request is Google Fonts.
