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