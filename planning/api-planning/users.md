### /users/register

#### POST - Create a new account

EXPECTS

- email
- password
- invite_code

STEPS

- check for invite code (express validator): NO? send 400
- check for valid email (express validator): NO? send 400
- check password at least 8 characters (express validator): NO? send 400
- check if invite code is correct: NO? send 401
- normalise email (validatorjs)
- check email is in whitelisted domain: NO? send 403
- check if user with email already exists: YES? send 400
- hash password
- save user to database
- send verification email with link based on user objectId
- send 200

RETURNS

- 200

  - detail: account successfully created, check your inbox for email

- 400

  - title
  - status: 400
  - detail: invalid data/ user already exists

- 401

  - title
  - status: 401
  - detail: invalid invite code

- 403
  - title
  - status: 403
  - detail: email domain not allowed

### /users/:userId/verify-email

#### GET - Verify email

EXPECTS

STEPS

- check for non-empty userId: NO? send 400
- start transaction
- check if user with userId exists in database: NO? send 400
- check if user's email is verified: YES? send 400
- modify user verification attribute
- generate random position
- check if position is taken by another tank
- add tank with 3 HP, 2 R, 0 AP
- end transaction
- send 200

RETURNS

- 200

  - detail: email {email} verified

- 400

  - title
  - status: 400
  - detail: invalid userId supplied/user email already verified

### /users/login

#### POST - Login to an account

EXPECTS

- email
- password

STEPS

- check for valid email (express validator): NO? send 401
- check for non-empty password (express validator): NO? send 401
- normalise email (validatorjs)
- check if user with email exists: NO? send 401
- hash password
- timing safe compare hash
- check if same: NO? send 401
- check if user has verified email: NO? send 403
- sign JWT token
- send 200 with token

RETURNS

- 200

  - token

- 401

  - title
  - status: 401
  - detail: incorrect username or password

- 403

  - title
  - status: 403
  - detail: need to verify your email
