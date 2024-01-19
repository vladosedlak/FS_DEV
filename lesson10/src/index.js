import dotenv from 'dotenv'
import express from 'express'
import { Redis } from 'ioredis'
import * as pg from 'pg'
const { Pool } = pg.default

dotenv.config()
const app = express()
const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    db: process.env.REDIS_DB
});

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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

const client = await pool.connect();

console.log(`REDIS PING: ${await redis.ping()}`)

app.use(async(req, res, next) => {
    await redis.incr(req.url)
    //await redis.set("redis_test", "test")
    next()
})

app.get('/', async (req, res) => {
    res.json({ status: "ok" })
})

app.get('/stats', async(req, res) => {
    const keys = await redis.keys("*")
    const values = await redis.mget(keys)
    const stats = keys.map((key, index) => {
        return { [key]: values[index] }
    })
    res.json({ stats })
})

app.get('/article/:id', async (req, res) => {
    
    const id_post = req.params.id;
    const red_exist = await redis.exists('post'+id_post)
    if (red_exist === 1) {
        console.log("article exists in redis")
            redis.get('post'+id_post, function(err, object) {
                
                res.json({
                    article: {
                        id: req.params.id,
                        content:object
                    }
                })
            })
    } else {
        console.log("article does not exist in redis");
        try {
            const post = await client.query('SELECT * FROM posts WHERE id = ' + id_post);
            console.log(post.rows[0].content);
            res.json({
                article: {
                    id: req.params.id,
                    content:post.rows[0].content
                }
            })
            redis.set('post'+id_post,post.rows[0].content);
        } catch (e) {
            console.error(e);
            res.json({
                status:`Article with id:${id_post} does not exist in database`
            })
        }
        
    }
   
})


app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})