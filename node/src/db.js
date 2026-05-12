import mysql from 'mysql2/promise';

export const dbConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'artemis',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  const databaseName = dbConfig.database;
  const bootstrapConnection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  try {
    await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  } finally {
    await bootstrapConnection.end();
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(100) NULL,
      email VARCHAR(100) NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY users_username_unique (username)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ships (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY ships_name_unique (name)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_ships (
      user_id INT UNSIGNED NOT NULL,
      ship_id INT UNSIGNED NOT NULL,
      unlocked BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, ship_id),
      CONSTRAINT user_ships_user_fk
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
      CONSTRAINT user_ships_ship_fk
        FOREIGN KEY (ship_id) REFERENCES ships(id)
        ON DELETE CASCADE
    )
  `);
}
