const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const { User } = require('./models/User.js');

const config = require('./config/key.js');

// application/x-www-form-urlencoded 방식의 Content-Type 데이터를 받아준다.
app.use(bodyParser.urlencoded({extended: true}));

// application/json 방식의 Content-Type 데이터를 받아준다.
app.use(bodyParser.json());

// connection string :: mongodb+srv://inflearn01:<password>@inflearn01-2petu.mongodb.net/<dbname>?retryWrites=true&w=majority
const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://inflearn01:inflearn01@inflearn01-2petu.mongodb.net/test?retryWrites=true&w=majority', {
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! ==>> 안녕하세요...'));

// 회원 가입용 라우터...
app.post('/register', (req, res) => {
    
    // 회원 가입 할때 필요한 정보 등을 client 에서 가져오면,
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    });
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
