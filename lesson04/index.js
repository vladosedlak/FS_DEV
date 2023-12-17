const jwt = require('jsonwebtoken')
const SECRET_KEY = "my_secret_key"

const payload = {
    email: "user@email.com", id: 5, role: ["admin"]
}

const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" })
console.log(token)

// var waitTill = new Date(new Date().getTime() +  2000);
// while(waitTill > new Date()){}

const decoded = jwt.verify(token, SECRET_KEY)

console.log(decoded)