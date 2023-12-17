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
  
  console.log(` ${req.method} ${req.url} `)
  next()
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers?.authorization
  //const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader)

  if (authHeader.startsWith("Bearer ")){
    token = authHeader.substring(7, authHeader.length);
    try {
    const decoded = jwt.verify(token, secretKey);
    res.json({
      status: "OK"
    }) 
    }
    catch {
    res.status(403).json({
      error: "invalid token"
    }) 
    }
  
    
    } else {
      console.log("hello")
      res.status(403).json({
        error: "invalid token"
    })
    }
  
  next();
}

app.use(requestLogger);
//get token endpoint

app.get('/login', requestLogger, (req,res) => {
   // Create JWT token
   const { username, password } = req.body;

   const user = users.find((u) => u.username === username && u.password === password);
   
   if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
    }
   
   const token = jwt.sign({ user: username, password:password  }, secretKey, { expiresIn: '1h' });
   console.log(token);
   res.send(token);

   // Attach the token to the request for future use
   
   
  //  res.json({
  //   login: true,
  //   token: token
  // });
  // res.send(token);
   
   //console.log(req.body);
   
})

//public endpoint
app.get('/', requestLogger, (req, res) => {
  res.send('Hello World!');
});

//private endpoint
app.get("/greet/:name", requestLogger, authMiddleware, (req, res) => {
    const name = req.params.name

    //const user = req.user

    res.json({
        hello: name
    })
})

app.listen(port, () => {
  console.log(`Example APP listening at http://localhost:${port}`);
});
