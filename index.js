require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection = database.collection("users");
    const productCollection = database.collection("allProduct");
    const cartCollection = database.collection("cartItems")
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // get all user from database
        app.get('/users',async(req,res)=>{
            const result = await userCollection.find().toArray()
            res.send(result)
        })
        // create user in database
        app.post('/users',async(req,res)=>{
            const userData = req.body;
            const query = {email: userData.email}
            const existanceUser = await userCollection.findOne(query);
            if(existanceUser){
                return res.send({message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(userData)
            res.send(result)
        })
        // delete user from database
        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        // make admin user in database
        app.patch('/users/admin/:id',async(req,res)=>{
            const id = req.params.id
            const filter = {_id: new ObjectId(id)}
            const updatedDoc = {
                $set:{
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })
        app.get('/product',async(req,res)=>{
            
            const result = await productCollection.find().toArray()
            res.send(result)
        })
        
        // cart item start here
        // get cart items
        app.get('/carts', async(req,res)=>{
            const email = req.query.email;
            const query = {email: email}
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })
        // create cart items
        app.post('/carts', async(req,res)=>{
            const cartItem = req.body;
            const result = await cartCollection.insertOne(cartItem)
            res.send(result)
        })
        // delete items
        app.delete('/carts/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await cartCollection.deleteOne(query)
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