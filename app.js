
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
var outputBuffer;

//var authenticateController=require('./controllers/authenticate-controller');
//var registerController=require('./controllers/register-controller');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret:"relaxit'sjustdemocode",resave:false,saveUninitialized:true}));
app.use(express.static('public'));

/* route to handle login and registration */

//app.post('/api/register',registerController.register);
//app.post('/api/authenticate',authenticateController.authenticate);

app.get('/', function(req, res){
    res.render('logIn');
});

app.get('/logIn', function(req, res){
  res.render('logIn');
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

app.get('/user_registration', urlencodedParser, function(req, res){
    res.render('user_registration');
});

app.get('/add_site_details', function(req, res){
    res.render('add_site_details');
});

app.get('/site_details', urlencodedParser, function(req, res){
    if (isSessionLive(req)){
        loadSites(req, function (result) {
            loadEmployerName(req,function(empResult){
                console.log("------Employer details------");
                console.log(empResult);
                console.log("----------------------------");
                res.render('site_details', {results1 : result, empResults: empResult});
                //res.send({empResults: result});
            });
            
        });
    }else{
        res.render('login');
    }
});

app.get('/sites', function(req, res){
    
//    res.send('site_details',{results1 : result, empResults: result});
    loadSites(req, function (result) {
        loadEmployerName(req,function(empResult){
            console.log("------Employer details------");
            console.log(empResult);
            console.log("----------------------------");
            res.send({results1 : result, empResults: empResult});
            //res.send({empResults: result});
        });
    }); 
});

app.get('/updateSite', function(req, res){
    
})
app.get('/shift_details', function(req, res){
    if (isSessionLive(req)){
        res.render('shift_details');
    }else{
        res.render('login');
    }
});

app.get('/income_details', function(req, res){
    if (isSessionLive(req)){
        connection.query('SELECT * FROM site WHERE FK_U_ID = ?',[req.session.userID],function (error, results, fields) {
            if(!error){
                var outputBuffer = results;
                console.log(outputBuffer);
                res.render('income_details', {results : outputBuffer});                
            }
        });
    }else{
        res.render('login');
    }
});

app.get('/work_details', function(req, res){
    if (isSessionLive(req)){
        res.render('work_details');
    }else{
        res.render('login');
    }
});

app.get('/sample-multi-items', function(req, res) {
    res.render('sample_multi_items');
});

//All the post requests
app.post('/addNewSiteRecord', urlencodedParser, function(req,res){
    //getSiteRecords(req, outputCallback);
    //let newSiteID = createNewSiteID(req);
    var valSiteURL = {S_name:req.body.siteName, S_address:req.body.siteAddress, FK_E_Name:req.body.employerName, FK_U_ID:req.session.userID};
    console.log(valSiteURL);
    var query = connection.query('INSERT INTO employersite SET ?', valSiteURL, function (error, results){    
        connection.query(mysql,function (error, result) {
            if (error){
                console.log("Error in the query adding new record to site details");
            }
            else{
                console.log("Successfull query!");
            }    
        });
    });
});
app.post('/updateSiteRecord',urlencodedParser, function(req,res){
    let siteName = req.body.siteName;
    let siteAddress = req.body.site_address;
    let empName = req.body.employerName;
    let userID = req.session.userID;
    console.log("updated record : "+siteName+" "+siteAddress+" "+empName+" "+userID);
    var query = connection.query("DELETE FROM employersite WHERE S_name= '"+siteName+"' AND FK_E_Name= '"+empName+"' AND FK_U_ID= '"+userID+"'" , function (error, results){    
        connection.query(mysql,function (error, result) {
            if (error){
                console.log("Error in the query adding new record to site details");
            }
            else{
                console.log("deleted site record");
            }    
        });
    });
});
app.post('/deleteSiteRecord', urlencodedParser, function(req,res){
    //var valSiteURL = {S_name:req.body.siteName, S_address:req.body.siteAddress, FK_E_Name:req.body.employerName, FK_U_ID:req.session.userID};
    let siteName = req.body.siteName;
    let empName = req.body.employerName;
    let userID = req.session.userID;
    console.log("Deleted record : "+siteName+" "+empName+" "+userID);
    var query = connection.query("DELETE FROM employersite WHERE S_name= '"+siteName+"' AND FK_E_Name= '"+empName+"' AND FK_U_ID= '"+userID+"'" , function (error, results){    
        connection.query(mysql,function (error, result) {
            if (error){
                console.log("Unable to delete site record");
            }
            else{
                console.log("Successfully deleted site record");
            }    
        });
    });
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
                        req.session.userID = results[0].U_ID;
                        console.log(ssnUser.userID);
                        //res.render('work_details');
                        loadSites(req, function (result) {
                            loadEmployerName(req,function(empResult){
                                console.log("------Employer details------");
                                console.log(empResult);
                                console.log("----------------------------");
                                res.render('site_details', {results1 : result, empResults: empResult});
                                //res.send({empResults: result});
                            });
                        });
                        //loadEmployerName(req, function(result){
                          //  res.send({empResults : result});
                            //console.log(empResults);
                        //});
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

app.post('/site_details', urlencodedParser, function(req, res){    

    //var valSiteURL = {S_name: req.body.site_name, S_address: req.body.site_address, FK_E_Name: req.body.employer_name, FK_U_ID: req.session.userID};
    var valSiteURL = {S_name: req.body.siteName, siteAddress: req.body.site_address, employerName: req.body.employer_name, FK_U_ID: req.session.userID};
    console.log(valSiteURL);
    //var grabSiteDetails = req.body.
/*
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
    */
    res.render('site_details');
    
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
    var valSiteURL = {S_name:req.body.sName, S_address:req.body.sAddress, FK_E_name:req.body.eName, FK_U_ID:req.session.userID};
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

app.post('/add', function(req, res){
    //outputEmpDetails(getEmployer);
    res.render('work_details', {empName:req.body.eName}); 
});
app.post('/add_site_details', function(req, res){
    res.render('add_site_details');
});
app.post('/sample-multi-items', function(req, res) {
    console.log('>>> Server received', req.body);
    res.render('sample_multi_items');
});
app.post('/display_sites_record', function(req, res){
    if (isSessionLive(req)){
        loadSites(req, function (result) {
            loadEmployerName(req,function(empResult){
                console.log("------Employer details------");
                console.log(empResult);
                console.log("----------------------------");
                res.render('site_details', {results1 : result, empResults: empResult});
                //res.send({empResults: result});
            });
            
        });
    }else{
        res.render('login');
    }
});
//All the functions

function isSessionLive(req){
    req = req;
    if(req.session.userID){
        console.log("Session live..");
        return true;
    }else{
        console.log("Session is dead..");
        return false;
    }
}

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

function loadSites(req, outputCallback) {
    connection.query('SELECT * FROM employersite WHERE FK_U_ID = ?',[req.session.userID],function (error, results, fields) {
        if(!error){
            outputCallback(results);
        }
    });
};
function getSiteRecords(req, outputCallback) {
    connection.query('SELECT * FROM employersite WHERE FK_U_ID = ?',[req.session.userID],function (error, results, fields) {
        if(!error){
            console.log(results)
            outputCallback(results);
        }
    });
};

function loadEmployerName(req, outputCallback) {
    connection.query('SELECT * FROM employer WHERE FK_U_ID = ?',[req.session.userID],function (error, results, fields) {
        if(!error){
            outputCallback(results);
        }
    });
};
function createNewSiteID(req){
    let lastSiteID;
    let siteRecords = getSiteRecords(req); 
    console.log(siteRecords);
    siteRecords.forEach(function( eachResult){
        lastSiteID == eachResult.Site_Id;
    });
    return lastSiteID + 1;
};

app.listen(8080);
console.log("Click to visit http://localhost:8080");