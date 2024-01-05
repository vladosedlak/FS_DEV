require('dotenv').config()

const fs = require('fs/promises')
const express = require('express')
const fileUpload = require("express-fileupload")
const { Pool } = require('pg');


const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000
const uploadPath = './public/images'

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload())
app.use(express.static('public'))



app.get('/', (req, res) => {
    res.json({ health: "OK" })
});



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function getPostgresVersion() {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT version()');
    console.log(response.rows[0]);
  } finally {
    client.release();
  }
}

//getPostgresVersion();


app.get('/posts', async (req,res) => {
    const client = await pool.connect()
    const posts = await client.query('SELECT * FROM posts');
    res.json({posts:posts.rows})
    console.log(res.rows[0])
 
    client.release()
})

app.get('/posts/:id', async (req,res) => {
    const id_post = req.params.id;
    const client = await pool.connect();
    const posts = await client.query('SELECT * FROM posts WHERE id = ' + id_post);
    res.json({posts:posts.rows});
    console.log(posts.rows[0]);
 
    client.release();
})

const uploadNewPost = async (user_id, content) => {
  
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO "posts" ("user_id", "content") VALUES ($1, $2)', [user_id, content]);
    client.release();
    return true;

  } catch (error) {
      console.error(error);
      return false;

  } 

}

const insertNewUser = async (username, password) => {
  
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO "users" ("username", "password") VALUES ($1, $2)', [username, password]);
    client.release();
    return true;

  } catch (error) {
      console.error(error);
      return false;

  } 

}

const deleteUser = async (user_id) => {
  
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM "users" WHERE id = ($1)', [user_id]);
    client.release();
    return true;

  } catch (error) {
      console.error(error);
      return false;

  } 

}

const deletePost = async (post_id) => {
  
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM "posts" WHERE id = ($1)', [post_id]);
    client.release();
    return true;

  } catch (error) {
      console.error(error);
      return false;
  } 

}

app.get('/users/:id', async (req,res) => {
  const id_user = req.params.id;
  const client = await pool.connect();
  const user_obj = await client.query('SELECT id, username, created_at FROM users WHERE id = ' + id_user);
  const user_posts = await client.query('SELECT * FROM posts WHERE user_id = ' + id_user);
  res.json({user:user_obj.rows, userPosts: user_posts.rows});
  await console.log(user_obj.rows[0]);

  client.release();
})

app.post('/api/post', async (req,res) => {
  
  try {
    const {user, post_content} = req.body;
    uploadNewPost(user, post_content).then(result => {
      if (result) {
          console.log('Post inserted');
          res.json({status: "Post uploaded succesfully"});
      } else {
          res.json({status: "Something went wrong"});
      };
    });
    
  } catch (error) {
    res.json({status: "Something went wrong"});
  }
  
})


app.post('/api/newuser', async (req,res) => {
  
  try {
    const {username, password} = req.body;
    insertNewUser(username, password).then(result => {
      if (result) {
          console.log('User inserted');
          res.json({status: "New user was created"});
      } else {
          res.json({status: "Something went wrong"});
      };
    });
    
  } catch (error) {
    res.json({status: "Something went wrong"});
  }
  
})

app.post('/api/deleteuser', async (req,res) => {
  
  try {
    const user_id = req.body.user_id;
    console.log(user_id);
    deleteUser(user_id).then(result => {
      if (result) {
          console.log('User deleted');
          res.json({status: "User was deleted"});
      } else {
          res.json({status: "Something went wrong"});
      };
    });
    
  } catch (error) {
    res.json({status: "Something went wrong"});
  }
  
})

app.post('/api/deletepost', async (req,res) => {
  
  try {
    const post_id = req.body.post_id;
    
    deletePost(post_id).then(result => {
      if (result) {
          console.log('Post deleted');
          res.json({status: "Post was deleted"});
      } else {
          res.json({status: "Something went wrong"});
      };
    });
    
  } catch (error) {
    res.json({status: "Something went wrong"});
  }
  
})



app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})