const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { get } = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfwzc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const serviceCollection = client.db('great-website').collection('greatService');
        const orderCollection = client.db('great-website').collection('order');

        app.get('/greatService', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/greatService/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        // POST 

        app.post('/greatService', async(req, res) => {

            const newService = req.body;
            console.log(newService);
            const result = await serviceCollection.insertOne(newService)
            res.send(result);

        });

        // Ordser collections api all here
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = {email};
            const corsur = orderCollection.find(query); 
            // shoop golla pate hola aibabe likte hobe.
            const orders = await corsur.toArray();
            res.send(orders);

        })



        app.post('/order', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);

        })

    }
    finally {

    };

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('rinning great website');
});

app.listen(port, () => {
    console.log('Lissing to port', port);
})
