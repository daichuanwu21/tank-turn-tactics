### /tanks/:tankId/move

#### POST - Move to an adjacent, unoccupied square

EXPECTS

positionX
positionY

STEPS

- check for valid JWT (express-jwt): NO? send 401
- check for valid (in board size range) integer in positionX and positionY: NO? send 400
- check for non-empty tankId: NO? send 400
- start transaction
- check if tank with tankId exists: NO? send 400
- check if tankId's user matches with userId in JWT: NO? send 403
- check if tank has an above 0 health: NO? send 400
- check if target position is current position: NO? send 400
- check if target position is adjcent: NO? send 400
- get a list of other tanks adjacent to current tank
- check if target position is occupied: NO? send 400
- check if there is enough AP : NO? send 400
- remove AP
- update positions of current tank
- save tank
- end transaction
- send 200

RETURNS

- 200

  - detail: moved tank

- 400

  - title
  - status: 400
  - detail: invalid tankId supplied/ invalid move position specified/ a tank is already in the target position/ not enough AP/ dead

- 401

  - title
  - status: 401
  - detail: you are not authenticated

- 403

  - title
  - status: 403
  - detail: you can only move your own tank

### /tanks/:tankId/shoot

#### POST - Shoot another tank within range

EXPECTS

targetTankId

STEPS

- check for valid JWT (express-jwt) -> send 401 - not authenticated
- check for non-empty tankId and targetTankId -> send 400 - invalid tankId supplied
- start transaction
- check if tank with tankId exists -> send 400 - invalid tankId supplied
- check if tankId's user matches with userId in JWT -> send 403 - cannot control another person's tank
- check if tank has an above 0 health -> send 400 - you are dead
- check if tank has enough AP -> send 400 - not enough AP
- get list tanks within range
- check if tank exists in range -> send 400 - tank not found in range
- check if tank is already dead -> send 400 - target already dead
- remove AP from tank
- remove HP from target tank
- if target tank is dead, transfer AP
- save tank
- save target tank
- end transaction
- send 200 - shot tank

RETURNS

- 200
- 400
- 401
- 403

### /tanks/:tankId/upgrade-range

#### POST - Upgrade your own range

### /tanks/:tankId/add-health-point

#### POST - Adds one HP to yourself
