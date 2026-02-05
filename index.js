const express = require('express');
const path = require('path');
const { nanoid } = require('nanoid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Set views directory explicitly
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add this debugging route
app.get('/debug', (req, res) => {
  const fs = require('fs');
  const viewsPath = path.join(__dirname, 'views');
  
  res.json({
    __dirname: __dirname,
    viewsPath: viewsPath,
    viewsExists: fs.existsSync(viewsPath),
    viewsContents: fs.existsSync(viewsPath) ? fs.readdirSync(viewsPath) : 'Directory does not exist'
  });
});

// Home page with form
app.get('/', (req, res) => {
  res.render('home');
});

// Create event
app.post('/create', (req, res) => {
  const { eventName, eventDate, eventTime, location, description, organizerName, organizerEmail, registrationLink, theme } = req.body;
  
  const slug = nanoid(8);
  
  db.createEvent({
    slug,
    eventName,
    eventDate,
    eventTime,
    location,
    description,
    organizerName,
    organizerEmail,
    registrationLink,
    theme: theme || 'blue'
  });
  
  res.redirect(`/event/${slug}`);
});

// View event page
app.get('/event/:slug', (req, res) => {
  const event = db.getEvent(req.params.slug);
  
  if (!event) {
    return res.status(404).send('Event not found');
  }
  
  res.render('event', { event, host: req.get('host') });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
