var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// 創建 CarrotPrices 表格，如果尚未存在
db.run('CREATE TABLE IF NOT EXISTS CarrotPrices (id INTEGER PRIMARY KEY AUTOINCREMENT, price REAL, date TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// 查詢胡蘿蔔價格的 API
app.get('/query', (req, res) => {
    const { date, showAll } = req.query;
    let query = 'SELECT * FROM CarrotPrices WHERE date = ?';
    let params = [date];

    if (showAll === 'true') {
        query = 'SELECT * FROM CarrotPrices';
        params = [];
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            res.status(500).send('Internal server error');
            return;
        }
        res.send(rows);
    });
});
