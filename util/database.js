const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _db;

function mongoConnect (){

    mongoClient.connect('mongodb+srv://jani6878:jani_6878@cluster0.ukgd1ck.mongodb.net/test?retryWrites=true&w=majority')
    .then(dbConnection =>{

        console.log(dbConnection)
        _db = dbConnection.db();

    })
    .catch(err =>console.log(err))
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw ' no database found ';
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

