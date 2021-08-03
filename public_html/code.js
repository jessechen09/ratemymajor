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
		method: 'GET',
		success: (result)=>{
			$("#reviewSection").html(result);
		}
	});
} 

function searchUni(){
	$.ajax({
		url: '/search/university/'+ $('#searchUni').val(),
		data: {},
		method: 'GET',
		success: (result)=>{
			$("#reviewSection").html(result);
		}
	});
} 

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



// function addReview(){
// 	$.ajax({  
// 		url: ,
// 		data: {},
// 		method: 'POST',
// 		success: (result)=>{

// 		}
// 	})
// }

// function addComment(){
// 	$.ajax({
// 		url: ,
// 		data: {},
// 		method: 'POST',
// 		success: (result)=>{
			
// 		}
// 	})
// }

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

// function thumbsUpReview(){
// 	$.ajax({
// 		url: ,
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{
			
// 		}
// 	})
// }

// function thumbsDownReview(){
// 	$.ajax({
// 		url: ,
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{
			
// 		}
// 	})
// }

// function thumbsUpComment(){
// 	$.ajax({
// 		url: ,
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{
			
// 		}
// 	})
// }

// function thumbsDownComment(){
// 	$.ajax({
// 		url: ,
// 		data: {},
// 		method: 'GET',
// 		success: (result)=>{
			
// 		}
// 	})
// }

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
