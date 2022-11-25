const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.79y2pqi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db("watch-bazar").collection("categories");
        const usersCollection = client.db('watch-bazar').collection('users');

        app.get("/categories", async (req, res) => {
            const query = {}
            const options = await categoriesCollection.find(query).toArray()
            res.send(options);
        })

        app.get("/categories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const option = await categoriesCollection.findOne(query)
            res.send(option)
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' });
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
    }
    finally {

    }

}

run().catch(err => console.log(err));

app.get("/", async (req, res) => {
    res.send("watch-bazar server is running...");
})

app.listen(port, () => console.log("watch-Bazar server is running on", port));