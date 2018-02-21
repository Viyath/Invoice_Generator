
var express=require("express");
var http=require('http');
var bodyParser=require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var connection = require('./config');
var mysql = require('mysql');
var session = require('express-session');
var ssnUser;
app.set('view engine','ejs');


//var authenticateController=require('./controllers/authenticate-controller');
//var registerController=require('./controllers/register-controller');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret:"relaxit'sjustdemocode",resave:false,saveUninitialized:true}));

/* route to handle login and registration */

//app.post('/api/register',registerController.register);
//app.post('/api/authenticate',authenticateController.authenticate);

app.get('/', function(req, res){
    res.render('index');
});

app.get('/logIn', function(req, res){
  res.render('logIn');
});

app.post('/logIn', function(req, res){
    
    //checking the database for authentication.
    var U_email=req.body.user_name;
    var password=req.body.password;
    
    connection.query('SELECT * FROM user WHERE U_email = ?',[U_email],function (error, results, fields) {
        //console.log(U_email);
        console.log(results);
        if (!error){
            if(results.length > 0){
                console.log(results.length);                
                console.log(results);
                if(results[0].U_email==U_email){
                    if(results[0].password==password){
                        console.log('Successfully Loged in!');                        
                        ssnUser = req.session;
                        ssnUser.userID = results[0].U_ID;
                        ssnUser.userU_name = results[0].U_name;
                        console.log(ssnUser.userID);
                        res.render('work_details');
                    } else{
                        console.log('Invalid Password');
                        res.send('Invalid Password');
                    }
                }
                else{
                    console.log('No Match found');
                }
                
            }else{
                console.log('Invalid User!');
                res.send('Invalid User!');
            }
        }
    });
});

app.get('/user_registration', urlencodedParser, function(req, res){
    res.render('user_registration');
});

app.get('/logOut',urlencodedParser,function(req,res){
    req.session.destroy(function(err) {
        if(err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
});
app.post('/user_registration', urlencodedParser, function(req, res){
    res.render('user_registration');
    var valUR = {U_name: req.body.user_name, U_email: req.body.email, password: req.body.password};
    console.log(valUR);

    var query = connection.query('INSERT INTO user SET ?', valUR, function (error, results){    
        connection.query(mysql,function (err, result) {
            if (error){
                console.log("Error in the query");
            }
            else{
                console.log("Successfull query!");
                res.render('logIn')
            }    
        });
    });
});

app.get('/site_details', urlencodedParser, function(req, res){
    res.render('site_details');
});

app.post('/site_details', urlencodedParser, function(req, res){    
    var valEmployerURL = {E_U_name:req.body.eU_name, U_email: req.body.U_email};
    var valSiteURL = {S_U_name:req.body.sU_name, address:req.body.sAddress, FK_E_U_name:req.body.eU_name};
    
    console.log(valEmployerURL);
    console.log(valSiteURL);

//inserting data in to the employer
    var query = connection.query('INSERT INTO employer SET ?', valEmployerURL, function (error, results){    
        connection.query(mysql,function (err, result) {
            if (error){
                console.log("Error while inserting data in to the employer!");
            }
            else{
                console.log("Data inserted in to the employer successfully!");
            }    
        });
    });

//inserting data in to the site
    var query = connection.query('INSERT INTO site SET ?', valSiteURL, function (error, results){    
        connection.query(mysql,function (err, result) {
            if (error){
                console.log("Error while inserting data in to the site!");
            }
            else{
                console.log("Data inserted in to the site successfully!");
            }    
        });
    });
    res.render('site_details');
});

app.get('/shift_details', function(req, res){
    if(!req.session.id){
        return res.status(404).send();  
    }else{
        //req.session.user = user;
        return res.status(200).send();
        res.render('shift_details');
    }    
});

app.get('/income_details', function(req, res){
    res.render('income_details');
});

app.get('/work_details', function(req, res){
    res.render('work_detailds');
});
app.post('/work_details', function(req, res){
    console.log(ssnUser.userID);
    var valEmployerURL = {E_name: req.body.eName, E_email: req.body.eMail, 
        I_occurence: req.body.i_occurence,I_day: req.body.i_day, I_time: req.body.i_time, 
        FK_U_ID: ssnUser.userID};
    console.log(valEmployerURL);

    var query = connection.query('INSERT INTO employer SET ?', valEmployerURL, function (error, results){    
        connection.query(mysql,function (err, result) {
            if (error){
                console.log("Error in the employer query");
            }
            else{
                console.log("Successfull employer query!");
                res.render('logIn')
            }    
        });
    });
    res.render('work_details');
});

app.listen(8080);