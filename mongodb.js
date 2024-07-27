//create database
//use school
//show dbs
//create collection or tables or documents
db.createCollection('student')
//create rows insert data
db.student.insertOne({
    name: 'zidan', age: 30, fulltime: false, grad: null, regdate: new Date(), course: ['cse', 'eee'], adrs: { street: 12, city: 'Dhaka' }
})

db.student.insertMany([{
    name: 'zidan', age: 30, fulltime: false, grad: null, regdate: new Date(), course: ['cse', 'eee'], adrs: { street: 12, city: 'Dhaka' }
},
{
    name: 'pulok', age: 20, fulltime: false, grad: null, regdate: new Date(), course: ['cse', 'eee'], adrs: { street: 12, city: 'Dhaka' }
},
])

//find records
db.student.find()
//find with conditions
db.student.find().sort({ name: -1 }).limit(1)
db.student.find().limit(1)
//db.student.find(query/where,projection/select)
db.student.find({ name: 'zidan' })
db.student.find({ age: 35, fulltime: false })
db.student.find({}, { name: true })//only show names of the records
//update records(filter/select,update)
db.student.updateOne({ name: 'zidan' }, { $set: { age: 24 } })
db.student.updateOne({ name: 'zidan' }, { $set: { age: 24, fulltime: true } })
db.student.updateOne({ _id: ObjectId('66a341340402a357a9c4e49b') }, { $set: { age: 25 } })
db.student.updateOne({ name: 'barry' }, { $unset: { grad: "" } })//remove a column
db.student.updateMany({}, { $set: { fulltime: true } })//every records will have this column now existing will change
db.student.updateMany({}, { $inc: { age: 1 } })
db.student.updateMany({ fulltime: { $exists: true } }, { $set: { fulltime: false } })
//Delete
db.student.deleteOne({ name: 'pulok' }) //delete one record
db.student.deleteMany({ fulltime: false })
db.student.deleteMany({ regdate: { $exists: false } })
//query $ne not equal
db.student.find({ name: { $ne: 'zidan' } }) //$eq
db.student.find({ age: { $gt: 20 } })
db.student.find({ age: { $gt: 20, $lt: 35 } })
db.student.find({ name: { $in: ['zidan', 'pulok'] } }) //$nin
//logical operator and or
db.student.find({ $and: [{ fulltime: false }, { age: { $lt: 35 } }] })
db.student.find({ age: { $not: { $gt: 20 } } })
db.student.findOne()
//Aggregation operations allow you to group, sort, perform calculations, analyze data, and much more. must 3rd bracket
db.student.aggregate([
    {
        $match: { age: { $gte: 25 } }
    },
    {
        $group: { _id: "$fulltime", totalages: { $sum: "$age" } } //fulltime must have more than 2 in common same
    }
    ,
    {
        $addFields: { ocp: 'work' }
    }
])

db.student.aggregate(
    [{ $group: { _id: "$name" } }, { $limit: 2 }, { $count: 'age' }]
)
//limited feature group only column i want
db.student.aggregate([
    {
        $project: {
            "name": 1,
            "age": 1,
            "adrs": 1
        }
    },
    {
        $limit: 2
    }
])
db.createCollection('courses')
db.courses.insertMany([
    { courseName: 'cse', description: 'Computer Science and Engineering' },
    { courseName: 'eee', description: 'Electrical and Electronic Engineering' }
  ]);
//join two table by key
  db.student.aggregate([
    {
      $lookup: {
        from: 'courses',              // The collection to join
        localField: 'course',         // Field from the student collection
        foreignField: 'courseName',   // Field from the courses collection
        as: 'courseDetails'           // Name of the new array field to add
      }}]);
//out to save grouped data in a new collection or tables
db.student.aggregate([
    {
      $group: {
        _id: "$age",
        properties: {
          $push: {
            name: "$name",
          },
        },
      },
    },
    { $out: "properties_by_type" },
  ])
//B tree indexes optimization linear search
// Create a text index on the 'description' field
db.student.createIndex({ description: "text" });

// Search for products with a specific keyword
db.student.find({ $text: { $search: "laptop" } });

//Connect with node js wow
const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('school');
        const collection = db.collection('student');

        // Find the first document in the collection
        const first = await collection.findOne();
        console.log(first);
    } finally {
        // Close the database connection when finished or an error occurs
        await client.close();
    }
}
run().catch(console.error);
