/*
Author: Jesse Chen, Kat McGee
Course: CSC 377
Assignment: Final project
File: Handles client side stuff
*/

// pings for a message from server every designated interval time

// AJAX
function login(){
	$.ajax({
		url: '/login/'+$('#luser').val()+'/'+$('#lpassword').val(),
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('user login attempt received: '+$('#luser').val()+', '+$('#passwordLog').val());
			if(result=='pass'){
				console.log('user login successful')
				window.location='/home.html';//?username='+$('#usernameLog').val()+'&password='+$('#passwordLog').val();
			} else {
				alert("Login failed. Please try again.");
			}
		}
	});
}

function addUser(){
	$.ajax({
		url: '/add/user/'+$('#user').val()+'/'+$('#password').val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			if(result=='error'){
				alert("User exists. Please try another username.");
			} else {
				alert("New user created! You can now login!");
				window.location='index.html';
			}
		}
	})
}

function searchMaj(){
	$.ajax({
		url: '/search/major/'+ $('#searchMajor').val() + '/' + $('#sortBy').val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#reviewSection").html(result);
		}
	});
} 

function searchUni(){
	$.ajax({
		url: '/search/university/'+ $('#searchUni').val() + '/' + $('#sortBy').val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#reviewSection").html(result);
		}
	});
} 

var currentId = "";
setInterval(()=>{
	showComments(currentId)
},1);

function showComments(id){
	$.ajax({  
		url: '/show/comments/'+id,
		data: {},
		method: 'POST',
		success: (result)=>{
			currentId=id;
			$("#"+id+"cmts").html(result);
			$("#"+id+"CmtButton").attr("disabled",true);
		}
	})
}

function addComment(id){
	$.ajax({
		url: '/add/comment/'+id+'/'+$("#"+id+"CmtBox").val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#"+id+"CmtBox").val("");
			showComments(id);
		}
	})
}

function showAccInfo(){
	showUsername();
	showReviewsAcc();
	showCommentsAcc();
}

function showUsername(){
	$.ajax({  
		url: '/show/account/username',
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#name").html(result);
		}
	})
}

function showReviewsAcc(){
	$.ajax({  
		url: '/show/account/reviews',
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#reviewList").html(result);
		}
	})
}

function showCommentsAcc(){
	$.ajax({  
		url: '/show/account/comments',
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#commentList").html(result);
		}
	})
}

function addReview(){
	let chMaj = $('#chooseMaj').val();
	let chUni = $('#chooseUni').val();
	let info = $('#review').val();
	let rating = $('#rating').val();
	let image = $('#image').val();
	$.ajax({  
		url: '/add/review/' + chMaj + '/' + chUni + '/' + info + '/' + image,
		data: {},
		method: 'POST',
		success: (result)=>{
			window.location() = '/majors.html';
		}
	})
}

function thumbsUpReview(id){
	$.ajax({
		url: '/thumbsup/review/'+id,
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log("button pressed: "+"#"+id+"up")
			$("#"+id+"up").html(result + " ");
			$("#"+id+"UpButton").attr("disabled",true);
		}
	})
}

function thumbsDownReview(id){
	$.ajax({
		url: '/thumbsdown/review/'+id,
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log("button pressed: "+"#"+id+"down")
			$("#"+id+"down").html(result + " ");
			$("#"+id+"DownButton").attr("disabled",true);
		}
	})
}

function thumbsUpComment(id){
	$.ajax({
		url: '/thumbsup/comment/'+id,
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log("button pressed: "+"#"+id+"up")
			$("#"+id+"up").html(result + " ");
			$("#"+id+"UpButton").attr("disabled",true);
		}
	})
}

function thumbsDownComment(id){
	$.ajax({
		url: '/thumbsdown/comment/'+id,
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log("button pressed: "+"#"+id+"down")
			$("#"+id+"down").html(result + " ");
			$("#"+id+"DownButton").attr("disabled",true);
		}
	})
}

function logout(){
	let cookie = document.cookie;
    cookie = cookie.split('=');
    let parse = JSON.parse(decodeURIComponent(cookie[1]).replace("j:", ""));
	$.ajax({
		url: '/logout/'+ parse.username,
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('user logout attempt received: '+ parse.username +', '+$('#passwordLog').val());
			if(result=='pass'){
				console.log('user logout successful')
				window.location='/index.html';//?username='+$('#usernameLog').val()+'&password='+$('#passwordLog').val();
			} else {
				alert("Logout failed. Please try again.");
			}
		}
	});
} 
