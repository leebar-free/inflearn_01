const { User } = require('../models/User.js');

let auth = (req, res, next) => {
    // 인증 처리를 하는곳

    // 1. 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 2. 토큰을 복호화 한후, 유저를 찾는다.
    // 3. 유저가 있으면 인증 Yes
    // 4. 유저가 없으면 인증 No
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        req.token = token;
        req.user = user;
        next();
    });
}

module.exports = { auth };
