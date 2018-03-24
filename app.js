
var express=require("express");
var http=require('http');
var bodyParser=require('body-parser');
var $ = require('jquery');
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
    //res.render('index');
    res.render('logIn');
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
        //console.log(results);
        if (!error){
            if(results.length > 0){
                //console.log(results.length);                
                //console.log(results);
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
          //res.redirect('/');
          res.render('logIn');
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
    
//inserting data into the employer table
    console.log(ssnUser.userID);
    var valEmployerURL = {E_name: req.body.eName, E_email: req.body.eMail, 
        I_occurence: req.body.i_occurence,I_day: req.body.i_day, I_time: req.body.i_time, 
        FK_U_ID: ssnUser.userID};
    console.log('**** Employer details ****', valEmployerURL);

    var query = connection.query('INSERT INTO employer SET ?', valEmployerURL, function (error, results){    
        connection.query(mysql,function (err, result) {
            if (error){
                console.log("Error in the employer query");
            }
            else{
                console.log("Successfull employer query!");
            }    
        });
    });

//insert data in to the site table
    var valSiteURL = {S_name:req.body.sName, S_address:req.body.sAddress, FK_E_name:req.body.eName};
    console.log('**** Site details ****');
    console.log(valSiteURL);
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
    
//insert data in to the shift details table
    console.log('**** Shift details ****');
    //var valShiftURL ={H_rate:'', start_time:'' ,end_time:'',hrs_work:'',day:'',FK_U_ID:'',FK_S_name:''};
    
    if ((req.body.monTimeWorked!="") && (req.body.monHourlyRate!="")){
        var valShiftURL = {day: 'Monday', start_time: req.body.monStrtTime ,end_time: req.body.monEndtTime , hrs_work: req.body.monTimeWorked, H_rate:req.body.monHourlyRate, FK_U_ID: ssnUser.userID,FK_S_name: req.body.sName };
        addShiftDetails(valShiftURL);
        console.log("Record added to the shift table");    
    }if ((req.body.tueTimeWorked!="") && (req.body.tueHourlyRate!="")){
        var valShiftURL = {day: 'Tuesday', start_time: req.body.tueStrtTime ,end_time: req.body.tueEndtTime , hrs_work: req.body.tueTimeWorked, H_rate:req.body.tueHourlyRate, FK_U_ID: ssnUser.userID,FK_S_name: req.body.sName};
        addShiftDetails(valShiftURL);
        console.log("Record added to the shift table");
    }if ((req.body.wedTimeWorked!="") && (req.body.wedHourlyRate!="")){
        var valShiftURL = {day: 'Wednesday', start_time: req.body.wedStrtTime ,end_time: req.body.wedEndtTime , hrs_work: req.body.wedTimeWorked, H_rate:req.body.wedHourlyRate, FK_U_ID: ssnUser.userID,FK_S_name: req.body.sName};
        addShiftDetails(valShiftURL);
        console.log("Record added to the shift table");
    }if ((req.body.thuTimeWorked!="") && (req.body.thuHourlyRate!="")){
        var valShiftURL = {day: 'Thursday', start_time: req.body.thuStrtTime ,end_time: req.body.thuEndtTime , hrs_work: req.body.thuTimeWorked, H_rate:req.body.thuHourlyRate, FK_U_ID: ssnUser.userID,FK_S_name: req.body.sName};
        addShiftDetails(valShiftURL);
        console.log("Record added to the shift table");
    }if ((req.body.friTimeWorked!="") && (req.body.friHourlyRate!="")){
        var valShiftURL = {day: 'Friday', start_time: req.body.friStrtTime ,end_time: req.body.friEndtTime , hrs_work: req.body.friTimeWorked, H_rate:req.body.friHourlyRate, FK_U_ID: ssnUser.userID,FK_S_name: req.body.sName};
        addShiftDetails(valShiftURL);
        console.log("Record added to the shift table");
    }if ((req.body.satTimeWorked!="") && (req.body.satHourlyRate!="")){
        var valShiftURL = {day: 'Saturday', start_time: req.body.satStrtTime ,end_time: req.body.satEndtTime , hrs_work: req.body.satTimeWorked, H_rate:req.body.satHourlyRate, FK_U_ID: ssnUser.userID,FK_S_name: req.body.sName};
        addShiftDetails(valShiftURL);
        console.log("Record added to the shift table");
    }if ((req.body.sunTimeWorked!="") && (req.body.sunHourlyRate!="")){
        var valShiftURL = {day: 'Sunday', start_time: req.body.sunStrtTime ,end_time: req.body.sunEndtTime , hrs_work: req.body.sunTimeWorked, H_rate:req.body.sunHourlyRate, FK_U_ID: ssnUser.userID,FK_S_name: req.body.sName};
        addShiftDetails(valShiftURL);
        console.log("Record added to the shift table");
    }
    res.render('work_details');
});
function addShiftDetails(shiftDetailsArray){
    valShiftURL = shiftDetailsArray
    console.log("======function addShiftDetails======")
    console.log(valShiftURL);
   
    var query = connection.query('INSERT INTO shift SET ?', valShiftURL, function (error, results){    
        connection.query(mysql,function (err, result) {
            if (error){
                console.log("Error while inserting data in to the shift table!");
            }
            else{
                console.log("Record added to the shift table");
            }    
        });
    })
    console.log("======function addShiftDetails======")

};

function getEmployer(){
    var valEmployerURL = {E_name: req.body.eName, E_email: req.body.eMail, 
        I_occurence: req.body.i_occurence,I_day: req.body.i_day, I_time: req.body.i_time, 
        FK_U_ID: ssnUser.userID};
    return valEmployerURL;
}

function outputEmpDetails(val){
    req.body.eName='brad';
}
app.get('/add', function(req, res){
    console.log('add button clicked');
    res.render('work_details');
    req.body.eName = valEmployerURL.E_name;

});
app.post('/add', function(req, res){
    //outputEmpDetails(getEmployer);
    res.render('work_details', {empName:req.body.eName}); 
});

app.get('/sample-multi-items', function(req, res) {
    res.render('sample_multi_items');
});

app.post('/sample-multi-items', function(req, res) {
    console.log('>>> Server received', req.body);
    res.render('sample_multi_items');
});

app.listen(8080);