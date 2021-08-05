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
const crypto = require('crypto')
const app = express();
const iterations = 1000;
app.use(cookieParser());
// for local testing only
// DigOcean version uses port=80 and appropriate hostname
const port = 3000; 
// const hostname = '192.241.132.24';

// const serveIndex = require('serve-index');
// const bodyParser = require('body-parser');

// mongoDB ==============================================================
const db = mongoose.connection;
const mongoDBurl = 'mongodb://localhost/ratemymajor';

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

var ce = new Major({
	major: "Computer Engineering",
	reviews: []
})
ce.save((err)=>{if(err)console.log('error saving ce')});

var bw = new Major({
	major: "Basket Weaving",
	reviews: []
})
bw.save((err)=>{if(err)console.log('error saving bw')});

// University
var UniversitySchema = new Schema({
	university: String,
	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

var University = mongoose.model('University', UniversitySchema)

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
	author: String,
	comment: String,
	thumbsUp: Number,
	thumbsDown: Number,
})

var Comment = mongoose.model('Comment', CommentSchema);

let user1 = 'asdf';
let user2 = 'jonsmyth';

var cmt1 = new Comment({
	author: user1,
	comment: "I agree! This major is great!",
	thumbsUp: 10,
	thumbsDown: 3,
})
cmt1.save((err)=>{if(err)console.log('error saving cmt1')});

var cmt2 = new Comment({
	author: user2,
	comment: "What?! I thought this major sucked!",
	thumbsUp: 3,
	thumbsDown: 27,
})
cmt2.save((err)=>{if(err)console.log('error saving cmt2')});

// Reviews
var ReviewSchema = new Schema({
	author: String,
	review: String,
	images: [String],
	thumbsUp: Number,
	thumbsDown: Number,
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	major: String,
	university: String
})

var Review = mongoose.model('Review', ReviewSchema);

// declare all characters
const characters ='abcdefghijklmnopqrstuvwxyz ';

function generateString(length) {
	let result = ' ';
	const charactersLength = characters.length;
	for ( let i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		if(Math.random()<.1){
			result += " "
		}
	}

	return result;
}

var r1 = new Review({
	author: user1,
	review: generateString(200),
	images: [],
	thumbsUp: 199,
	thumbsDown: 3,
	comments: [cmt1],
	major: "Computer Science",
	university: "University of Arizona"
})
r1.save((err)=>{if(err)console.log('error saving r1')});
cs.reviews.push(r1);

var r2 = new Review({
	author: user2,
	review: generateString(253),
	images: [],
	thumbsUp: 33,
	thumbsDown: 7,
	comments: [cmt1, cmt2],
	major: "Basket Weaving",
	university: "University of Arizona"
})
r2.save((err)=>{if(err)console.log('error saving r2')});
bw.reviews.push(r2);

var r3 = new Review({
	author: user1,
	review: generateString(224),
	images: [],
	thumbsUp: 43,
	thumbsDown: 8,
	comments: [],
	major: "Computer Science",
	university: "Arizona State University"
})
r3.save((err)=>{if(err)console.log('error saving r3')});
cs.reviews.push(r3);

var r4 = new Review({
	author: user2,
	review: generateString(253),
	images: [],
	thumbsUp: 41,
	thumbsDown: 7,
	comments: [],
	major: "Computer Engineering",
	university: "Arizona State University"
})
r4.save((err)=>{if(err)console.log('error saving r4')});
ce.reviews.push(r4);

var r5 = new Review({
	author: user2,
	review: generateString(242),
	images: [],
	thumbsUp: 13,
	thumbsDown: 7,
	comments: [],
	major: "Computer Engineering",
	university: "University of Illinois"
})
r5.save((err)=>{if(err)console.log('error saving r4')});
ce.reviews.push(r5);

// Users
var UserSchema = new Schema({
	username: String,
	password: String,
	salt: String,
	hash: String,
	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
})

var User = mongoose.model('User', UserSchema);

var salt = crypto.randomBytes(65).toString('base64');

let pw1 = user1;
crypto.pbkdf2(pw1, salt, iterations, 64, 'sha512', (err,hash)=>{
	if(err) throw err;
	var jesse = new User({
		username: user1,
		password: pw1,
		salt: salt,
		hash: hash.toString('base64'),
		reviews: [r1, r3],
		comments: [cmt1, cmt2]
	})
	jesse.save((err)=>{if (err) console.log('error adding new user')});
	console.log("User added")
	console.log("Username: "+user1)
	console.log("Password: "+pw1)
})

// ================================================================================
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

// adding ================================================================================

// add review - should be POST - GET for testing only
app.post('/add/review/:major/:university/:review/:image',(req,res)=>{
	let user = 'asdf';//req.cookies.login.username;
	let maj = req.params.major;
	let uni = req.params.university;

	// removed check if major/uni exists, because should always exist
	// they will be in dropdown menu
	// if user's major/uni DNE, they can add, which will be done before here

	var review = new Review({
		author: user,
		review: req.params.review,
		images: req.params.image,
		thumbsUp: 0,
		thumbsDown: 0,
		comments: [],
		major: maj,
		university: uni
	})

	review.save((err)=>{if(err)console.log('error saving review')})
	console.log(review);

	// add review to User collection
	User.find({username: user}).exec((error,results)=>{
		console.log("User: " + user)
		results[0].reviews.push(review);
		results[0].save((err)=>{if(err)console.log('error saving user after adding new review')})
	})

	// add review to Major collection
	Major.find({major: maj}).exec((error,results)=>{
		console.log("Major: " + maj);
		results[0].reviews.push(review);
		results[0].save((err)=>{if(err)console.log('error saving major after adding new review')})
	})

	// add review to University collection
	University.find({university: uni}).exec((error,results)=>{
		console.log("University: " + uni);
		results[0].reviews.push(review);
		results[0].save((err)=>{if(err)console.log('error university review after adding new review')})
	})

	console.log("Review added");
	res.send("");
})


// add comment - should be POST - GET for testing only
app.post('/add/comment/:reviewID/:comment',(req,res)=>{
	console.log("Adding comment")
	let user = req.cookies.login.username;
	let revID = req.params.reviewID;

	// removed check if major/uni exists, because should always exist
	// they will be in dropdown menu
	// if user's major/uni DNE, they can add, which will be done before here

	var comment = new Comment({
		author: user,
		comment: req.params.comment,
		thumbsUp: 0,
		thumbsDown: 0,
	})

	comment.save((err)=>{if(err)console.log('error saving comment')})
	console.log(comment);

	// add comment to User collection
	User.find({username: user}).exec((error,results)=>{
		console.log("User: " + user)
		results[0].comments.push(comment);
		results[0].save((err)=>{if(err)console.log('error saving user after adding new comment')})
	})

	// add comment to Review collection
	Review.find({_id: revID}).exec((error,results)=>{
		results[0].comments.push(comment);
		results[0].save((err)=>{if(err)console.log('error saving review after adding new comment')})
		console.log("Review: " + results[0]);
	})

	console.log("Comment added");
	res.send("");
})

// deleting =================================================================================

app.get('/delete/review/:review',(req,res)=>{
	Review.deleteOne({review: req.params.review}).exec((error,results)=>{});
	console.log("Review deleted");
	res.send("");
})

app.get('/delete/comment/:comment',(req,res)=>{
	Comment.deleteOne({comment: req.params.comment}).exec((error,results)=>{});
	console.log("Comment deleted");
	res.send("");
})

// thumbing =====================================================================================

app.get('/thumbsup/review/:id',(req,res)=>{
	Review.find({_id: req.params.id}).exec((error,results)=>{
		results[0].thumbsUp += 1;
		results[0].save((err)=>{if(err)console.log("error thumbing up review")});
		console.log("Review thumbs upped: " + results[0].thumbsUp);
		res.send(results[0].thumbsUp.toString());
	})
})

app.get('/thumbsdown/review/:id',(req,res)=>{
	Review.find({_id: req.params.id}).exec((error,results)=>{
		results[0].thumbsDown +=1 ;
		results[0].save((err)=>{if(err)console.log("error thumbing down review")});
		console.log("Review thumbs downed: " + results[0].thumbsDown);
		res.send(results[0].thumbsDown.toString());
	})
})

app.get('/thumbsup/comment/:id',(req,res)=>{
	Comment.find({_id: req.params.id}).exec((error,results)=>{
		results[0].thumbsUp += 1;
		results[0].save((err)=>{if(err)console.log("error thumbing up comment")});
		console.log("Review thumbs upped: " + results[0].thumbsUp);
		res.send(results[0].thumbsUp.toString());
	})
})

app.get('/thumbsdown/comment/:id',(req,res)=>{
	Comment.find({_id: req.params.id}).exec((error,results)=>{
		results[0].thumbsDown +=1;
		results[0].save((err)=>{if(err)console.log("error thumbing down comment")});
		console.log("Comment thumbs downed: " + results[0].thumbsDown);	
		res.send(results[0].thumbsDown.toString());
	})
})

// accounts ========================================================================

// login
app.get('/login/:username/:password',(req,res)=>{
	let user = req.params.username;
	let pw = req.params.password;
	console.log("User: " + user)
	console.log("Pw: " + pw)
	User.find({username: user}).exec((error,results)=>{
		if (results.length == 1){
			var salt = results[0].salt;
			console.log(salt);
			crypto.pbkdf2(pw, salt, iterations, 64, 'sha512', (err,hash)=>{
				if (err) throw err;
				let hStr = hash.toString('base64');
				if(results[0].hash == hStr) {
					console.log("logged in!");
					let sessionKey = Math.floor(Math.random()*1000);
					sessionKeys[user] = [sessionKey, Date.now()];
					res.cookie("login", {username: user, key: sessionKey}, {maxAge: sessionMins*60000});
					res.send('pass');
				} else {
					console.log("hash check failed, so login failed!")
					res.send("hash check failed");
				}
			})
			
		} else {
			console.log("user not found, so log in failed!");
			res.send('Incorrect username or password. Please try again.');
		}
	})
})

// logout
app.get('/logout/:user', (req,res) => {
	let user = req.params.user;
	User.find({username:user}).exec((error, results) => {
		delete sessionKeys[user][0];
		res.send("pass");
	})
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
			var salt = crypto.randomBytes(65).toString('base64');

			crypto.pbkdf2(pw, salt, iterations, 64, 'sha512', (err,hash)=>{
				if(err) throw err;
				let hashString = hash.toString('base64');
				var newUser = new User({
					username: user,
					password: pw,
					salt: salt,
					hash: hashString,
					reviews: [],
					comments: []
				})
				newUser.save((err)=>{if (err) console.log('error adding new user')});
				console.log("User added")
				console.log("Username: "+user)
				console.log("Password: "+pw)
				res.send("");
			})
		}
	})
})

// show username
app.post('/show/account/username', (req,res)=>{
	let user = req.cookies.login.username;
	res.send("<h1>"+user+"</h1>");
})

// show reviews
app.post('/show/account/reviews', (req,res)=>{
	let user = req.cookies.login.username;
	User.find({username: user}).exec((error,results)=>{
		let reviews = results[0].reviews;

		Review.find({_id: reviews}).exec((error,results)=>{
			let html = "<h2>Reviews</h2>";
			if(results.length>0){
				for(i=0;i<results.length;i++){
					let rev = results[i];
					html += "<div class='reviewFrame'>"
					html += "<div><b>Major:</b> "+rev.major+", ";
					html += "<b>University:</b> "+rev.university+"</div><br>";
					html += "<div class='reviewText'> <b>Review:</b> "+rev.review+"</div><br>";
					html += "<b> Thumbs up:</b> "+rev.thumbsUp;
					html += "<b>, Thumbs down:</b> "+rev.thumbsDown;
					html += "</div>" // close reviewFrame
				}
			} else {
				html += "<div>No reviews to show.</div><br>"
			}	
			res.send(html);
		})
	})
})

// show comments
app.post('/show/account/comments', (req,res)=>{
	let user = req.cookies.login.username;
	User.find({username: user}).exec((error,results)=>{
		let comments = results[0].comments;

		Comment.find({_id: comments}).exec((error,results)=>{
			let html = "<h2>Comments</h2>";
			if(results.length>0){
				for(i=0;i<results.length;i++){
					let rev = results[i];
					html += "<div class='reviewFrame'>"
					html += "<div class='reviewText'> <b>Review:</b> "+rev.comment+"</div><br>";
					html += "<b>Thumbs up:</b> "+rev.thumbsUp;
					html += ", <b>Thumbs down:</b> "+rev.thumbsDown;
					html += "</div>" // close reviewFrame
				} 
			} else {
				html += "<div>No comments to show.</div><br>"
			}
			res.send(html);
		})
	})
})

// search & review section ============================================================

app.post('/show/comments/:id', (req,res)=>{
	console.log("Showing comments")
	Review.find({_id: req.params.id}).exec((error,results)=>{
		let html = "";
		console.log(results[0].comments);
		Comment.find({_id: results[0].comments}).exec((error,results)=>{
			for (i=0;i<results.length;i++){
				let cmt = results[i];
				let id = cmt._id;
				html += "<div class=commentFrame>"
				html += "<div><b>"+cmt.author+":</b> "+cmt.comment+"</div><br>";
				html += "<span id="+id+"up>"+cmt.thumbsUp+" </span>";
				html += "<input id="+id+"UpButton class='reviewButtons' type='button' onclick=thumbsUpComment('"+id+"'); value='Thumbs Up'/>"
				html += "<span id="+id+"down>"+cmt.thumbsDown+" </span>";
				html += "<input id="+id+"DownButton class='reviewButtons' type='button' onclick=thumbsDownComment('"+id+"'); value='Thumbs Down'/>"
				html += "</div>"
			}
			res.send(html);
		})
	})	
})

// html stuff
function makeHtml(rev,id){
	let html = "";
	html += "<div class='reviewFrame'>"
	html += "<div><b>Major:</b> "+rev.major+", ";
	html += "<b>University:</b> "+rev.university+"</div><br>";
	html += "<div class='reviewText'> <b>Review:</b> "+rev.review+"</div><br>";
	html += "<span id="+id+"up>"+rev.thumbsUp+" </span>";
	html += "<input id="+id+"UpButton class='reviewButtons' type='button' onclick=thumbsUpReview('"+id+"'); value='Thumbs Up'/>"
	html += "<span id="+id+"down>"+rev.thumbsDown+" </span>";
	html += "<input id="+id+"DownButton class='reviewButtons' type='button' onclick=thumbsDownReview('"+id+"'); value='Thumbs Down'/>"
	if(rev.comments.length > 0){
		html += "<input class='reviewButtons' id="+id+"CmtButton type='button' onclick=showComments('"+id+"'); value='Show comments'/>"
		html += "<div id="+id+"cmts></div>"
	}
	
	html += "<div id=addCmtRow><input id="+id+"PostButton class='reviewButtons' type='button' onclick=addComment('"+id+"'); value='Add comment'/>"
	html += "<input id="+id+"CmtBox type=text></input></div>"

	html += "</div>" // close reviewFrame
	return html;
}

function processSearch(results, sortOption){
	// sorts A-Z order
	let revArr = [];
	revArr.insert = function ( index, item ) {
		this.splice( index, 0, item );
	};
	if (sortOption == 'aToZ') {
		for (review in results) {
			if (revArr.length == 0) {
				revArr.push(review);
			}
			for (rev in revArr) {
				if (results[review].major < rev.major) {
					let index = revArr.indefOf(rev.major);
					revArr.insert(index, results[review].major);
				}
			}
		}
	} else if (sortOption == 'zToA') {
		for (review in results) {
			if (revArr.length == 0) {
				revArr.push(review);
			}
			for (rev in revArr) {
				if (revArr.hasNext()) {
					if (revArr.next.major < results[review].major) {
						let index = revArr.indefOf(rev.major);
						revArr.insert(index, results[review].major);
					}
				} else {
					revArr.push(review);
				}
			}
		}
	} else if (sortOption == 'mostLikes') {
		for (review in results) {
			if (revArr.length == 0) {
				revArr.push(review);
			}
			for (rev in revArr) {
				if (revArr.hasNext()) {
					if (revArr.thumbsUp < results[review].thumbsUp) {
						let index = revArr.indefOf(rev.major);
						revArr.insert(index, results[review].major);
					}
				} else {
					revArr.push(review);
				}
			}
		}
	} else if (sortOption == 'mostDisikes') {
		for (review in results) {
			if (revArr.length == 0) {
				revArr.push(review);
			}
			for (rev in revArr) {
				if (revArr.hasNext()) {
					if (revArr.thumbsDown < results[review].thumbsDown) {
						let index = revArr.indefOf(rev.major);
						revArr.insert(index, results[review].major);
					}
				} else {
					revArr.push(review);
				}
			}
		}
	}

	console.log(revArr);

	let html = "";

	for(i=0; i<revArr.length; i++){
		let rev = revArr[i];
		let id = rev._id;
		html += makeHtml(rev,id);
	}
	return html;
}

// majors
app.post('/search/major/:keyword/:sort', (req,res)=>{
	let keyword = req.params.keyword;
	let sortOption = req.params.sort;
	Review.find({major: {$regex:new RegExp(keyword, "ig")}}).exec((error,results)=>{
		console.log("Reviews with majors with the substring "+"'"+keyword+"' in their major names:")
		console.log(results)
		res.send(processSearch(results, sortOption));
	});
})

// universities
app.post('/search/university/:keyword/:sort', (req,res)=>{
	let keyword = req.params.keyword;
	let sortOption = req.params.sort;
	Review.find({university: {$regex:new RegExp(keyword, "ig")}}).exec((error,results)=>{
		console.log("Reviews with universities with the substring "+"'"+keyword+"' in their names:")
		console.log(results)
		res.send(processSearch(results, sortOption));
	});
})

app.listen(port, ()=>console.log(`App listening at http://localhost:${port}`));
