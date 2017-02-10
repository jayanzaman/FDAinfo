const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOverride = require('method-override');


/* BCrypt stuff here */
const bcrypt = require('bcryptjs');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(methodOverride('_method')) //method override
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

var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

var db = pgp(process.env.DATABASE_URL || 'postgres://jayanzaman@localhost:5432/fda_open');

app.get("/", function(req, res) {
    var logged_in;
    var email;
    var id;
    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    res.render('login', data);
});
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
                res.redirect('/dashboard/' + user.id);
            } else {
                res.send('Email/Password not found.')
            }
        });
    });
});
app.get("/signup", function(req, res) {
    res.render('signup')
})
app.post('/signup', function(req, res) {
    var data = req.body;

    bcrypt.hash(data.password, 10, function(err, hash) {
        db.none(
            "INSERT INTO users (email, password_digest) VALUES ($1, $2)", [data.email, hash]
        ).then(function() {
            res.render('login');
        })
    });
})
app.get("/dashboard", function(req, res) {
    res.render('dashboard')
})
app.get("/dashboard/:id", function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.any("SELECT * FROM druginfo WHERE druginfo.users_email = $1 ", [data.email])
        .then(function(drugs) {
            data = {
                "logged_in": logged_in,
                "email": email,
                "id": id,
                "drugs": drugs
            }
            console.log(drugs)
            res.render('dashboard', data)
        })
})

app.post('/dashboard/:id', function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }

    var newRx = req.body;

    db.none("INSERT INTO druginfo(drug_name, rx_date, pickup_date, exp_date, prescribing_dr, dr_phone, users_email, users_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [newRx.drug_name, newRx.rx_date, newRx.pickup_date, newRx.exp_date, newRx.prescribing_dr, newRx.dr_phone, email, id])
        .then(function(data) {
            res.redirect('/dashboard/' + id)
        })
})
app.get('/drugupdate/:id', function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.any("SELECT * FROM druginfo WHERE druginfo.id = $1", [req.params.id])
        .then(function(drug) {
            data = {
                "logged_in": logged_in,
                "email": email,
                "id": req.params.id,
                "drug": drug
            }
            res.render('drugupdate', data)
        })


})
app.put('/drugupdate/:id', function(req, res) {
    var logged_in;
    var email;
    var id;
    var druginfo = req.body;
    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.none("UPDATE druginfo SET drug_name=$1, rx_date=$2, pickup_date=$3, exp_date=$4, prescribing_dr=$5, dr_phone=$6 WHERE id=$7", [druginfo.drug_name, druginfo.rx_date, druginfo.pickup_date, druginfo.exp_date, druginfo.prescribing_dr, druginfo.dr_phone, req.params.id])
        .then(function() {
            res.redirect('/dashboard/' + id)
        })
})

app.delete('/drugdelete/:id', function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.none("DELETE FROM druginfo WHERE id=$1", [req.params.id])
        .then(function() {
            res.redirect('/dashboard/' + id)
        })
})

app.get("/druginfo", function(req, res) {
    res.render('druginfo')
})
app.get("/druginfo/:id", function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.any("SELECT * FROM druginfo WHERE druginfo.id = $1 ", [req.params.id])
        .then(function(drugs) {
            data = {
                "logged_in": logged_in,
                "email": email,
                "id": id,
                "drugs": drugs
            }
            console.log(drugs)
            res.render('druginfo', data)
        })
})
app.get("/visuals", function(req, res) {
    res.render('visuals')
})
app.get("/visuals/:id", function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.any("SELECT * FROM druginfo WHERE druginfo.users_email = $1 ", [data.email])
        .then(function(drugs) {
            data = {
                "logged_in": logged_in,
                "email": email,
                "id": id,
                "drugs": drugs
            }
            console.log(drugs)
            res.render('visuals', data)
        })
})
app.get("/professionals", function(req, res) {
    res.render('professionals')
})
app.get("/professionals/:id", function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.any("SELECT * FROM druginfo WHERE druginfo.users_email = $1 ", [data.email])
        .then(function(drugs) {
            data = {
                "logged_in": logged_in,
                "email": email,
                "id": id,
                "drugs": drugs
            }

            res.render('professionals', data)
        })
})
app.get("/settings/:id", function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.any("SELECT * FROM users WHERE users.email = $1 ", [data.email])
        .then(function(user) {
            data = {
                "logged_in": logged_in,
                "email": email,
                "id": id,
                "user": user
            }
            res.render('settings', data)
        })
})

app.get("/profile/:id", function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = true;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }
    db.any("SELECT * FROM users WHERE users.email = $1 ", [data.email])
        .then(function(user) {
            data = {
                "logged_in": logged_in,
                "email": email,
                "id": id,
                "user": user
            }
            res.render('profile', data)
        })
})

app.get("/logout/:id", function(req, res) {
    var logged_in;
    var email;
    var id;

    if (req.session.user) {
        logged_in = false;
        email = req.session.user.email;
        id = req.session.user.id;
    }
    var data = {
        "logged_in": logged_in,
        "email": email,
        "id": id
    }

    res.render('login', data);
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Open FDA App: listening on port' + port);
});
