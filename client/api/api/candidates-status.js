const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

module.exports = async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { id } = req.query;
  const { status } = req.body;

  const client = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('candidates');
  const collection = db.collection('candidates');

  const candidate = await collection.findOne({ _id: new ObjectId(id) });
  if (!candidate) {
    res.status(404).end('Candidate not found');
    client.close();
    return;
  }

  const updatedHistory = candidate.history || [];
  updatedHistory.push({ status, date: new Date() });

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, history: updatedHistory } }
  );

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  res.status(200).json(updated);

  client.close();
};
