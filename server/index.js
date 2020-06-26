const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const { User } = require('./models/User.js');

const { auth } = require('./middleware/auth.js');

const config = require('./config/key.js');

const cookieParser = require('cookie-parser');

// application/x-www-form-urlencoded 방식의 Content-Type 데이터를 받아준다.
app.use(bodyParser.urlencoded({extended: true}));

// application/json 방식의 Content-Type 데이터를 받아준다.
app.use(bodyParser.json());

app.use(cookieParser());

// set NODE_ENV=production
//console.log("process.env.NODE_ENV :: " + process.env.NODE_ENV);

// connection string :: mongodb+srv://inflearn01:<password>@inflearn01-2petu.mongodb.net/<dbname>?retryWrites=true&w=majority
const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://inflearn01:inflearn01@inflearn01-2petu.mongodb.net/test?retryWrites=true&w=majority', {
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! ==>> 안녕하세요...'));

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요...=======')
});

// 회원 가입용 라우터...
app.post('/api/users/register', (req, res) => {
    console.log("===============================");
    console.log("/api/users/register...called");
    console.log(req.body);
    console.log("===============================");
    
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

// 회원 로그인용 라우터...
app.post('/api/users/login', (req, res) => {
    console.log("===============================");
    console.log("/api/users/login...called");
    console.log(req.body);
    console.log("===============================");

    // 1. 요청된 이메일을 데이터베이스에서 있는지 찾기.
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log("findOne user :: " + user);
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 먼저 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            console.log("comparePassword isMatch :: " + isMatch);
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            }

            // 3. 비밀번호까지 맞다면 토큰을 생성
            user.generateToken((err, user) => {
                console.log("generateToken user :: " + user);
                //
                if (err) return res.status(400).send(err)

                // 토큰을 저장한다. 어디에?? 쿠키, 로컬스토리지...
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ 
                        loginSuccess: true
                        ,userId: user._id
                        ,token: user.token
                    });
            });
        });
    });
});

// 회원 인증용 라우터...
app.get('/api/users/auth', auth, (req, res) => {
    console.log("===============================");
    console.log("/api/users/auth...called");
    console.log(req.body);
    console.log("===============================");

    // 여기까지 미들웨어를 통과했다는 얘기는, Authentification 이 True 라는 말
    // role 0 -> 일반 사용자, role 0이 아니면 관리자
    res.status(200).json({
        _id: req._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

// 회원 로그아웃용 라우터...
app.get('/api/users/logout', auth, (req, res) => {
    console.log("===============================");
    console.log("/api/users/logout...called");
    console.log(req.body);
    console.log("===============================");

    User.findByIdAndUpdate({ _id: req.user._id },
        { token: ""}
        , (err, user) => {
            if (err) return res.json({ success: false, err});
            return res.status(200).send({
                success: true
            });
        });

});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
