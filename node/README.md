# Artemis XV Server

Express/MySQL API for storing ships and per-user unlock state.

## Setup

```sh
cd node
npm install
cp .env.example .env
npm run dev
```

Default database connection:

```txt
host: localhost
user: root
password:
database: artemis
```

Create the database and tables:

```sh
curl -X POST http://localhost:3001/api/setup
```

## API

Create a user:

```sh
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"player-one"}'
```

Create a ship:

```sh
curl -X POST http://localhost:3001/api/ships \
  -H "Content-Type: application/json" \
  -d '{"name":"Scout"}'
```

Get all ships:

```sh
curl http://localhost:3001/api/ships
```

Set a user's ship unlock state:

```sh
curl -X PUT http://localhost:3001/api/users/1/ships/1 \
  -H "Content-Type: application/json" \
  -d '{"unlocked":true}'
```

Get ships with unlock state for a user:

```sh
curl http://localhost:3001/api/users/1/ships
```
