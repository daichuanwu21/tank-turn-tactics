### /users/register

#### POST - Create a new account

EXPECTS

- email
- password

STEPS

1. check for valid email (express validator): NO? send 400
2. check password at least 8 characters (express validator): NO? send 400
3. normalise email (validatorjs)
4. check email is in whitelisted domain: NO? send 403
5. check if user with email already exists: YES? send 400
6. hash password
7. save user to database
8. send 200

RETURNS

- 200

  - message: account successfully created, check your inbox for email

- 400

  - title
  - status: 400
  - detail: invalid data/ user already exists

- 403
  - title
  - status: 403
  - detail: email domain not allowed

### /users/login

#### POST - Login to an account

EXPECTS

- email
- password

STEPS

- check for valid email (express validator): NO? send 400
- check for non-empty password (express validator): NO? send 400
- normalise email (validatorjs)
- check if user with email exists: NO? send 401
- hash password
- timing safe compare hash
- check if same: NO? send 401
- sign JWT token
- send 200 with token

RETURNS

- 200

  - token

- 400

  - title
  - status: 400
  - detail: invalid username or password supplied

- 401
  - title
  - status: 401
  - detail: incorrect username or password

### /users/login

#### POST - Login to an account

EXPECTS

- email
- password

STEPS

- check for valid email (express validator): NO? send 400
- check for non-empty password (express validator): NO? send 400
- normalise email (validatorjs)
- check if user with email exists: NO? send 401
- hash password
- timing safe compare hash
- check if same: NO? send 401
- sign JWT token
- send 200 with token

RETURNS

- 200

  - token

- 400

  - title
  - status: 400
  - detail: invalid username or password supplied

- 401
  - title
  - status: 401
  - detail: incorrect username or password
