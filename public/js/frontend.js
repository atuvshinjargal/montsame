function Displaybooks(response){
	response = JSON.parse(response);
	$("#booksResponse").html('');
	for (var i in response.books){
		$("#booksResponse").append('<div id="books"><h3><a href="#">'+response.books[i].title+'</a><h3><div>written by'+response.books[i].author+'</div></div>');
	}
	$("#booksResponse #books").accordion({"active":"none","collapsible":"true"});
	
	$('#currentpage').html(response.currentPage);
	updatePageLink(response.currentPage);
}
function updatePageLink(page){
	$('#previous').attr('page',page-1);
	$('#next').attr('page',page+1);
}
function getBooks(){
	var url=window.location.pathname+'/page/'+$(this).attr('page');
	$.post(url,
			{"format":"json"},
			function (data){
				Displaybooks(data);
			},'html'
			);
	return false;
}
$(document).ready(function(){
	$("a#next").click(getBooks);
	$("a#previous").click(getBooks);
	$("a#page").each(function(){
		$(this).click(getBooks);
	})
});