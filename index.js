const express = require('express')
const { MongoClient, ListCollectionsCursor } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdsq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect() ; 
        console.log('database connected');

        const database = client.db("finalAssignment");
        const orderCollection = database.collection("orderCollection"); 
        const productCollection = database.collection("productCollection"); 
        const reviewCollection = database.collection("reviewCollection"); 


        // POST ADD PRODUCT 
        app.post('/addProduct',async(req,res)=>{
            const product = req.body;
            // console.log('hit the post api',product);
            const result = await productCollection.insertOne(product)
            res.send(result);
        })

        // GET Product APi 
        app.get('/addProduct',async(req,res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

            // GET API Order
        app.get('/placeOrder', async(req,res)=>{
            const email = req.query.email ;
            const query = {email: email};
            // console.log(query);
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        })

        // POST API ORDER 
        app.post('/placeOrder', async(req,res)=>{
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder)
            console.log('got new user',req.body);
            console.log('added user',result); 
            res.json(result);
        })

        // POST API REVIEW 
        app.post('/review',async(req,res)=>{
            const review = req.body;
            console.log('hit the post api',review);
            const result = await reviewCollection.insertOne(review)
            res.send(result);
        })

        // GET API REVIEW 
        app.get('/review',async(req,res)=>{
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })



    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})