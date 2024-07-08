const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rouTer',
    database: 'HealthDatabase'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});
















app.listen(3000, () => {
    console.log('Server is running on port 3000');
});