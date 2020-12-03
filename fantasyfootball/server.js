const express = require('express');
const bodyParser= require('body-parser');
const session = require('express-session');
const http = require('http');
const dbConfig = require('./config/database.config.js');
const sql = require("mssql");
const app = express();

/*const app = http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
     res.render('index.ejs')
	 
});*/
const path = require('path');
//const bcrypt = require('bcrypt');
const key = "FantasyFootballLeague";
const encryptor = require('simple-encryptor')(key);


//Let express know that we are using embeddedjs as our view engine.
app.set('view engine', 'ejs')
app.set('views','views')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
const Public_DIR = path.join(__dirname, '/public/')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(Public_DIR))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
	
const port = process.env.PORT || 1337;
app.listen(port);
	
/*app.listen(3000, function() {
  console.log('listening on 3000')
})*/




app.get('/', (req, res) => {
  res.render('index.ejs')  
})


/*var request = sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			return new sql.Request();
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
*/
app.post('/Login', (req, res) => {
	
  sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
		console.log(req.body.username);
		console.log(req.body.password);
		  const username = req.body.username;
		  const password = req.body.password;
		  
		  const encryptedPassword = encryptor.encrypt(password);
		  
		if (username && password) {
		request.query("SELECT * FROM Users WHERE Username = '"+username+"'", function(error, results) {
			//console.log(results);
			//console.log(!isEmpty(results.recordset));
			//console.log(results.recordset.length);
			//console.log(!isEmpty(results.recordset[0]));
			if (results.recordset.length > 0) {
			const pwd=results.recordset.Password;
			//console.log(results.recordset.);
			var decrypted = encryptor.decrypt(results.recordset[0].Password);
			console.log(decrypted);
			console.log(decrypted===password);
			if (results.recordset.length > 0 && decrypted===password) {
				req.session.loggedin = true;
				req.session.username = username;
			
				//console.log("inside results");
				//res.redirect('/listplayers');
			
			} else {
				//res.status(400).send(JSON.stringify(error, 'Incorrect Username and/or Password!', 2));
				res.status(501);
				//res.send('Incorrect Username and/or Password!');
				//res.redirect('/Login',{err});
			}
			}else{
				res.status(502);
			}				
			res.end();
		});
		} else {
		res.status(400).send({error: "Please enter Username and Password!  "})
		//res.status(400).send(JSON.stringify(error, 'Please enter Username and Password!', 2));
		//res.end();
	}
    
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
		//res.sendFile(__dirname + '/index.html')
})  
	
  
  


app.get('/Login', (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  res.render('index.ejs')
  
})

app.get('/roster', (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  res.render('startingroaster.ejs');
})

app.get('/register', (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  res.render('register.ejs');
})



app.post('/register', (req, res) => {
  //res.sendFile(__dirname + '/index.ejs')
  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.firstname);
  console.log(req.body.lastname);
  
  const password = req.body.password;
  const encryptedPassword = encryptor.encrypt(password); 
  const  Username = req.body.username;
  const  Email =req.body.email;
  const FirstName= req.body.firstname;
  const LastName = req.body.lastname;
  
   
   sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query("INSERT INTO Users ([Username],[Email],[FirstName],[LastName],[Password]) VALUES ('"+Username+"','"+Email+"','"+FirstName+"','"+LastName+"','"+encryptedPassword+"')") .then(function (err, result) {
			
			//res.sendFile(__dirname + '/index.ejs')
			res.render('index.ejs')
        });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
 
  //res.sendFile(__dirname + '/index.html')
})

app.get('/listplayers', (req, res) => {
  // connect to your database
	sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from NFL_Players', function (err, result) {
            // send records as a response
            //res.send(result);
			//console.log(result.recordset[1].Name);
			//const parsedJSON = JSON.parse(result);
			//console.log(result.recordsets.);
			//res.send(result);
			res.render('playerlist.ejs', { result });
			console.log(result.recordset.length);
            
        });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
 
})


app.post('/InsertTeam', (req, res) => {
  
  const playerlist = req.body;
  console.log(playerlist);
	sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
		 console.log("Connected!");	 
		 
        var request = new sql.Request();
        //var sqlquery =  "INSERT INTO Fantasy_Team (PlayerName,Team) VALUES (@name,@team)";
			
        //Insert query to FantasyTeam Database with selected players. 
		 for(var i = 0; i < playerlist.length; i++) {
			 var split=playerlist[i].split(",");
			 var name=split[0].toString();
			 var team=split[1].toString();
			 //request.multiple = true;
			 console.log(name);
			 console.log(team);
        
		//request.query('INSERT INTO Fantasy_Team ([PlayerName],[Team]) VALUES ('+name+','+team+')').then(function (err, result)
		request.query("INSERT INTO Fantasy_Team ([Participant],[Player],[Team]) VALUES (' ','"+name+"','"+team+"')").then(function (err, result)
		{
            
			console.log('record added to db');	
			
		 }).catch(err => {
			console.log('Could not insert the record to DB. Exiting now...', err);
			process.exit();
		});
		}
		res.sendStatus(201);
		
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
		 
});

app.get('/FantasyTeam', (req, res) => {
  // connect to your database
	sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
			 // create Request object
        var request = new sql.Request();
		request.query("select distinct * from dbo.NFL_Players where Player in (select Player from dbo.Fantasy_Team)", function (err, result) 
		{
            
			console.log('records fetched from DB');	
			
			//res.send('/index.html')
			//res.send('FantasyTeam');
			//res.render(path.resolve(__dirname + "/views/FantasyTeam"),{result});
			res.render('FantasyTeam.ejs', { result });
			//console.log(result.recordset.length);
		 });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
  
});

app.get('/weekstats', (req, res) => {
  
  sql.connect(dbConfig, {
			useNewUrlParser: true
		}).then(() => {
		// create Request object
        var request = new sql.Request();
		request.query("select distinct * from dbo.NFL_Players where name in (select PlayerName from dbo.Fantasy_Team)", function (err, result) 
		{
            
			console.log('records fetched from DB');	
			res.render('FantasyTeam.ejs', { result });
			console.log(result.recordset.length);
		 });
		}).catch(err => {
			console.log('Could not connect to the database. Exiting now...', err);
			process.exit();
		});
  
  
})

