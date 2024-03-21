const jwt = require('jsonwebtoken');

const generateToken = (uid) => {
    return jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn: '1h'});
    
}

const verifyToken = (uid) => {
    if(!uid) return false;
    try {
        const data = jwt.verify(uid, process.env.JWT_SECRET);
        return data.uid;
    } catch (error) {
        return null;
    }
}

module.exports = {generateToken, verifyToken};