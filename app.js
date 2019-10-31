var express = require('express');
var app = express();
var mysql = require('mysql');
var nodemailer = require('nodemailer')
var obj = {};
const flist = require('./family.json');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

var port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();


app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    res.render('index');

});

app.post('/family', urlencodedParser, function(req, res) {
    var Famname = req.body.droplistname;
    console.log(Famname);
    res.redirect('/familydetails/' + Famname);

});

app.get('/aboutme', function(req, res) {
    res.render('aboutme');
});


app.get('/Favorites', function(req, res) {
    res.render('Favorites');
});

app.get('/family', function(req, res) {
    res.render('family', { flist: flist })
});

app.get('/familydetails/:Famname', function(req, res) {
    var Famname = req.params.Famname;
    var person = flist.filter(item => item.name === Famname);
    console.log(person[0].name);
    res.render('familydetails', { person: person[0] });
});

app.get('/contact', function(req, res) {
    res.render('contact');
});

app.post('/contact', urlencodedParser, function(req, res, next) {
    // console.log(req.body.firstname);
    // console.log(req.body.lastname);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;

    // console.log(req.body, firstname);

    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root1234',
        database: 'test'

    });

    con.connect();

    var sql = `INSERT INTO test.People (FirstName, LastName,Email) VALUES ("${firstname}","${lastname}","${email}") `;
    console.log(sql);
    con.query(sql,
        function(err) {
            if (err) {
                res.status(500)
                res.render('error', 'FAILED')

            } else {
                res.send("recieved your request");
            }
        }


    );
    con.end();


});


app.get('/output', function(req, res) {
    // res.render('output', { obj: obj });

    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root1234',
        database: 'test'

    });
    con.connect();

    var sql = `SELECT * FROM People`;
    console.log(sql);
    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        } else {
            obj = { print: result };
            res.render('output', { myresult: result });
        }
    });

    con.end();
});

app.listen(port)

























// const pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'pass',
//     database: 'nodedb',
//     charset: 'utf8'
// });

// //html string that will be send to browser
// var reo = '<html><head><title>Node.js MySQL Select</title></head><body><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

// //sets and returns html table with results from sql select
// //Receives sql query and callback function to return the table
// function setResHtml(sql, cb) {
//     pool.getConnection((err, con) => {
//         if (err) throw err;

//         con.query(sql, (err, res, cols) => {
//             if (err) throw err;

//             var table = ''; //to store html table

//             //create html table with data from res.
//             for (var i = 0; i < res.length; i++) {
//                 table += '<tr><td>' + (i + 1) + '</td><td>' + res[i].Fistname + '</td><td>' + res[i].LastName + '</td></tr>';
//             }
//             table = '<table border="1"><tr><th>FirstName</th><th>LastName</th><th>' + table + '</table>';

//             con.release(); //Done with mysql connection

//             return cb(table);
//         });
//     });
// }

// // let sql ='SELECT name, address FROM friends WHERE id >1 ORDER BY name';
// let sql = `SELECT INTO test.People (FirstName, LastName) VALUES ("${firstname}","${lastname}") `;
// //create the server for browser access