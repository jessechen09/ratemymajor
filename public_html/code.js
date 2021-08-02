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
		url: '/add/user/'+$('#username').val()+'/'+$('#password').val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			if(result=='error'){
				alert("User exists. Please try another username.");
			} else{
				alert("New user created! You can now login!");
			}
		}
	})
}

function searchMaj(){
	$.ajax({
		url: '/search/'+ $('#searchMajor').val(),
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('item added');
			$("#reviewSection").html(result);
		}
	});
} 

function filterBy(){
	$.ajax({
		url: '/filter/' + $('#filterBy').val(),
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('view listing success');
			$("#reviewSection").html(result);
		}
	});
}

function searchUni(){
	$.ajax({
		url: '/search/'+ $('#searchUniversity').val(),
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('item added');
			$("#reviewSection").html(result);
		}
	});
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



// unused ========================================================
function searchListings(){
	$.ajax({
		url: '/search/listings/'+$('#search').val(),
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('item added');
			$("#right").html(result);
		}
	});
} 

function viewListings(){
	$.ajax({
		url: '/view/listings/',
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('view listing success');
			$("#right").html(result);
		}
	});
}

function viewPurchases(){
	$.ajax({
		url: '/view/purchases/',
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('view purchases success');
			$("#right").html(result);
		}
	});
}

function postItem(){
	window.location='/post.html'
}

function createListing(){
	$.ajax({
		url: '/add/item/'+$('#title').val()+'/'+$('#desc').val()+'/'+$('#img').val()+'/'+$('#price').val()+'/'+$('#stat').val(),
		data: {},
		method: 'POST',
		success: (result)=>{
			console.log('item added');
			window.location='/home.html'
		}
	});
}

function buyItem(item){
	$.ajax({
		url: '/buy/item/'+item,
		data: {},
		method: 'GET',
		success: (result)=>{
			console.log('item bought');
			$
		}
	});
}
