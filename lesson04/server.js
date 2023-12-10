const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')

const secretKey = "my_secret_key"
const users = [
    { username: "user1", password: "12345" },
    { username: "user2", password: "secure_password" }
]



const app = express();
app.use(express.json())
app.use(bodyParser.json());
const port = 3000;

const requestLogger = (req, res, next) => {
  
  console.log(` ${req.method} ${req.url} ${req.body.username} `)
  next()
}

const authMiddleware = (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  // Check if user exists in the users list
  const user = users.find((u) => u.username === username && u.password === password);
  

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Create JWT token
  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

  // Attach the token to the request for future use
  req.token = token;
  console.log(req.body);

  next();
}

//public endpoint
app.get('/', requestLogger, (req, res) => {
  res.send('Hello World!');
});

//private endpoint
app.post("/greet/:name", requestLogger, authMiddleware, (req, res) => {
    const name = req.params.name

    //const user = req.user

    res.json({
        hello: name
    })
})

app.listen(port, () => {
  console.log(`Example APP listening at http://localhost:${port}`);
});
