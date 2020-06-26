const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50

    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

});

userSchema.pre('save', function( next ){
    var user = this;

    console.log("user.password(Req) :: " + user.password);

    // 비밀번호를 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // 비밀번호 데이터가 변경된 경우만 암호화 수행
        if (user.isModified('password')) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                // bcrypt.compare(user.password, hash).then(function(result) {
                //     console.log(user.password + "...result == true");
                // });
                // bcrypt.compare("12345678", hash).then(function(result) {
                //     console.log("[12345678]...result == true");
                // });

                // Store hash in your password DB.
                user.password = hash;
                next();
            });
        } else {
            next();
        }
    });
});

userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword : 12345678, 암호화된 비밀번호 : $2b$10$lHCl0k4Tbn0/qWNufboMMeWnRzMyvgd3JEeyLMnLdDD1mUrEuh8sG
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        console.log("comparePassword :: " + plainPassword + " / " + this.password + " / " + isMatch);

        if (err) return cb(err)
            cb(null, isMatch)

    });

};

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // JsonWebToken 을 이용하여 토큰을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token;
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })

};

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 디코드 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라리언트에서 가져온 token과 DB에 보관한 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if (err) return cb(err);
            cb(null, user);
        });

      });

};


const User = mongoose.model('User', userSchema);

module.exports = { User };
