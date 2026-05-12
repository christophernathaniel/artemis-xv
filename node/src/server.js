import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { initializeDatabase, pool } from './db.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '127.0.0.1';

app.use(cors());
app.use(express.json());

function parseBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return null;
}

app.get('/api/health', async (_request, response, next) => {
  try {
    await pool.query('SELECT 1');
    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/setup', async (_request, response, next) => {
  try {
    await initializeDatabase();
    response.status(201).json({ message: 'Database and tables are ready.' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/users', async (request, response, next) => {
  try {
    const username = request.body.username?.trim() || null;
    const [result] = await pool.query('INSERT INTO users (username) VALUES (?)', [username]);

    response.status(201).json({
      id: result.insertId,
      username,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:userId', async (request, response, next) => {
  try {
    const userId = Number(request.params.userId);
    const [rows] = await pool.query('SELECT id, username, created_at FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      response.status(404).json({ error: 'User not found.' });
      return;
    }

    response.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post('/api/ships', async (request, response, next) => {
  try {
    const name = request.body.name?.trim();

    if (!name) {
      response.status(400).json({ error: 'Ship name is required.' });
      return;
    }

    const [result] = await pool.query('INSERT INTO ships (name) VALUES (?)', [name]);

    response.status(201).json({
      id: result.insertId,
      name,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/ships', async (_request, response, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, created_at FROM ships ORDER BY id');
    response.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:userId/ships', async (request, response, next) => {
  try {
    const userId = Number(request.params.userId);
    const [rows] = await pool.query(
      `
        SELECT
          ships.id,
          ships.name,
          COALESCE(user_ships.unlocked, FALSE) AS unlocked
        FROM ships
        LEFT JOIN user_ships
          ON user_ships.ship_id = ships.id
          AND user_ships.user_id = ?
        ORDER BY ships.id
      `,
      [userId],
    );

    response.json(rows.map((ship) => ({
      ...ship,
      unlocked: Boolean(ship.unlocked),
    })));
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:userId/ships/:shipId', async (request, response, next) => {
  try {
    const userId = Number(request.params.userId);
    const shipId = Number(request.params.shipId);
    const [rows] = await pool.query(
      `
        SELECT
          ships.id,
          ships.name,
          COALESCE(user_ships.unlocked, FALSE) AS unlocked
        FROM ships
        LEFT JOIN user_ships
          ON user_ships.ship_id = ships.id
          AND user_ships.user_id = ?
        WHERE ships.id = ?
      `,
      [userId, shipId],
    );

    if (rows.length === 0) {
      response.status(404).json({ error: 'Ship not found.' });
      return;
    }

    response.json({
      ...rows[0],
      unlocked: Boolean(rows[0].unlocked),
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/users/:userId/ships/:shipId', async (request, response, next) => {
  try {
    const userId = Number(request.params.userId);
    const shipId = Number(request.params.shipId);
    const unlocked = parseBoolean(request.body.unlocked);

    if (unlocked === null) {
      response.status(400).json({ error: 'Unlocked must be true or false.' });
      return;
    }

    await pool.query(
      `
        INSERT INTO user_ships (user_id, ship_id, unlocked)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE unlocked = VALUES(unlocked)
      `,
      [userId, shipId, unlocked],
    );

    response.json({
      userId,
      shipId,
      unlocked,
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);

  if (error.code === 'ER_DUP_ENTRY') {
    response.status(409).json({ error: 'Record already exists.' });
    return;
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    response.status(400).json({ error: 'User or ship does not exist.' });
    return;
  }

  response.status(500).json({ error: 'Server error.' });
});

app.listen(port, host, () => {
  console.log(`Artemis server listening on http://${host}:${port}`);
});
