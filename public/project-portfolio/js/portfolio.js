let portfolioID;
let portfolioName;
$('#create').click(()=>{
	
	if($('#msform').validate().form()){
	   createPortfolio();
	   $('#create').attr('data-dismiss','modal')
	}
})

const createPortfolio = ()=>{

    const portfolio ={
        Title : $('#pTitle').val(),
        Type : $('#pType').val(),
        Category : $('#pCat').val(),
        Description : $('#pDes').val(),
     }
    
     $.post('/Profile/Portfolio/Create',portfolio,(data,status,xhr)=>{
         if(Object.entries(data).length !==0 && status ==='success'){
             renderIndividualPortfolio(data);
             resetForm();			
             
         }
     })
 }
 const resetForm = ()=>{
     $('#msform').trigger('reset');
     $("#progressbar li").eq(1).removeClass('active');
     $("#progressbar li").eq(2).removeClass('active');
     $("fieldset:last").hide();
     $("fieldset:first").css({'opacity':1,'position':'relative','display':'block','transform':'scale(1)'})
     $("fieldset").eq(1).css({'transform':'scale(1)','position':'relative'});
 
 }
 $(document).ready(()=>{
	getUserPortfolios();
})

const url = window.location.pathname;  
const userID = url.split('/')[3];

const getUserPortfolios = ()=>{
	
	$.get('/Profile/Portfolios/MyPortfolios/Get',{userID},(data,status,xhr)=>{
		renderPortfolios(data);
	})
	
}

const renderPortfolios = (data)=>{

	const template = document.querySelector('#portfolio-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#portfoliosList');
    let html = undefined;
	if(!Object.entries(data).length!==0){
	html = Mustache.render(template,{Portfolios:data.Portfolios.reverse()})
	}
	else{

	}
	parentDiv.insertAdjacentHTML('beforeend',html)


}

 const  renderIndividualPortfolio  = (data)=>{
	const template = document.querySelector('#portfolio-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#portfoliosList');
	const html = Mustache.render(template,{Portfolios:data})
	parentDiv.insertAdjacentHTML('beforebegin',html)
};

const openPortfolio = (id)=>{

    $.get('/Profile/Portfolios/MyPortfolios/Portfolio/Open',{id,userID},(data,status,xhr)=>{
	   openPortfolioDirectory(data);
	   portfolioID = id;
	   portfolioName = data.Title
        
        
   })
}
 
const openPortfolioDirectory = (data)=>{
	$('#page-contents').hide('slow');
	portfolioDirectoryDetails(data);
    portfolioDirectoryFiles(data.Projects,data._id);
	$('#portfolioFilesSection').hide('fast');
	$('#portfolioFiles').click((e)=>{
		e.preventDefault();
		toggleToPortfolioFiles();
	})
	$('#portfolioDetails').click((e)=>{
	   e.preventDefault();
	   toggleToPortfolioDetails();
	})
}
const portfolioDirectoryDetails = (data)=>{
	const template = document.querySelector('#portfolioDirectory').innerHTML;
	const parentDiv = document.querySelector('#timeline');
    let Portfolio = {...data};
    delete Portfolio.Projects
	const html = Mustache.render(template,{Portfolio:data,createdAt:moment(data.createdAt).fromNow(),updatedAt:moment(data.updatedAt).fromNow()})
	parentDiv.insertAdjacentHTML('beforeend',html);
	
}

const toggleToPortfolioFiles = ()=>{

	$('#portDetails').removeClass('active');
	$('#portD').removeClass('active');
	$('#portFiles').addClass('active');
	$('#portF').addClass('active');
	$('#portfolioDetailsSection').hide('slow');
	$('#portfolioFilesSection').show('slow');
	
}

const toggleToPortfolioDetails = ()=>{

	$('#portFiles').removeClass('active');
	$('#portF').removeClass('active');
	$('#portDetails').addClass('active');
	$('#portD').addClass('active');
	$('#portfolioFilesSection').hide('slow');
	$('#portfolioDetailsSection').show('slow');

}

const backToPortfolios = (e)=>{

	$('.backToPortfolios').remove();
	$('.backToProjects').remove();
	$('#page-contents').show('slow');
	
}

$('#proCreate').click(()=>{
	
	if($('#msform2').validate().form()){
	   createProject();
	   $('#proCreate').attr('data-dismiss','modal')
	}
})

const portfolioDirectoryFiles = (data,id)=>{
     renderPortfolioProjects(data,id);
}

const createProject = ()=>{

   const createProject ={
	   Title : $('#proTitle').val(),
	   Type : $('#proType').val(),
	   Category : $('#proCat').val(),
	   Technology : $('#proTech').val(),
	   Description : $('#proDes').val(),
	   GitLink : $('#proGit').val() !== "" ? $('#proGit').val() : undefined,
	   Tags : $('#proTag').val() !== "" ?$('#proTag').val():undefined,
	}
   
	$.post('/Profile/Portfolios/Projects/Create',{createProject,portfolioID},(data,status,xhr)=>{
		if(Object.entries(data).length !==0 && status ==='success'){
            renderIndividualProject(data);
			resetForm2();			
			
		}
	})
}
const renderPortfolioProjects = (data,id)=>{
	const template = document.querySelector('#project-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#projectsList');
	let html = undefined
	if(!Object.entries(data).length!==0){
	html = Mustache.render(template,{Projects:data.reverse()})
	}
	else{

	}
	parentDiv.insertAdjacentHTML('beforeend',html)

}
const renderIndividualProject = (data)=>{

	const template = document.querySelector('#project-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#projectsList');
	const html = Mustache.render(template,{Projects:data})
	parentDiv.insertAdjacentHTML('beforebegin',html)

}
const resetForm2 = ()=>{
	$('#msform2').trigger('reset');
	$("#proTag").tagsinput('removeAll');
	$("#progressbar li").eq(1).removeClass('active');
	$("#progressbar li").eq(2).removeClass('active');
	$("fieldset:last").hide();
	$("fieldset:first").css({'opacity':1,'position':'relative','display':'block','transform':'scale(1)'})
	$("fieldset").eq(1).css({'transform':'scale(1)','position':'relative'});

}

const openProject = (id)=>{

	$.get('/Profile/Portfolios/MyPortfolios/Project/Open',{id,portfolioID,userID},(data,status,xhr)=>{

		openProjectDirectory(...data);
		
   })
}

const openProjectDirectory = (data)=>{
	
	$('#page-contents2').hide('slow');
	projectDirectoryDetails(data);
    projectDirectoryFiles(data.Project,data._id);
	$('#projectFilesSection').hide('fast');
	$('#projectFiles').click((e)=>{
	 	e.preventDefault();
		toggleToProjectFiles();
	})
	$('#projectDetails').click((e)=>{
	   e.preventDefault();
	   toggleToProjectDetails();
	})
}
const projectDirectoryDetails = (data)=>{
	
	const template = document.querySelector('#projectDirectory').innerHTML;
	const parentDiv = document.querySelector('#timeline');
	let Project = {...data};
	delete Project.Project
	const html = Mustache.render(template,{Project:data,createdAt:moment(data.createdAt).fromNow(),portfolioName,updatedAt:moment(data.updatedAt).fromNow()})
	parentDiv.insertAdjacentHTML('beforeend',html);
	
}

const projectDirectoryFiles = async(data,id)=>{

	await renderAlbum(data.Images,id);
	await renderVideos(data.Videos,id);
	await toggleCheck();
	$('#albumSecLabel').click(()=>{
		$('#videoSecLabel').removeClass('active');
		$('#albumSecLabel').addClass('active');
		toggleCheck();
	})
	$('#videoSecLabel').click(()=>{
		$('#albumSecLabel').removeClass('active');
		$('#videoSecLabel').addClass('active');
		toggleCheck();
	})
}

const toggleToProjectFiles = ()=>{

	$('#proDetails').removeClass('active');
	$('#proD').removeClass('active');
	$('#proFiles').addClass('active');
	$('#proF').addClass('active');
	$('#projectDetailsSection').hide('slow');
	$('#projectFilesSection').show('slow');
	
}

const toggleToProjectDetails = ()=>{

	$('#proFiles').removeClass('active');
	$('#proF').removeClass('active');
	$('#proDetails').addClass('active');
	$('#proD').addClass('active');
	$('#projectFilesSection').hide('slow');
	$('#projectDetailsSection').show('slow');

}


const renderAlbum = async(data,id)=>{

	const template = document.querySelector('#albumSection').innerHTML;
	const parentDiv = document.querySelector('#projectFilesSection');
	const html = await Mustache.render(template,{data,id});
	await parentDiv.insertAdjacentHTML('beforeend',html);
	if($('#dropzoneImages').length !==0){
	let imageDropzone = new Dropzone("#dropzoneImages",{url:'/Profile/Portfolios/Projects/Album/Upload'});
	imageDropzone.options.uploadMultiple = true;
	imageDropzone.options.parallelUploads = 100;
	imageDropzone.options.retryChunks = true;
	imageDropzone.options.addRemoveLinks = true;
	imageDropzone.options.accept = (file,done)=>{
		if(!file.name.toLowerCase().match(/\.(jpg||jpeg||png||gif)$/)){
			return done('Not an image file!');
		}
		done();
	}

	document.querySelectorAll('div.dz-message')[0].querySelector('span').innerHTML = "Drag and drop files here <br /><br /> or <br /><br /> Click to upload" +
	"<br /> <br /> <img src='/images/upload-ico.png' />";
	const listItemTemplate = document.querySelector('#albumListItem').innerHTML;
	const parentDivForListItem = document.querySelector('#albumPhotos');
	let html2 = undefined;
	imageDropzone.on("successmultiple", async function(file, responseText) { 
      
		html2 = await Mustache.render(listItemTemplate,{data:responseText});
        await parentDivForListItem.insertAdjacentHTML('afterbegin',html2);
		
	 });
	}

}


const renderVideos = async(data,id)=>{

	const template = document.querySelector('#videoSection').innerHTML;
	const parentDiv = document.querySelector('#projectFilesSection');
	await data.filter(async(e)=>e.created = await moment(e.createdAt).fromNow())
	const html = await Mustache.render(template,{data,id});
	await parentDiv.insertAdjacentHTML('beforeend',html);
	if($('#dropzoneVideos').length !==0){
	let videoDropzone = new Dropzone("#dropzoneVideos",{url:'/Profile/Portfolios/Projects/Videos/Upload'});
	videoDropzone.options.maxFilesize = 1000000;
	videoDropzone.options.uploadMultiple = true;
	videoDropzone.options.parallelUploads = 100;
	videoDropzone.options.retryChunks = true;
	videoDropzone.options.timeout = 600000;
	videoDropzone.options.addRemoveLinks = true
	videoDropzone.options.accept = (file,done)=>{
		if(!file.name.toLowerCase().match(/\.(webm||mpg||mp2||mpeg||mpe||mpv||ogg||mp4||m4p||m4v||avi||wmv||mov||qt||flv||swf||avchd||3gp)$/)){
			return done('Not an video file!');
		}
		done();
	}
	document.querySelectorAll('div.dz-message')[1].querySelector('span').innerHTML = "Drag and drop files here <br /><br /> or <br /><br /> Click to upload" +
	"<br /> <br /> <img src='/images/upload-ico.png' />";
	const listItemTemplate = document.querySelector('#videoListItem').innerHTML;
	const parentDivForListItem = document.querySelector('#videosList');
	let html2 = undefined;
	videoDropzone.on("successmultiple", async function(file, responseText) { 
		html2 = await Mustache.render(listItemTemplate,{data:responseText});
        await parentDivForListItem.insertAdjacentHTML('afterbegin',html2);
	
	 });
	}
	
}

const toggleCheck = ()=>{

	
	if($('#albumSecLabel').hasClass('active')){
		$('#vS').hide('fast');
		$('#aS').show('fast');

	}else{

		$('#aS').hide('fast');
		$('#vS').show('fast');
	}
}

const backToProjects = ()=>{
	$('.backToProjects').remove();
	$('.backToPortfolios').show('slow')
}
