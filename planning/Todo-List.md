### High-priority

- add a notification system, things that should trigger a notification:

  - you receiving an AP or HP from another player
  - you receiving an AP for the day
  - you getting hit by a player
  - you dying

- implement real-time map state synchronization between client and server with something like socket.IO

- implement sending verification email upon registration

- FRONTEND: add registration and sign in support
- FRONTEND: map API endpoints to buttons on bottom accordion

### Medium-priority

- add rate-limiting for registration
- add COOP, COEP, etc for frontend (https://scotthelme.co.uk/coop-and-coep/), maybe just a footnote in deployment recommendations?
- add stricter password policy
- add bsd-0 clause/public domain equivalent license to project and readme

### Low-priority

- handle uncaught exceptions and or promises with sentry (privacy implications must be considered)
- setup code review with sonaar?

- centralised tank logic (e.g. one controller for adding, moving, shooting, giving AP and etc?)
