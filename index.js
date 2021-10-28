const express = require('express');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//MongoDb Part

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("EventList");
        const eventCollection = database.collection("event");
        //GET API
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            console.log(events);
            res.send(events);
        })

        //add product
        app.post("/addEvents", (req, res) => {
            console.log(req.body);
            eventCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        // get all order by email query
        app.get("/allEvents/:email", (req, res) => {
            console.log(req.params);
            eventCollection
                .find({ email: req.params.email })
                .toArray((err, results) => {
                    res.send(results);
                });
        });

        //DELETE API
        app.delete('/allEvents/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await eventCollection.deleteOne(query);
            res.json(result);
        })

        //update product
        app.put("/events/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedName = req.body;
            const filter = { _id: ObjectId(id) };

            eventCollection
                .updateOne(filter, {
                    $set: {
                        title: updatedName.title,
                        image: updatedName.image,
                    },
                })
                .then((result) => {
                    res.send(result);
                });
        });




    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})