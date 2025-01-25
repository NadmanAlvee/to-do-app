const jwt = require('jsonwebtoken');

const app = {};

app.authGuard = function(req, res, next){
    try {
        const Token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(Token , process.env.JWT_SECRET);
        const { username, userId } = decoded;
        req.username = username;
        req.userId = userId;
        next();
    } catch (err) {
        next("Authentication failure!");
    }
};

module.exports = app;
