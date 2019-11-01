var express = require('express');
var app = express();
var mysql = require('mysql');
var multer = require('multer');
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


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/uploadedimages");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).array('imgUploader', 3);

app.post('/api/images', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
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
        host: '35.243.222.88',
        // host: 'localhost',
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

app.delete('/contact', function(req, res) {
    console.log(req.body);
    connection.query(`DELETE * FROM People WHERE Submission_ID=?`, [req.body.id], function(error, results, fields) {
        if (error) throw error;
        res.end('Record has been deleted!');
    });
});

app.get('/api', function(req, res) {
    res.json(flist);
});

app.listen(port)