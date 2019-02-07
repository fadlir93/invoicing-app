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

app.listen(PORT, function() {
    console.log(`App Running on PORT : ${PORT}`)
})