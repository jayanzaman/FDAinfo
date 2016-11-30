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
    secret: 'aNewSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

var db = pgp('postgres://jayanzaman@localhost:5432/auth_fda');

// app.get("/", function(req, res) {
//     res.render('login')
// })
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

    res.render('login', data);
});
app.get("/index", function(req, res) {
    res.render('index')
})

app.get("/signup", function(req, res) {
    res.render('signup')
})
app.post('/signup', function(req, res) {
    var data = req.body;

    bcrypt.hash(data.password, 10, function(err, hash) {
        db.none(
            "INSERT INTO users (email, password_digest) VALUES ($1, $2)", [data.email, hash]
        ).then(function() {
            res.redirect('login');
        })
    });
})

app.get("/login", function(req, res) {
    res.render('login')
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
app.get("/druginfo", function(req, res) {
    res.render('druginfo')
})

app.get("/visuals", function(req, res) {
    res.render('visuals')
})
app.get("/professionals", function(req, res) {
    res.render('professionals')
})

app.get("/settings", function(req, res) {
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
    res.render('settings')
})

app.get("/dashboard", function(req, res) {
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


})



var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('FDA Auth App: listening on port 3000!');
});
