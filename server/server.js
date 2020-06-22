const express = require('express');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello world! Lets make a notes app!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
