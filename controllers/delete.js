const mongoose = require('mongoose');
const JoinFreelancer = require("../models/joinFreelancerModel");


// const deleteAllRecords = async () => {
//   try {
//     await JoinFreelancer.deleteMany({});
//     console.log("All records deleted successfully");
//   } catch (error) {
//     console.error("Error deleting records:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

const mongoURI = "mongodb://127.0.0.1:27017/ershadapp";
// Update with your actual database URI



mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
const batchDeleteRecords = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    bufferCommands: false,
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  try {
    await JoinFreelancer.deleteMany({});
    console.log("All records deleted successfully");
  } catch (error) {
    console.error("Error deleting records:", error);
  } finally {
    mongoose.connection.close();
  }

};
const deleteBatchRecords = async (batchSize = 250) => {
  try {
    const result = await JoinFreelancer.deleteMany({}).limit(batchSize);
    console.log(`Deleted ${result.deletedCount} records`);

    if (result.deletedCount < batchSize) {
      console.log('No more records to delete or fewer than 250 records left.');
    }
  } catch (error) {
    console.error("Error deleting records:", error);
  } finally {
    mongoose.connection.close();
  }
};

//  deleteBatchRecords();
batchDeleteRecords();

// Execute the function
//deleteAllRecords();
