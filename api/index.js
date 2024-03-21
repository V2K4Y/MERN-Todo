const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const {mongoDB} = require('./db');
const { checkAuth } = require('./middlewares/checkAuth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

mongoDB(process.env.DB_URL)
.then(() => console.log('Connected to MongoDB !'))
.catch(err => console.log("Error: ", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));

app.use('/user', require('./routes/user'));
app.use('/api/todos', checkAuth, require('./routes/todos'));

app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes
    return res.status(500).json({ msg: "Internal Server Error" });
});



app.listen(PORT, () => console.log(`Listening on Port: ${PORT} `));
