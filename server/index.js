const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/routes')

const app = express(); 

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use('/', routes)

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(8000, () => {
  console.log('listening on port 8000')
})