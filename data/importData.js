const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Post = require('../models/postModel');

dotenv.config({ path: './../config.env' });

mongoose.connect(process.env.DATABASE_LOCAL);

const importData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync(`${__dirname}\\data.json`));
    await Post.create(data);
    console.log('Data has been imported successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Post.deleteMany();
    console.log('Database has been cleaned.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}
