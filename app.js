var express = require('express');
var app = express();
var mysql = require('mysql');
var multer = require('multer');
// const formidable = require('formidable')
var obj = {};
const flist = require('./family.json');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
var port = process.env.PORT || 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })


app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    res.render('index');

});

app.post('/upload', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)

})



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
    var fam_list = [flist];
    var person = fam_list.filter(item => item.family[Famname] === Famname);
    res.render('familydetails', { Famname: Famname, fam_list: fam_list });
});

app.get('/contact', function(req, res) {
    res.render('contact');
});

app.post('/contact', urlencodedParser, function(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;


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



app.get('/api', function(req, res) {
    res.json(flist);
});

app.listen(port)