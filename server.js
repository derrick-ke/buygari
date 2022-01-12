const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: 'config.env' });

//const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(process.env.DATABASE_LOCAL);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
