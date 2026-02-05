const Database = require('better-sqlite3');
const db = new Database('events.db');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    eventName TEXT NOT NULL,
    eventDate TEXT NOT NULL,
    eventTime TEXT,
    location TEXT,
    description TEXT,
    organizerName TEXT,
    organizerEmail TEXT,
    registrationLink TEXT,
    theme TEXT DEFAULT 'blue',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const createEvent = db.prepare(`
  INSERT INTO events (slug, eventName, eventDate, eventTime, location, description, organizerName, organizerEmail, registrationLink, theme)
  VALUES (@slug, @eventName, @eventDate, @eventTime, @location, @description, @organizerName, @organizerEmail, @registrationLink, @theme)
`);

const getEvent = db.prepare('SELECT * FROM events WHERE slug = ?');

module.exports = {
  createEvent: (data) => createEvent.run(data),
  getEvent: (slug) => getEvent.get(slug)
};
