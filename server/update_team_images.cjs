const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.collection('teams');
    
    await db.updateOne({ employeeName: 'KAPEESH S' }, { $set: { profilePhoto: 'kapeesh.JPG' } });
    await db.updateOne({ employeeName: 'GOWSHIK S' }, { $set: { profilePhoto: 'gowsi.jpeg' } });
    await db.updateOne({ employeeName: 'MOHAN RAJ P' }, { $set: { profilePhoto: 'mohan.jpeg' } });
    await db.updateOne({ employeeName: 'SAHAYA STEPHEN S' }, { $set: { profilePhoto: 'stephen.jpeg' } });
    await db.updateOne({ employeeName: 'VINODH T' }, { $set: { profilePhoto: 'vno.jpeg' } });
    
    console.log('Database team images updated successfully.');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateImages();
