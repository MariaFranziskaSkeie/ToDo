import express from 'express';
import pgPromise from 'pg-promise';

const pgp = pgPromise();

const db = pgp({
  host: '35.228.23.233',
  port: 5432,
  database: 'todo-maria-database',
  user: 'postgres',
  password: '1)O8$D*`kc?y;o&9',
});

const server = express();
const port = 8080;

server.set('port', port);
server.use(express.static('Frontend'));

server.listen(server.get('port'), '0.0.0.0', () => {
  console.log('Server is running on port', server.get('port'));
});

server.post('/login', express.json(), function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Missing username or password' });
    return;
  }

  db.oneOrNone('SELECT username FROM users WHERE username = $1 AND password = $2', [username, password])
    .then(function (result) {
      console.log('Query result:', result);
      if (!result) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }

      res.status(200).json({ message: 'Login successful' });
    })
    .catch(function (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

server.post('/createUser', express.json(), function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Missing username or password' });
    return;
  }

  db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password])
    .then(function () {
      console.log('User created successfully:', username);
      res.status(201).json({ message: 'User created successfully' });
    })
    .catch(function (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});
