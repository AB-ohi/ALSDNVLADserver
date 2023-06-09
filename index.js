const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthn2pl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const InstructorsCollection = client.db("Melody-School").collection("Instructors");
    const classesCollection = client.db("Melody-School").collection("classes");
    // other to do
    const classSelectCollection = client.db("Melody-School").collection("classSelect");

    app.get("/Instructors", async(req,res)=>{
      const result = await InstructorsCollection.find().toArray();
      res.send(result);
    })
    
    
    
    //class site
    app.get("/classes", async(req,res)=>{
      const result = await classesCollection.find().toArray();
      res.send(result);
    })

    //other to do
    app.get("/classSelect", async(req, res)=>{
        const email = req.query.email;
        if(!email){
            res.send([])
        }
        const query ={email:email}
        const result = await classSelectCollection.find().toArray()
        res.send(result);
    })
    app.post("/classSelect",async(req,res)=>{
        const classSelect= req.body;
        console.log(classSelect)
        const result = await classSelectCollection.insertOne(classSelect);
        res.send(result)
    })
    app.get('/')
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', function(req,res) {
    res.send('server is running')
});

app.listen(port, ()=>{
    console.log(`the is school server is running on port: ${port}`)
})