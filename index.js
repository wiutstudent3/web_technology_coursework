const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const sqllite3Conn = require('sqlite3').verbose();

app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('assets'));
app.set('view engine', 'pug');

/// connecting to sqlite3 database
const dbPath = './data.db';

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) throw err;

  console.log('Connection successful!');
});

const select = 'select * from students';
// Creating a students table
// db.run(
//   "create table students(id integer primary key, first_name varchar(100), last_name varchar(100), student_id varchar(100), phone_number varchar(100), email varchar(100))"
// );

app.get('/', (req, res) => {
  res.render('home');
});

// show home page
app.get('/home', (req, res) => {
  res.redirect('/');
});

// show students page
app.get('/students', (req, res) => {
  db.all(select, [], (err, data) => {
    if (err) throw err;
    res.render('students', { studentData: data });
  });
});

// go to create page
app.get('/create', (req, res) => {
  res.render('create');
});

// Create new student record
app.post('/create', (req, res) => {
  const dataForm = req.body;
  if (
    dataForm.first_name.length === 0 ||
    dataForm.last_name.length === 0 ||
    dataForm.student_id.length === 0 ||
    dataForm.phone_number.length === 0 ||
    dataForm.email.length === 0
  ) {
    res.render('create', { error: true });
  } else {
    let insert =
      'insert into students(first_name, last_name, student_id, phone_number, email) values (?, ?, ?, ?, ?)';

    db.run(
      insert,
      [
        dataForm.first_name,
        dataForm.last_name,
        dataForm.student_id,
        dataForm.phone_number,
        dataForm.email,
      ],
      (err) => {
        if (err) throw err;
        console.log('new record inserted successfully!');
      }
    );
  }

  db.all(select, [], (err, data) => {
    if (err) throw err;
    // res.redirect('/students');
    res.render('students', { studentData: data });
  });
});

app.listen(3000);
