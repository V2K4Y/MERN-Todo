const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
        next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); 
    //even after not calling next() here the mongoose  middleware automatically calls next() for smoothe operation 
    //and the process will automatically be saved.
})

userSchema.methods.matchPassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;