

$(function(){

 
 
    $('#search').autocomplete({
	  

    source: function(req,res){
     
      $.ajax({
        url:"/autocomplete/",
        dataType:"jsonp",
        type:"GET",
        data:req,
        success: function(data){
		 
          var obj = [{}]
          for(var i =0;i<data.length;i++){
            obj[i] = {label:data[i].label,id:data[i].id}
          }
          $.ui.autocomplete.prototype._renderItem = function (ul, item) {
            item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<font style='color:#52188c'>$1</font>");
            return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a style='text-decoration:none;'>" + item.label + "</a>")
                    .appendTo(ul);
        }
    
    
          
  
          res(obj);
          
        },
        error: function(err){
          console.log(err.status);
        }
      })
	},
	focus: function( event, ui ) {


		
	}
	,select: function( event, ui ) {
		window.location.href = '/Profile/View/'+ui.item.id+'/Timeline';
		
	 
	},
  response: function( event, ui ) {

 
    
  }
  
	
  })
 
  

      });
    

      