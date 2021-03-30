const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const dbName = 'GettingStartedWithMongoDB';
const collectionName = 'Products';
const dbUser = 'mazhar';
const password = 'mazhar';

const uri = "mongodb+srv://mazhar:mazhar@cluster0.bdeyr.mongodb.net/GettingStartedWithMongoDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    ////////////SENDING A MASSAGE//////////
    // res.send('Hallow from port 3000')

    ////////////SENDING A FILE//////////
    res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
    const productCollection = client.db("GettingStartedWithMongoDB").collection("Products");
    // // perform actions on the productCollection object

    /////////////DATA / FILE OUTPUT////////////////
    app.get("/products", (req, res) => {
        productCollection.find({})
            // .limit(4)
            .toArray((err, document) => {
                res.send(document);
            })
    })

    // //////////////DATA OUTPUT////////////////////
    // //////////////CRUD READ////////////////////
    app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, document) => {
            res.send(document[0]);
        })
    })

    // //////////////DATA INPUT////////////////////
    // //////////////CRUD CREATE/WRITE////////////////////
    // const product = { name: "modhu", price: 500, quantity: 20 };
    // productCollection.insertOne(product)
    // .then(result => {
    //     // console.log(result);
    //     // console.log('Product', product.name, 'added');
    //     console.log('Product name:', result.ops[0].name, '\nquantity:',  result.ops[0].quantity, '\nID:', result.ops[0]._id, '\nadded');
    // })


    ////////////////FILE INPUT////////////////////
    ////////////////CRUD CREATE////////////////////
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        console.log(product);
        productCollection.insertOne(product)
            .then(result => {
                // console.log(result);
                console.log('Product name:', result.ops[0].name, '\nquantity:', result.ops[0].quantity, '\nID:', result.ops[0]._id, '\nProduct added successfully');
                
                // res.send('Product successfully added');
                res.redirect('/');
            })
    })

    ////////////////DATA DELETE/////////////////// 
    ////////////////CRUD DELETE/////////////////// 
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                console.log(result);
                res.send(result.deletedCount > 0);
            })
    })
    ////////////////DATA UPDATE/////////////////// 
    ////////////////CRUD PATCH/////////////////// 
    app.patch('/update/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.updateOne(
            { _id: ObjectId(req.params.id)},
            {$set: {price: req.body.price, quantity: req.body.quantity}})
            .then((result) => {
                console.log(result);
                res.send(result.modifiedCount > 0);
            })
    })

    console.log('DB connected');

    // client.close();
});

app.listen(3000);