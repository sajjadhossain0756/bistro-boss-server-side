require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const PORT = process.env.PORT || 6002

const app = express()

app.use(cors())
app.use(express.json())

// db username: bistroBossResturant
// db password: Dy5M5jCzL9vH6OVe



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ahkjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    const database = client.db("bistroBossResturaunt");
    const productCollection = database.collection("allProduct");
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        app.get('/product',async(req,res)=>{
            
            const result = await productCollection.find().toArray()
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('<h1>Welcome to Bistro Boss Restaurant Project</h1>')
})
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
})