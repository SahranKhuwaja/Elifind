
var current_fs, next_fs, previous_fs;
var left, opacity, scale; 
var animating; 

$(".next").click(function(){

	if($('#msform').validate().form()){
       
	   if(animating) return false;
	   animating = true;
	
	   current_fs = $(this).parent();
	   next_fs = $(this).parent().next();
	

	   $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	   next_fs.show(); 
	   current_fs.animate({opacity: 0}, {
		   step: function(now, mx) {
			   scale = 1 - (1 - now) * 0.2;
			   left = (now * 50)+"%";
			   opacity = 1 - now;
			   current_fs.css({
               'transform': 'scale('+scale+')',
               'position': 'absolute'
                });
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeInOutBack'
	});
}
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	previous_fs.show(); 
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			scale = 0.8 + (1 - now) * 0.2;
			left = ((1-now) * 50)+"%";
			opacity = 1 - now;
			current_fs.css({'left': left,'display':'none'});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity,'position':'relative'});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeInOutBack'
	});
});


$('#msform').submit((e)=>{
	e.preventDefault();
})

$('#create').click(()=>{
	
	if($('#msform').validate().form()){
	   createProject();
	   $('#create').attr('data-dismiss','modal')
	}
	
    
	
})


const createProject = ()=>{

   const createProject ={
	   Title : $('#pTitle').val(),
	   Type : $('#pType').val(),
	   Category : $('#pCat').val(),
	   Technology : $('#pTech').val(),
	   Description : $('#pDes').val(),
	   GitLink : $('#pGit').val() !== "" ? $('#pGit').val() : undefined,
	   Tags : $('#pTag').val() !== "" ?$('#pTag').val():undefined,
	}
   
	$.post('/Profile/Projects/Create',createProject,(data,status,xhr)=>{
		if(Object.entries(data).length !==0 && status ==='success'){
            renderIndividualProject(data);
			resetForm();			
			
		}
	})


}

const resetForm = ()=>{
	$('#msform').trigger('reset');
	$("#pTag").tagsinput('removeAll');
	$("#progressbar li").eq(1).removeClass('active');
	$("#progressbar li").eq(2).removeClass('active');
	$("fieldset:last").hide();
	$("fieldset:first").css({'opacity':1,'position':'relative','display':'block','transform':'scale(1)'})
	$("fieldset").eq(1).css({'transform':'scale(1)','position':'relative'});

}

$(document).ready(()=>{
	getUserProjects();
})


const getUserProjects = ()=>{

	$.get('/Profile/Projects/MyProjects/Get',undefined,(data,status,xhr)=>{
		renderProjects(data);
	})
	
}

const renderProjects = (data)=>{
	
	const template = document.querySelector('#project-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#main-content');
	let html = undefined
	if(!Object.entries(data).length!==0){
	html = Mustache.render(template,{Projects:data.Projects})
	}
	else{

	}
	parentDiv.insertAdjacentHTML('beforeend',html)


}

const  renderIndividualProject  = (data)=>{
	const template = document.querySelector('#project-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#main-content');
	const html = Mustache.render(template,{Projects:data})
	parentDiv.insertAdjacentHTML('beforeend',html)
};

const open = (id)=>{
	
	$.get('/Profile/Projects/MyProjects/Project/Open',{id},(data,status,xhr)=>{
		 openDirectory(...data);
		 
	})
	
}

const openDirectory = (data)=>{
	$('#page-contents').hide('slow');
	const template = document.querySelector('#directory').innerHTML;
	const parentDiv = document.querySelector('#timeline');
	const html = Mustache.render(template,{Project:data,createdAt:moment(data.createdAt).fromNow(),updatedAt:moment(data.updatedAt).fromNow()})
	parentDiv.insertAdjacentHTML('beforeend',html);
	$('#projectFilesSection').hide('fast');
	$('#projectFiles').click((e)=>{
		e.preventDefault();
		toggleToFiles();
	})
	$('#projectDetails').click((e)=>{
	   e.preventDefault();
	   toggleToDetails();
	})
}

const back = (e)=>{

	$('.back').remove();
	$('#page-contents').show('slow');
	
}

const toggleToFiles = ()=>{

	$('#pDetails').removeClass('active');
	$('#pD').removeClass('active');
	$('#pFiles').addClass('active');
	$('#pF').addClass('active');
	$('#projectDetailsSection').hide('slow');
	$('#projectFilesSection').show('slow');
    
}

const toggleToDetails = ()=>{

	$('#pFiles').removeClass('active');
	$('#pF').removeClass('active');
	$('#pDetails').addClass('active');
	$('#pD').addClass('active');
	$('#projectFilesSection').hide('slow');
	$('#projectDetailsSection').show('slow');

}