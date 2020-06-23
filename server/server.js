const express = require('express');
const connectDatabase = require('./db/db');
const app = express();
const PORT = 5000;

connectDatabase();

app.get('/', (req, res) => {
  res.send('Hello world! Lets make a notes app!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
