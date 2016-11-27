const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');

/* BCrypt stuff here */
const bcrypt = require('bcryptjs');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(session({
    secret: 'theTruthIsOutThere51',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

var db = pgp('postgres://jayanzaman@localhost:5432/auth_fda');

app.get("/", function(req, res) {
    var logged_in;
    var email;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
    }

    var data = {
        "logged_in": logged_in,
        "email": email
    }

    res.render('index', data);
});

app.get("/signup", function(req, res) {
    res.render('signup/index')
});

app.post('/signup', function(req, res) {
    var data = req.body;

    bcrypt.hash(data.password, 10, function(err, hash) {
        db.none(
            "INSERT INTO users (email, password_digest) VALUES ($1, $2)", [data.email, hash]
        ).then(function() {
            res.send('User created!');
        })
    });
})

app.post('/login', function(req, res) {
    var data = req.body;

    db.one(
        "SELECT * FROM users WHERE email = $1", [data.email]
    ).catch(function() {
        res.send('Email/Password not found.')
    }).then(function(user) {
        bcrypt.compare(data.password, user.password_digest, function(err, cmp) {
            if (cmp) {
                req.session.user = user;
                res.redirect('/');
            } else {
                res.send('Email/Password not found.')
            }
        });
    });
});







app.listen(3000, function() {
    console.log('FDA Auth App: listening on port 3000!');
});
