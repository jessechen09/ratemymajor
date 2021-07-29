/*
Author: Jesse Chen, Kat McGee
Course: CSC 377
Assignment: Final project
File: Starts server.
*/

// Server ===============================================================

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
// for local testing only
// DigOcean version uses port=80 and appropriate hostname
const port = 3000; 
const hostname = '192.241.132.24';

// const serveIndex = require('serve-index');
// const bodyParser = require('body-parser');

// mongoDB ==============================================================
const db = mongoose.connection;
const mongoDBurl = 'mongodb://localhost/auto';

var Schema = mongoose.Schema;

// Majors

var MajorSchema = new Schema({
	major: String,
	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

var Major = mongoose.model('Major', MajorSchema)

var cs = new Major({
	major: "Computer Science",
	reviews: []
})
cs.save((err)=>{if(err)console.log('error saving cs')});

var bw = new Major({
	major: "Basket Weaving",
	reviews: []
})
bw.save((err)=>{if(err)console.log('error saving bw')});

// University

var UniversitySchema = new Schema({
	university: String,
	reviews: [{type: Schema.Types.ObjectId, ref: 'University'}]
})

var University = mongoose.model('Major', UniversitySchema)

var uArizona = new University({
	university: 'University of Arizona',
	reviews: [] 
})
uArizona.save((err)=>{if(err)console.log('error saving uArizona')});

var arizonaState = new University({
	university: 'Arizona State University',
	reviews: [] 
})
arizonaState.save((err)=>{if(err)console.log('error saving arizonaState')});

var uIllinois = new University({
	university: 'University of Illinois',
	reviews: [] 
})
uIllinois.save((err)=>{if(err)console.log('error saving uIllinois')});

// Comments

var CommentSchema = new Schema({
	commentBody: String,
	thumbsUp: number,
	thumbsDown: number,
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}] // comments can have comments 
})

var Comment = mongoose.model('Comment', CommentSchema);

var cmt1 = new Comment({
	commentBody: "I agree! This major is great!",
	thumbsUp: 10,
	thumbsDown: 3,
})
cmt1.save((err)=>{if(err)console.log('error saving cmt1')});

var cmt2 = new Comment({
	commentBody: "What?! I thought this major sucked!",
	thumbsUp: 3,
	thumbsDown: 27,
})
cmt2.save((err)=>{if(err)console.log('error saving cmt2')});

// Reviews

var ReviewSchema = new Schema({
	reviewBody: String,
	images: [String],
	thumbsUp: number,
	thumbsDown: number,
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
})

var Review = mongoose.model('Review', ReviewSchema);

var r1 = new Comment({
	reviewBody: "I love programming so CS is the best major for me. I don't like that math parts as much, though they are manageable.",
	images: [],
	thumbsUp: 199,
	thumbsDown: 3,
	comments: [cmt1]
})
r1.save((err)=>{if(err)console.log('error saving r1')});

var r2 = new Comment({
	reviewBody: "I don't think there are many jobs related to basekt weaving.",
	images: [],
	thumbsUp: 33,
	thumbsDown: 7,
	comments: [cmt1]
})
r2.save((err)=>{if(err)console.log('error saving r2')});

// Users

var UserSchema = new Schema({
	username: String,
	password: String,
	listings: [{type: Schema.Types.ObjectId, ref: 'Item'}],
	purchases: [{type: Schema.Types.ObjectId, ref: 'Item'}]
})

var User = mongoose.model('User', UserSchema);

var jesse = new User({
	username: 'jc',
	password: 'asdf',
	listings: [],
	purchases: []
}); 
jesse.save((err)=>{if (err) console.log('error: jesse')});

var jon = new User({
	username: 'jonsmyth',
	password: 'badpassword',
	listings: [],
	purchases: []
}); 
jon.save((err)=>{if (err) console.log('error: jon')});

// Final project ============================================================

app.post('/add/review/:major/:university/:review',(req,res)=>{

})

app.post('/add/comment/:comment',(req,res)=>{
	
})

// PA10 =====================================================================
var sessionKeys = {};
var sessionMins = 20;
setInterval(()=>{
	for (e in sessionKeys){
		if (sessionKeys[e][1] <(Date.now()-sessionMins*60000)){
			delete sessionKeys[e];
		}
	}
},1000);

app.use('/home.html',(req,res,next)=>{
	let user = req.cookies.login.username;
	let key = req.cookies.login.key;
	if(sessionKeys[user][0] == key){
		console.log("cookie worked for /post.html");
		next();
	}
});

app.use('/post.html',(req,res,next)=>{
	let user = req.cookies.login.username;
	let key = req.cookies.login.key;
	if(sessionKeys[user][0] == key){
		console.log("cookied worked for /post.html");
		next();
	}
});


app.use(express.static('public_html'));
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoDBurl, {useNewUrlParser: true});
db.dropDatabase();
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// login
app.get('/login/:username/:password',(req,res)=>{
	let user = req.params.username;
	let pw = req.params.password;
	User.find({username: user, password: pw}).exec((error,results)=>{
		if (results.length == 1){
			console.log("logged in!");
			let sessionKey = Math.floor(Math.random()*1000);
			sessionKeys[user] = [sessionKey, Date.now()];
			res.cookie("login", {username: user, key: sessionKey}, {maxAge: sessionMins*60000});
			res.send('pass');
		} else {
			console.log("log in failed!");
			res.send('Incorrect username or password. Please try again.');
		}
	})
})

// search listings
app.get('/search/listings/:keyword', (req,res)=>{
	let keyword = req.params.keyword;
	Item.find({description: {$regex:keyword}}).exec((error,results)=>{
		let html = "<h1 id='rightHeader'>Search results</h1> <div id='items'>"

		if(results.length==0){
			html += "<p>No listings found for given keyword!</p></div>";
			res.send(html);

		} else {

			console.log("Items with the substring "+"'"+keyword+"' in their name:")
			console.log(results)
		// add html stuff to show listings
		
			// add html stuff to show listings
			for(i=0;i<results.length;i++){
				let item = results[i];
				let open = "<div class='item'>";
				let title = "<div><b>" + item.title + "</b></div><br>";
				let img = "<div>" + item.image + "</div><br>";
				let desc = "<div>" + item.description + "</div><br>";
				let price = "<div>$" + item.price + "</div><br>";
				let stat = "<div>" + item.stat + "</div>";
				let close = "</div><br><br>";
				html += open+title+img+desc+price+stat+close;
			}
			html += "</div>";
			res.send(html);
		}
	});
})

// view listings
app.get('/view/listings/', (req,res)=>{
	Item.find().exec((error,results)=>{
		console.log(results);
		let html = "<h1 id='rightHeader'>Listings</h1> <div id='items'>"
		if(results.length==0){
			html += "<p>No listings!</p></div>";
			res.send(html);
		} else {
			for(i=0;i<results.length;i++){
				let item = results[i];
				let open = "<div class='item'>";
				let title = "<div><b>" + item.title + "</b></div><br>";
				let img = "<div>" + item.image + "</div><br>";
				let desc = "<div>" + item.description + "</div><br>";
				let price = "<div>$" + item.price + "</div><br>";
				let buy;
				if(item.stat=='SALE'){
					buy = "<input type='button' onclick=buyItem('"+item.title+"'); value='Buy now!'><br>"
				} else {
					buy = "<div> Item has been sold </div>";
				}
				let close = "</div><br><br>";
				html += open+title+img+desc+price+buy+close;
			}
			html += "</div>";
			res.send(html);
		}
	});
})

// buy item
app.get('/buy/item/:item', (req,res)=>{
	let item = req.params.item;
	let user = req.cookies.login.username;
	console.log(item);
	User.find({username: user}).exec((error,results)=>{
		user = results[0];
		console.log("results: " + user.purchases);

		Item.find({title: item}).exec((error,results)=>{
			let item = results[0];
			item.stat = "SOLD";
			item.save((err)=>{if (err) console.log('error saving item')});
			console.log("results: " + item);
			user.purchases.push(item);
			console.log(user.purchases)
			user.save((err)=>{if (err) console.log('error saving user')});
		});
	});
})

// view purchases
app.get('/view/purchases/', (req,res)=>{
	let user = req.cookies.login.username;
	User.find({username: user}).exec((error,results)=>{
		Item.find({_id: results[0].purchases}).exec((error,results)=>{
			let html = "<h1 id='rightHeader'>Purchases</h1> <div id='items'>"
			console.log(results);
			if(results.length==0){
				html += "<p>No purchases!</p></div>";
				res.send(html);
			} else {

				for(i=0;i<results.length;i++){
					let item = results[i];
					let open = "<div class='item'>"
					let title = "<div><b>" + item.title + "</b></div><br>";
					let img = "<div>" + item.image + "</div><br>";
					let desc = "<div>" + item.description + "</div><br>";
					let price = "<div>" + item.price + "</div><br>";
					let stat = "<div>" + item.stat + "</div>";
					let close ="</div><br><br>";
					html += open+title+img+desc+price+stat+close;
				}
				html += "</div>";
				res.send(html);
			}
		});
	});
})

// add item, create listing
app.post('/add/item/:title/:desc/:img/:price/:stat', (req,res)=>{
	let user = req.cookies.login.username;
	User.find({username: user}).exec((error,results)=>{
		let newItem = new Item({
			title: req.params.title, 
			description: req.params.desc,
			image: req.params.img,
			price: req.params.price,
			stat: req.params.stat
		})
		newItem.save((err)=>{if (err) console.log('error adding new item')});
		results[0].listings.push(newItem);
		results[0].save((err)=>{if (err) console.log('error adding new listing')});
		console.log("Item added to user's listings")
		console.log(results[0].listings)
	})
	res.send("");
})

// create account
app.post('/add/user/:username/:password', (req,res)=>{
	let user = req.params.username;
	let pw = req.params.password;

	User.find({username: user}).exec((error,results)=>{
		if (results.length == 1){
			console.log("user exists: "+results[0].username);
			res.send('error');
		} else {
			var newUser = new User({
				username: user,
				password: pw,
				lists: [],
				purchases: []
			})
			newUser.save((err)=>{if (err) console.log('error adding new user')});
			console.log("User added")
			console.log("Username: "+user)
			console.log("Password: "+pw)
			res.send("");
		}
	})
})

// PA9 ==================================================================
// app.get('/get/users', (req,res)=>{
// 	User.find().exec((error,results)=>{
// 		console.log("Users:");
// 		console.log(results);
// 		res.send('<pre>' + JSON.stringify(results, null, 2) +  '</pre>');
// 	});
// })

// app.get('/get/items', (req,res)=>{
// 	Item.find().exec((error,results)=>{
// 		console.log("Items:")
// 		console.log(results);
// 		res.send('<pre>' + JSON.stringify(results, null, 2) +  '</pre>');
// 	});
// })

// app.get('/get/listings/:username', (req,res)=>{
// 	let user = req.params.username;
// 	User.find({username: user}).exec((error,results)=>{

// 		Item.find({_id: results[0].listings}).exec((error,results)=>{
// 			res.send('<pre>' + JSON.stringify(results, null, 2) +  '</pre>');
// 			console.log("Listings for "+user+":")
// 			console.log(results);
// 		});
// 	});
// })

// app.get('/get/purchases/:username', (req,res)=>{
// 	let user = req.params.username;
// 	User.find({username: user}).exec((error,results)=>{

// 		Item.find({_id: results[0].purchases}).exec((error,results)=>{
// 			res.send('<pre>' + JSON.stringify(results, null, 2) +  '</pre>');
// 			console.log("Purchases for "+user+":")
// 			console.log(results);
// 		});
// 	});
// })

// app.get('/search/users/:keyword', (req,res)=>{
// 	let keyword = req.params.keyword;
// 	User.find({username: {$regex:keyword}}).exec((error,results)=>{
// 		console.log("Users with the substring "+"'"+keyword+"' in their username:")
// 		console.log(results)
// 		res.send('<pre>' + JSON.stringify(results, null, 2) +  '</pre>');
// 	});
// })

// app.get('/search/items/:keyword', (req,res)=>{
// 	let keyword = req.params.keyword;
// 	Item.find({description: {$regex:keyword}}).exec((error,results)=>{
// 		console.log("Items with the substring "+"'"+keyword+"' in their name:")
// 		console.log(results)
// 		res.send('<pre>' + JSON.stringify(results, null, 2) +  '</pre>');
// 	});
// })



// app.post('/add/item/:username/:title/:desc/:img/:price/:stat', (req,res)=>{

// 	User.find({username: req.params.username}).exec((error,results)=>{
// 		let newItem = new Item({
// 			title: req.params.title, 
// 			description: req.params.desc,
// 			image: req.params.img,
// 			price: req.params.price,
// 			stat: req.params.stat
// 		})
// 		newItem.save((err)=>{if (err) console.log('error adding new item')});
// 		results[0].listings.push(newItem);
// 		results[0].save((err)=>{if (err) console.log('error adding new listing')});
// 		console.log("Item added to user's listings")
// 		console.log(results[0].listings)
// 	})
// 	res.send("");
// })

app.listen(port, ()=>console.log(`App listening at http://localhost:${port}`));


