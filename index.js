const express = require('express');
const app = express();
const port = 5000;

// connection string :: mongodb+srv://inflearn01:<password>@inflearn01-2petu.mongodb.net/<dbname>?retryWrites=true&w=majority
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://inflearn01:inflearn01@inflearn01-2petu.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! ==>> 안녕하세요...'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
