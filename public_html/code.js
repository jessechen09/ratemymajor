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
		url: '/search/major/'+ $('#searchMajor').val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#reviewSection").html(result);
		}
	});
} 

function searchUni(){
	$.ajax({
		url: '/search/university/'+ $('#searchUni').val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#reviewSection").html(result);
		}
	});
} 

function showComments(id){
	$.ajax({  
		url: '/show/comments/'+id,
		data: {},
		method: 'POST',
		success: (result)=>{
			$("#"+id+"cmts").html(result);
			$("#"+id+"CmtButton").attr("disabled",true);
		}
	})
}

// function addReview(){
// 	$.ajax({  
// 		url: ,
// 		data: {},
// 		method: 'POST',
// 		success: (result)=>{

// 		}
// 	})
// }

// function filterBy(){
// 	$.ajax({
// 		url: '/filter/' + $('#filterBy').val(),
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{
// 			console.log('view listing success');
// 			$("#reviewSection").html(result);
// 		}
// 	});
// }

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

// function deleteReview(){
// 	$.ajax({
// 		url: ,
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{

// 		}
// 	})
// }

// function deleteComment(){
// 	$.ajax({
// 		url: ,
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{

// 		}
// 	})
// }

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

// function logout(){
// 	$.ajax({
// 		url: '/login/'+$('#luser').val()+'/'+$('#lpassword').val(),
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{
// 			console.log('user login attempt received: '+$('#luser').val()+', '+$('#passwordLog').val());
// 			if(result=='pass'){
// 				console.log('user login successful')
// 				window.location='/home.html';//?username='+$('#usernameLog').val()+'&password='+$('#passwordLog').val();
// 			} else {
// 				alert("Login failed. Please try again.");
// 			}
// 		}
// 	});
// } 
