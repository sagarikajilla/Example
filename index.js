const express = require('express');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'SAjilla@!2345', // Your MySQL password
  database: 'example_db'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Routes

// GET all users
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500);
      res.send('Error fetching users');
      return;
    }
    res.json(results);
   //res.send('successful');
  });
});
app.post('/users', (req, res) => {
  const { username, email } = req.body;
  connection.query(`INSERT INTO users (username, email) VALUES ('${username}', '${email}')`, (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500);
      res.send('Error creating user');
      return;
    }
    res.status(201);
    res.send('User created successfully');
  });
});
app.delete('/users/:userName', (req, res) => {
  const userName = req.params.userName;

  connection.query('DELETE FROM users WHERE username = userName', (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500);
      res.send('Error deleting user');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404);
      res.send('User not found');
      return;
    }

    res.send('User deleted successfully');
  });
});
app.put('/users/:userName', (req, res) => {
  const userName = req.params.userName;
  const updatedUserData = req.body;

  connection.query('UPDATE users SET ? WHERE username = userName', [updatedUserData], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Error updating user' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully' });
  });
});
