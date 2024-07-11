const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rouTer',
    database: 'healthdatabase'
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
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});

app.post('/auth', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const role = req.body.role;

  let query = '';
  if (role === 'on') {
      query = `SELECT password FROM hospital_users WHERE hospital_username = ${id}`;
  } else {
      query = `SELECT password FROM users WHERE username = ${id}`;
  }

  db.query(query, [id], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
          if (result[0].password === password) {
              req.session.loggedin = true;
              req.session.username = id;
              req.session.role = role;
              if (role === 'on') {
                  res.redirect('/hospital_dashboard');
              } else {
                  res.redirect('/user_dashboard');
              }
          } else {
              res.status(401).send('Invalid password.');
          }
      } else {
          res.status(401).send('Invalid username.');
      }
  });
});

app.get('/user_dashboard', (req, res) => {
  if (req.session.loggedin && req.session.role!== 'on') {
      const query = `
          SELECT a.cardno, a.name, a.address, a.state, a.city, a.pincode, a.dateofbirth, a.phoneno, a.emailid,
                 p.diseaseid, d.diseasename, h.name AS hospitalname, h.address AS hospitaladdress, p.treatedfrom, p.treatedto, p.currentstatus
          FROM aadhar a
          LEFT JOIN patients p ON a.cardno = p.patientid
          LEFT JOIN diseases d ON p.diseaseid = d.diseaseidno
          LEFT JOIN hospital h ON p.hospitalid = h.hospitalid
          WHERE a.cardno =${req.session.id};
      `;
      db.query(query, [req.session.username], (err, results) => {
          if (err) {
              console.error(err);
              res.status(500).send('Error fetching data.');
          } else {
              res.render('views/user_dashboard.ejs', { data: results });
          }
      });
  } else {
      res.redirect('/');
  }
});

app.get('/hospital_dashboard', (req, res) => {
  if (req.session.loggedin && req.session.role === 'on') {
      const query = `
          SELECT h.hospitalid, h.name, h.address, h.state, h.city, h.pincode, h.customercre,
                 p.id, p.patientid, p.diseaseid, d.diseasename, p.treatedfrom, p.treatedto, p.currentstatus
          FROM hospital h
          LEFT JOIN patients p ON h.hospitalid = p.hospitalid
          LEFT JOIN diseases d ON p.diseaseid = d.diseaseidno
          WHERE h.hospitalid =${req.session.id} AND p.currentstatus = 'Under treatment';
      `;
      
      db.query(query, [req.session.username], (err, results) => {
          if (err) {
              console.error(err);
              res.status(500).send('Error fetching data.');
          } else {
              res.render('views/hospital_dashboard.ejs', { data: results });
          }
      });
  } else {
      res.redirect('/');
  }
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});