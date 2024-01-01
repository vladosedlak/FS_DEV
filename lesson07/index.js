import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import filestorage from 'filestorage'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';


import { S3Client, ListObjectsV2Command, ListBucketsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload())


const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: 'local',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    }
});


//S3 endpointy
app.get('/buckets', async (req, res) => {
  const command = new ListBucketsCommand({})
  try {
      const { Owner, Buckets } = await client.send(command)
      res.json({
          owner: Owner.DisplayName,
          buckets: Buckets
      })
  } catch(e) {
      console.error(e)
      res.status(400).json({
          error: e.message
      })
  }
})

app.post('/supload', async(req, res) => {
  let file = req.files.image_field

  const command = new PutObjectCommand({
      Bucket: 'lesson7',
      Key: file.name,
      Body: Buffer.from(file.data, 'binary')
  })

  try {
      const response = await client.send(command)
      res.json({
          Status:"File has been uploaded"
      })
  } catch (e) {
      console.error(e)
      res.status(400).json({
          error: e.message
      })
  }
})

app.post('/sdelete/:name', async (req,res) => {
  const name = req.params.name;
  const command = new DeleteObjectCommand({
    Bucket: "lesson7",
    Key: name,
  });
  try {
    const response = await client.send(command);
    console.log(response);
    res.json({Status:"File has been deleted"})
  } catch (err) {
    console.error(err);
  }
});

app.get('/sdownload/:name', async (req,res) => {
  const name = req.params.name;
  const command = new GetObjectCommand({
    Bucket: "lesson7",
    Key: name,
  });
  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body;
    console.log(str);
    res.json({Status: "File has been downloaded"});
  } catch (err) {
    console.error(err);
  }
})

app.get('/slist', async (req,res) => {
  const command = new ListObjectsV2Command({
    Bucket: "lesson7",
    
    MaxKeys: 100,
  });

  try {
    let isTruncated = true;

    console.log("Your bucket contains the following objects:\n");
    let contents = "";

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await client.send(command);
      const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
      contents += contentsList + "\n";
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    console.log(contents);
    res.json({response:"List of files: "+contents})
  } catch (err) {
    console.error(err);
  }
})



app.get('/', (req, res) => {
    res.json({status: "ok"})
});

//local file storage endpointy
app.post('/upload', function(req, res) {
    
    let data = req.files.image_field.data;
    let filename = req.files.image_field.name;
    
    fs.writeFile("./public/upload/"+filename, data, (err) => {
      if (err) throw err;
    })
    
    console.log("File uploaded succesfully")
    
});

app.get('/download/:name', function(req,res) {
  const path = req.params.name;
    
  fs.readFile("./public/upload/"+path, 'utf8', (err,data) => {
    if (err) throw err;
    res.json({Content: data})
    console.log("File has been downloaded")
  })
});

app.post('/delete/:name', function(req,res) {
  const path = req.params.name;
  
    
  fs.unlink("./public/upload/"+path, (err) => {
    if (err) throw err;
    res.json({Status: "file has been deleted"})
    console.log("File has been deleted")
  })
});

app.get('/list', function(req,res) {
  
    
  fs.readdir("./public/upload/", (err,files) => {
    if (err) throw err;
    
    files.forEach(function (file) {
      console.log(file); 
    });
    
    res.json({Status:"Files have been listed"});
    
  })
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})