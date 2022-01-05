const app = require('./app');
require('dot.env').config();

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log('System running')
})