/**
 * 
 */
var currentPage=1;
var lastPage;
function nem2(){
	$.ajax({
		url:'/montsame/public/library/books/list/page/'+(currentPage+1),
		type:"POST",
		data:"format=json",
		async:false,
		success: function(response){
			response=JSON.parse(response);
			lastPage= response.lastPage;
			if (currentPage<lastPage){
			for (var i in response.books){
				$('#booksResponse').append('<li><a href="'+response.books[i].book_id+'" class="thumbnail"><h5>'+response.books[i].title+'</h5><img src="'+response.books[i].text+'" alt=""></a></li>');
					}
			}
			currentPage=response.currentPage;
		}});
}
$(function() {
			$(window).scroll(function () {
				var theWindow = $(this);       
				var theContainer = $('#booksResponse');  
				var tweak = -153;
				if ( theWindow.scrollTop() >= theContainer.height() - theWindow.height() - tweak ) {
					nem2();
				}
			});
		});