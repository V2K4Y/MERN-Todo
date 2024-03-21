const userModel = require("../model/user");
const { verifyToken } = require("../services/token");

const checkAuth = async (req, res, next) => {
    const id = verifyToken(req.cookies?.usid);
    try {
        if(id) {
            const user = await userModel.findById(id);
            if(user) {
                if(req.query?.getName) return res.status(200).json({userName: user.username});
                req.id = id;
                return next();
            }
            return res.status(404).json({msg: 'No records found !'});

        } else {
            return res.status(403).json({msg: 'Not autharized !'});
        }
    } catch (error) {
        return res.status(500).json({msg: 'Server error!'});
    }
}

module.exports = {checkAuth}