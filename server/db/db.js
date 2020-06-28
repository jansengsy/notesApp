const mongoose = require('mongoose');
const config = require('config');

const mongouri = config.get('mongoURI');

// These options a needed to for mongoose to not use deprecated version of connect
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const connectDatabase = async () => {
  try {
    await mongoose.connect(mongouri, options);
    console.log('Database connected sucessfully...');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
