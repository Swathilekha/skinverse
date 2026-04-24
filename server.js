// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // your existing auth routes
const dashboardRoutes = require('./routes/dashboardRoutes'); // existing dashboard routes
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');
const knowledgeGraphRoutes = require('./routes/knowledgeGraphRoutes');



const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', knowledgeGraphRoutes);
app.use(session({
  secret: 'skinverse_secret',
  resave: false,
  saveUninitialized: true
}));

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.redirect('/login'));

app.listen(3000, () => console.log('🌸 Skinverse server running on http://localhost:3000'));
