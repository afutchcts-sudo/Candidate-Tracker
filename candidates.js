const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

module.exports = async (req, res) => {
  const client = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('candidates');
  const collection = db.collection('candidates');

  if (req.method === 'GET') {
    const candidates = await collection.find().toArray();
    res.status(200).json(candidates);
  } else if (req.method === 'POST') {
    const { name, client: clientName, status, notes } = req.body;
    const candidate = {
      name,
      client: clientName,
      status,
      history: [{ status, date: new Date() }],
      notes
    };
    const result = await collection.insertOne(candidate);
    res.status(201).json(result.ops ? result.ops[0] : candidate);
  }

  client.close();
};
