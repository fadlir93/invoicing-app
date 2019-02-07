const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000 ;
const bcrypt = require('bcrypt')
const saltRounds = 10;


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send("Welcome to app invoicing App");
})

app.post('/register', function(req, res) {
    if(req.body.name == '' || req.body.email == '' || req.body.company_name == '' || req.body.password == ''){
        return res.json({
            'status' : false,
            'message' : 'all files are required'
        })
    }
    bcrypt.hash(req.body.password, saltRounds, function(err,hash) {
        let db = new sqlite3.Database("./database/InvoicingApp.db");
        let sql = `INSERT INTO users(name, email, company_name, password) VALUES('${req.body.name}','${req.body.email}','${req.body.company_name}','${hash}')`;
        db.run(sql, function(err) {
            if(err){
                throw err;
            } else {
                return res.json({
                    status: true,
                    message: "User Created"
                })
            }
        })
        db.close();
    }) 
})

app.post('/login', function(req, res) {
    let db = new sqlite3.Database('./database/InvoicingApp.db');
    let sql = `SELECT * from users where email = '${req.body.email}'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        db.close();
        if(rows.length == 0) {
            return res.json({
                status: false,
                message: 'Wrong Email !'
            });
        }
        let user = rows[0];
        let authenticated = bcrypt.compareSync(req.body.password, user.password);
        delete user.password;
        if (authenticated) {
            return res.json({
                status: true,
                user: user
            });
        }
        return res.json({
            status: false,
            message: "wrong password, please try again"
        })
    })
})

app.listen(PORT, function() {
    console.log(`App Running on PORT : ${PORT}`)
})