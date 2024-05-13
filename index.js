const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middileware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.em0grxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const roomCollection = client.db("hotelBooking").collection("rooms");
    const bookingCollection = client.db("hotelBooking").collection("booking");

    //READ data
    app.get("/rooms", async (req, res) => {
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/rooms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: {
          image: 1,
          price_per_night: 1,
          description: 1,
          room_size: 1,
          availability: 1,
          special_offer: 1,
        },
      };
      const result = await roomCollection.findOne(query, options);
      res.send(result);
    });

    //booking
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
      console.log(booking)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hotel booking website server is running");
});

app.listen(port, () => {
  console.log(`hotel booking server is running on port: ${port}`);
});
