const express = require('express');
require('dotenv').config();
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const app = express();
const port=process.env.PORT ||5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0epdq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
 



async function run(){
 try{
     await client.connect();

    const database = client.db("bikersDreamHome");
    const productCollection = database.collection("products");
    const reviewCollection = database.collection("customerReviews");
    const ordersCollection = database.collection("Orders");
    const usersCollection = database.collection("NewUsers");



// Bikers Dream Home Server Site All Post Method Section



// New Product adding Only Admin Post Method
    app.post('/newProduct',async(req,res)=>{
    const result=await productCollection.insertOne(req.body);
    res.json(result);
})

//Customer Review Adding Only Customer Post Method

app.post('/review',async(req,res)=>{
const result=await reviewCollection.insertOne(req.body);
res.json(result);
});
 

//Customer Purchase Product Order  Post Method

app.post('/singleOrder',async(req,res)=>{
    const result=await ordersCollection.insertOne(req.body);
    res.send(result)
   
})


//new Users post method in this Database
app.post('/newUser',async(req,res)=>{
    console.log(req.body)
    const result=await usersCollection.insertOne(req.body);
    res.json(result);
   
});

//if new user than added user collection database or old user than update Database
app.put('/newUser',async(req,res)=>{
    const user=req.body;
    const filter={email:user.email}
    const options = { upsert: true };
    const updateDoc={$set:{user}}
    const result=await usersCollection.updateOne(filter,updateDoc,options)
    res.json(result);
    
});



//Bikers Dream Home Server Site All Get Method Section


//All Products get Only client site GET Method

app.get('/allProduct',async(req, res)=>{
    const result=await productCollection.find({}).toArray();
    res.json(result);
});


//All Review get Only client site GET Method

app.get('/allReview',async(req,res)=>{
    const result=await reviewCollection.find({}).toArray();
    res.json(result);
});

//All Order Single Product Get with id
app.get('/singleProduct/:id',async(req,res)=>{
    const id=req.params.id;
    const cursor={_id:ObjectId(id)};
    const result=await productCollection.findOne(cursor)
    res.json(result);
})

  
//Specific email to shows my Order get method
app.get('/myOrder/:email',async(req, res)=>{
    const id=req.params.email;
    const email={email:id};
    const result=await ordersCollection.find(email).toArray();
    res.json(result);
    
})


// Admin DashBoard Shows Customer All Products Manage get Methods
app.get('/manageProducts',async(req,res)=>{
    const result=await ordersCollection.find({}).toArray();
    res.json(result);
    
})

// Admin dashBoard Manage all orders
app.get('/manageOrders',async(req,res)=>{
        const result=await ordersCollection.find({}).toArray()
    res.json(result);
    
})




// Database to find Specific six data show home page

app.get('/limitProduct',async(req,res)=>{
    const result=await productCollection.find({}).limit(6).toArray();
    res.json(result)
    console.log(result)
});


//User and Admin Bassis DashBoard Shows to get methods to

app.get('/allUser/:email',async(req,res)=>{

    const email = req.params.email;
    const query ={email: email};
    const user=await usersCollection.findOne(query)
    let isAdmin =false;
    if(user.role==='admin'){
        isAdmin = true;
    }
    res.json({admin:isAdmin});
    
})



app.put('/updateUser/admin',async(req,res)=>{
    const user=req.body;
    const filter={email:user.email}
    const updateDoc = {$set:{role:"admin"} }
    const result=await usersCollection.updateOne(filter,updateDoc)
    res.json(result)
    console.log(result)
    
})








// All Delete Method Section

//Admin Manage Product to Specific Product Delete Order

app.delete('/adminDelete/:id',async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    const cursor={_id:ObjectId(id)}
    const result=await ordersCollection.deleteOne(cursor)
    res.json(result)
    console.log(result)
})

//Customer ManageProduct to specific Product Delete Method

app.delete('/myOrder/:id',async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    const cursor={_id:ObjectId(id)};
    const result=await ordersCollection.deleteOne(cursor)
    res.json(result)
    console.log(result)

});



































 }

 finally{

    // await client.close();

 }


};

   run().catch(console.dir)



















app.get('/', (req, res) => {
    res.send("Mongodb Server Connected")
})

app.listen(port,(req,res)=>{
    console.log("listening port",port)
})