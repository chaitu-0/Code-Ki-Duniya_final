const mongoose = require('mongoose');
const Post = require('/post'); // Adjust the path as necessary

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/your_database_name';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const testPost = new Post({
  user: new mongoose.Types.ObjectId(), // Replace with a valid User ID from your database
  text: 'This is a test post',
});

testPost.save()
  .then(doc => {
    console.log('Test post created successfully:', doc);
  })
  .catch(err => {
    console.error('Error creating test post:', err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
