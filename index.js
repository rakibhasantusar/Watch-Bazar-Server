const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.79y2pqi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });

async function run() {
    try {
        const categoriesCollection = client.db("watch-bazar").collection("categories");
        const usersCollection = client.db('watch-bazar').collection('users');
        const watchCollection = client.db('watch-bazar').collection('watchCategory')
        const myOrderCollection = client.db('watch-bazar').collection('myOrders')

        app.get("/categories", async (req, res) => {
            const query = {}
            const options = await categoriesCollection.find(query).toArray()
            res.send(options);
        })
        app.get("/wathcCategories", async (req, res) => {
            const query = {}
            const options = await watchCollection.find(query).toArray()
            res.send(options);
        })

        app.get("/categories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const option = await categoriesCollection.findOne(query)
            res.send(option)
        })
        app.get("/wathcCategories/:name", async (req, res) => {
            const name = req.params.name;
            const query = { name: name }
            const option = await watchCollection.find(query).toArray()
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

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });
        app.get('/booking', async (req, res) => {
            const query = {};
            const users = await myOrderCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/users/seller', async (req, res) => {
            const query = { role: 'seller' };
            const options = await usersCollection.find(query).toArray()
            console.log(options);
            res.send(options);
        })
        app.get('/users/buyer', async (req, res) => {
            const query = { role: 'buyer' };
            const options = await usersCollection.find(query).toArray()
            console.log(options);
            res.send(options);
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.post("/wathcCategories", async (req, res) => {
            const product = req.body;
            const options = await watchCollection.insertOne(product)
            res.send(options);
        })
        app.post('/booking', async (req, res) => {
            const user = req.body;
            const result = await myOrderCollection.insertOne(user);
            res.send(result);
        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query)
            res.send(result);
        })
        app.delete("/wathcCategories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await watchCollection.deleteOne(query)
            res.send(result);
        })
    }
    finally {

    }

}

run().catch(err => console.log(err));

app.get("/", async (req, res) => {
    res.send("watch-bazar server is running...");
})

app.listen(port, () => console.log("watch-Bazar server is running on", port));