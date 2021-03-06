const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {ObjectId} = require('mongodb');

const url = process.env.DB_URL
const db_name = process.env.DB_NAME
const col_name = process.env.COL_NAME
const options = {
    useUnifiedTopology: true
}

const readTerms = () => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url,options, (err,client) => {
            assert.equal(err, null);

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.find({}).toArray((err,docs) => {
                assert.equal(err, null);
                resolve(docs);
                client.close();
            });
        });
    });
    return iou
}

const createTerms = (termObj) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url,options, (err,client) => {
            assert.equal(err,null)

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.insertOne(termObj, (err, doc) => {
                assert.equal(err, null)
                resolve(doc.ops[0]);
                client.close();
            })
        })
    })
    return iou
}

//Added this function to return the product I am updating in the findOneAndUpdate fuction below
const readTermById= (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options, (err, client) => {
            assert.equal(err, null);

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.find({_id: new ObjectId(id)}).toArray((err, docs) => {
                assert.equal(err, null);
                resolve(docs[0]);
                client.close();
            });
        });
    });
    return iou
};
// Ask Wes about the new option if he was able to get it to return the modified document
const upsertTerms = (id, termObj) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options, (err, client) => {
            assert.equal(err, null);

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.findOneAndUpdate({_id: new ObjectId(id)},
            {$set: {...termObj}},
            (err, result) => {
                assert.equal(err, null);
                readTermById(result.value._id)
                .then(product => resolve(product))
                .then(() => client.close())
            });
        });
    });
    return iou
};
//PATCH
const updateTerms = (id, termObj) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options, (err, client) => {
            assert.equal(err, null);

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.findOneAndUpdate({_id: new ObjectId(id)},
            {$set: {...termObj}},
            (err, result) => {
                assert.equal(err, null);
                readTermById(result.value._id)
                .then(product => resolve(product))
                .then(() => client.close())
            });
        });
    });
    return iou
};
// Delete a Product, using the 'delete' Mongo Function
const deleteTerms= (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options,(err, client) =>{
            assert.equal(err, null);

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.findOneAndDelete({_id: new ObjectId(id)}, (err, result) => {
                assert.equal(err, null)
                resolve(result.value);
                client.close();
            });
        });
    });  
    return iou     
};



module.exports = {
    readTerms,
    createTerms,
    upsertTerms,
    updateTerms,
    deleteTerms
}