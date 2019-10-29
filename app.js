var express = require('express');
var app = express();
var nodemailer = require('nodemailer')
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
app.get('/family/:name', function(req, res) {
    res.render()
})
app.get('/aboutme', function(req, res) {
    res.render('aboutme');
});

app.get('/Favorites', function(req, res) {
    res.render('Favorites');
});

// app.get('/Family/:name', function(req, res) {
//     res.render('Family', { ID: req.params.name, Qstr: req.query.qstr });
// });

app.post('/person', urlencodedParser, function(req, res) {
    res.send('Thank you');
    console.log(req.body.firstname);
    console.log(req.body.lastname);
});


// res.render('contactme');


app.listen(port)