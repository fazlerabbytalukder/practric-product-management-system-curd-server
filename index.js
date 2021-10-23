const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('running my crud server');
})

//uder: mybduser1
//pass: HeHPXHwtnX5CysZH


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://mybduser1:HeHPXHwtnX5CysZH@cluster0.cnnr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        const database = client.db("prodctmaster");
        const productCollection = database.collection("products");
        //POST API
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            console.log('got a new user', req.body);
            console.log('added user', result);
            res.json(result);
        })
        //GET API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
        //DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            console.log('delete with id', result);
            res.json(result);
        })
        //UPDATE SHOW API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            console.log('delete with id', result);
            res.send(result);
        })

        // app.put('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updateProduct = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upset: true };
        //     const updateDoc = {
        //         $set: {
        //             name: updateProduct.name,
        //             price: updateProduct.price,
        //             quantity: updateProduct.quantity
        //         }
        //     }
        //     const result = await productCollection.updateOne(filter, updateDoc, options);
        //     console.log('updating user', result);
        //     res.json(result);
        // })
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                    quantity: updatedProduct.quantity
                },
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            console.log('updating user', result);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

















app.listen(port, () => {
    console.log('running server on port', port);
})