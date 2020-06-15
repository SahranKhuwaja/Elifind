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
     $("fieldset").eq(0).css({'opacity':1,'position':'relative','display':'block','transform':'scale(1)'})
	 $("fieldset").eq(1).css({'transform':'scale(1)','position':'relative'});
	 $("fieldset").eq(2).hide()
 
 }
 $(document).ready(()=>{
	getUserPortfolios();
})

//const url = window.location.pathname;  
//const userID = url.split('/')[3];
let updatePortfolio = false;
//const myID = document.querySelector('#clogged').innerHTML.trim();
let portfolioID = undefined;
let portfolioTitle = undefined;

const getUserPortfolios = ()=>{
	
	$.get('/Profile/Portfolios/MyPortfolios/Get',{userID},(data,status,xhr)=>{
		getPortfolioRatings(data);
	})
	
}
const getPortfolioRatings = (portfolios) => {
	$.get('/Profile/Media/Ratings', { portfolios }, (data, status, xhr) => {
		renderPortfolios(data);
	})
	
}

const renderPortfolios = (data)=>{
	const template = document.querySelector('#portfolio-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#portfoliosList');
    let html = undefined;
	if(Object.entries(data).length!==0){
	html = Mustache.render(template,{Portfolios:data})
	parentDiv.insertAdjacentHTML('beforeend',html)
    ratingConfig();
	}
	

}

 const  renderIndividualPortfolio  = (data)=>{
	const template = document.querySelector('#portfolio-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#portfoliosList');
	const html = Mustache.render(template,{Portfolios:data});
	parentDiv.insertAdjacentHTML('beforebegin',html);
	ratingConfig()
};

const openPortfolio = (id,total, average, oneStar, twoStar, threeStar, fourStar, fiveStar)=>{

    $.get('/Profile/Portfolios/MyPortfolios/Portfolio/Open',{id,userID},(data,status,xhr)=>{
	   openPortfolioDirectory(data,{total, average, oneStar, twoStar, threeStar, fourStar, fiveStar});
	   portfolioID = id;
	   portfolioTitle = data.Title
        
        
   })
}
 
const openPortfolioDirectory = (data,ratings)=>{
	$('#page-contents').hide('slow');
	portfolioDirectoryDetails(data);
	portfolioDirectoryFiles(data._id);
	portfolioDirectoryRatings(data._id, ratings);
	$('#portfolioFilesSection').hide('fast');
	$('#portfolioRatingsSection').hide('fast');
	$('#portfolioFiles').click((e)=>{
		e.preventDefault();
		toggleToPortfolioFiles();
	})
	$('#portfolioDetails').click((e)=>{
	   e.preventDefault();
	   toggleToPortfolioDetails();
	})
	$('#portfolioRatings').click((e) => {
		e.preventDefault();
		toggleToPortfolioRating();
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

const portfolioDirectoryFiles = async(id)=>{
	
	await getProtfolioProjects(id)
	
}

const portfolioDirectoryRatings = async (id, ratings) => {
   await renderAverageRating(ratings);
   await getUserRating(id, userID);
   await getReviews(id);
}

const getProtfolioProjects = async(id)=>{
	$.get('/Profile/Projects/MyProjects/Get',{id,IsPortfolioProject:true,userID},(data,status,xhr)=>{
		renderPortfolioProjects(data,id);
	})
}


const toggleToPortfolioFiles = ()=>{

	$('#portDetails').removeClass('active');
	$('#portD').removeClass('active');
	$('#portRatings').removeClass('active');
	$('#portR').removeClass('active');
	$('#portFiles').addClass('active');
	$('#portF').addClass('active');
	$('#portfolioDetailsSection').hide('slow');
	$('#portfolioRatingsSection').hide('slow');
	$('#portfolioFilesSection').show('slow');
	
}

const toggleToPortfolioDetails = ()=>{

	$('#portFiles').removeClass('active');
	$('#portF').removeClass('active');
	$('#portRatings').removeClass('active');
	$('#portR').removeClass('active');
	$('#portDetails').addClass('active');
	$('#portD').addClass('active');
	$('#portfolioFilesSection').hide('slow');
	$('#portfolioRatingsSection').hide('slow');
	$('#portfolioDetailsSection').show('slow');

}
const toggleToPortfolioRating = () => {
	$('#portDetails').removeClass('active');
	$('#portD').removeClass('active');
	$('#portFiles').removeClass('active');
	$('#portF').removeClass('active');
	$('#portRatings').addClass('active');
	$('#portR').addClass('active');
	$('#portfolioDetailsSection').hide('slow');
	$('#portfolioFilesSection').hide('slow');
	$('#portfolioRatingsSection').show('slow');

}

const backToPortfolios = async(e)=>{

	$('.backToPortfolios').remove();
	$('.backToProjects').remove();
	$('#page-contents').show('slow');
	if (updatePortfolio) {
		$('.portfolio').remove();
		await getUserPortfolios();
	}
	
}

$('#proCreate').click(()=>{
	if($('#msform2').validate().form()){
	   createProject();
	   $('#proCreate').attr('data-dismiss','modal')
	}
})

const createProject = ()=>{

   const createProject ={
	   Title : $('#proTitle').val(),
	   Type : $('#proType').val(),
	   Category : $('#proCat').val(),
	   Technology : $('#proTech').val(),
	   Description : $('#proDes').val(),
	   GitLink : $('#proGit').val() !== "" ? $('#proGit').val() : undefined,
	   Tags : $('#proTag').val() !== "" ?$('#proTag').val():undefined,
	   IsPortfolioProject:true,
	   PortfolioID:portfolioID
	}
   
	$.post('/Profile/Projects/Create',{createProject,postType:'Portfolio/Project'},(data,status,xhr)=>{
		if(Object.entries(data).length !==0 && status ==='success'){
            renderIndividualProject(data);
			resetForm2();			
			$('#portUpdate').html(moment(Date.now()).fromNow())
		}
	})
}
const renderPortfolioProjects = (data,id)=>{
	const template = document.querySelector('#project-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#projectsList');
	let html = undefined
	if(!Object.entries(data).length!==0){
	html = Mustache.render(template,{Projects:data})
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
	$("#progressbar li").eq(4).removeClass('active');
	$("#progressbar li").eq(5).removeClass('active');
	$("fieldset").eq(3).css({'opacity':1,'position':'relative','display':'block','transform':'scale(1)'})
	$("fieldset").eq(4).css({'transform':'scale(1)','position':'relative'});
	$("fieldset").eq(5).hide();
}

const openProject = (id)=>{

	$.get('/Profile/Projects/MyProjects/Project/Open',{id,portfolioID,userID,IsPortfolioProject:true},(data,status,xhr)=>{
       if(status==='success'){
		openProjectDirectory(data);
	   }
		
   })
}

const openProjectDirectory = (data)=>{
	
	$('#page-contents2').hide('slow');
	projectDirectoryDetails(data);
    projectDirectoryFiles(data._id);
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
	const html = Mustache.render(template,{Project:data,createdAt:moment(data.createdAt).fromNow(),portfolioTitle,updatedAt:moment(data.updatedAt).fromNow()})
	parentDiv.insertAdjacentHTML('beforeend',html);
	portfolioTitle = data.Title;
}

const projectDirectoryFiles = async(id)=>{

	await getProjectFiles(id);
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

const getProjectFiles = async (id) => {

	await getProjectImages(id);
	await getProjectVideos(id)


}

const getProjectImages = async (id) => {
	$.get('/Project/Images/Get', { id }, (data, status, xhr) => {
		if (status === 'success') {
			renderAlbum(data, id)

		}
	})
}

const getProjectVideos = async (id) => {
	$.get('/Project/Videos/Get', { id }, (data, status, xhr) => {
		if (status === 'success') {
			renderVideos(data, id)

		}
	})
}

const renderAlbum = async (data, id) => {

	const template = document.querySelector('#albumSection').innerHTML;
	const parentDiv = document.querySelector('#projectFilesSection');
	const html = await Mustache.render(template, { id, data });
	await parentDiv.insertAdjacentHTML('beforeend', html);
	if ($('#dropzoneImages').length !== 0) {
		let imageDropzone = new Dropzone("#dropzoneImages", { url: '/Profile/Projects/Album/Upload?portfolio=true' });
		imageDropzone.options.uploadMultiple = true;
		imageDropzone.options.parallelUploads = 100;
		imageDropzone.options.retryChunks = true;
		imageDropzone.options.addRemoveLinks = true;
		imageDropzone.options.accept = (file, done) => {
			if (!file.name.toLowerCase().match(/\.(jpg||jpeg||png||gif)$/)) {
				return done('Not an image file!');
			}
			done();
		}

		document.querySelectorAll('div.dz-message')[0].querySelector('span').innerHTML = "Drag and drop files here <br /><br /> or <br /><br /> Click to upload" +
			"<br /> <br /> <img src='/images/upload-ico.png' />";
		const listItemTemplate = document.querySelector('#albumListItem').innerHTML;
		const parentDivForListItem = document.querySelector('#albumPhotos');
		let html2 = undefined;

		imageDropzone.on("successmultiple", async function (file, responseText) {
			html2 = await Mustache.render(listItemTemplate, { data: responseText });
			await parentDivForListItem.insertAdjacentHTML('afterbegin', html2);
			$('#pUpdate').html(moment(Date.now()).fromNow())

		});
	}

}


const renderVideos = async (data, id) => {

	const template = document.querySelector('#videoSection').innerHTML;
	const parentDiv = document.querySelector('#projectFilesSection');
	const html = await Mustache.render(template, { id, data });
	await parentDiv.insertAdjacentHTML('beforeend', html);
	if ($('#dropzoneVideos').length !== 0) {
		let videoDropzone = new Dropzone("#dropzoneVideos", { url: '/Profile/Projects/Video/Upload?portfolio=true' });
		videoDropzone.options.maxFilesize = 1000000;
		videoDropzone.options.uploadMultiple = true;
		videoDropzone.options.parallelUploads = 100;
		videoDropzone.options.retryChunks = true;
		videoDropzone.options.timeout = 600000;
		videoDropzone.options.addRemoveLinks = true
		videoDropzone.options.accept = (file, done) => {
			if (!file.name.toLowerCase().match(/\.(webm||mpg||mp2||mpeg||mpe||mpv||ogg||mp4||m4p||m4v||avi||wmv||mov||qt||flv||swf||avchd||3gp)$/)) {
				return done('Not an video file!');
			}
			done();
		}
		document.querySelectorAll('div.dz-message')[1].querySelector('span').innerHTML = "Drag and drop files here <br /><br /> or <br /><br /> Click to upload" +
			"<br /> <br /> <img src='/images/upload-ico.png' />";
		const listItemTemplate = document.querySelector('#videoListItem').innerHTML;
		const parentDivForListItem = document.querySelector('#videosList');
		let html2 = undefined;
		videoDropzone.on("successmultiple", async function (file, responseText) {
			html2 = await Mustache.render(listItemTemplate, { data: responseText });
			await parentDivForListItem.insertAdjacentHTML('afterbegin', html2);
			$('#pUpdate').html(moment(Date.now()).fromNow())
		});
	}
	await toggleCheck()

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

const renderAverageRating = async (ratings) => {
	const template = document.querySelector('#avgRating').innerHTML;
	const parentDiv = document.querySelector('#portfolioRatingsSection');
	const html = await Mustache.render(template, { ratings });
	await parentDiv.insertAdjacentHTML('afterbegin', html);
	await staticRatedConfig();
}

const getUserRating = (id, userID) => {
	$.get('/Profile/Media/Ratings/MyRating', { id,type:'Portfolio'}, (data, status, xhr) => {
		if (status === 'success') {
			renderUserRating(data.Rating, data.createdAt, id)
		}
	})

}

const renderUserRating = async (value, time, id) => {

	const template = document.querySelector('#userRating').innerHTML;
	const parentDiv = document.querySelector('#portfolioRatingsSection');
	const html = await Mustache.render(template, { value, time: time ? await moment(time).fromNow() : undefined });
	await parentDiv.insertAdjacentHTML('beforeend', html);
	await rateConfig();
	if (value === undefined) {
		return await allowRating(id);
	}
	await renderRating();
}

const rateConfig = () => {
	$('.rate').rating({
		min: 0, max: 5, step: 0.1, size: "lg", stars: "5",
		theme: 'krajee-fa',
		filledStar: '<i class="icon fa fa-star"></i>',
		emptyStar: '<i class="icon fa fa-star"></i>',

	});
}
const getReviews = (id) => {

	$.get('/Profile/Media/Reviews',{id,type:'Portfolio'},(data,status,xhr)=>{

		if(status==='success'){

			renderReviews(id,data);
		}
		
	})

	

}
const renderReviews = async (id,data) => {
	const template = document.querySelector('#userReviews').innerHTML;
	const parentDiv = document.querySelector('#portfolioRatingsSection');
	let reviewed = data.length===0?"":data.filter(e=>e.reviewed===true)
	setTimeout(async () => {
		const html = await Mustache.render(template,{rating:$('.rate').val(),data,total:data.length,reviewed:reviewed.length!==0?true:false});
		await parentDiv.insertAdjacentHTML('beforeend', html);
		await staticRatedForReviewConfig();
		await setListenerForReview(id)
	}, 700);
}

const staticRatedConfig = () => {
	$(".staticRated").rating({
		min: 0, max: 5, step: 0.1, size: "md", stars: "5", displayOnly: true, showCaption: false, readonly: true,
		theme: 'krajee-fa',
		// filledStar:'<i class="icon fa fa-star"></i>',
		// emptyStar: '<i class="icon fa fa-star"></i>',
	});
}
const ratingConfig = () => {
	$(".rated").rating({
		min: 0, max: 5, step: 0.1, size: "lg", stars: "5", displayOnly: true, readonly: true,
		theme: 'krajee-fa',
		filledStar: '<i class="icon fa fa-star"></i>',
		emptyStar: '<i class="icon fa fa-star"></i>',
	});
}

const staticRatedForReviewConfig = () => {
	$('.ratedForReview').rating({
		min: 0, max: 5, step: 0.1, size: "sm", stars: "5", displayOnly: true, readonly: true, showCaption: false,
		theme: 'krajee-fa',
		filledStar: '<i class="icon fa fa-star"></i>',
		emptyStar: '<i class="icon fa fa-star"></i>',
	});
}
const allowRating = async (id) => {
	$('.rate').rating().change(async (e) => {
		await rate(id, e.target.value);
	})
}

const rate = (id, rating) => {
	$.post('/Profile/Media/Rate', { rating, id, type: 'Portfolio' }, (data, status, xhr) => {
		if (status === 'success' && data === true) {
			$('#stats').remove();
			updateRatingStats(id, userID)
			renderRating(rating);
			$('#ratedTime').html(moment(Date.now()).fromNow())
			if(userID){
				socket.emit('notification',{myID,userID,notificationText:'recently rated on your',notificationAbout:'portfolio',mediaName:portfolioTitle})
			 }
		}

	});
}
const updateRatingStats = async (id, userID) => {

	$.get('/Profile/Media/Ratings/Overall', { id, type:'Portfolio'}, (data, status, xhr) => {
		if (status === 'success' && data !== null) {
			updatePortfolio = true;
			renderAverageRating(data);
		}
	})

}

const renderRating = (rating) => {

	$('.rate').rating('refresh', { disabled: true, readonly: true, displayOnly: true, showClear: true });
	if($('#myCommentArea').length !==0){
		$('#myRating').rating('update',rating)
	}
    

}


const setListenerForReview = (id) => {
	$('#btnReview').click(() => {
		review(id);
	})
}

const review = async (id) => {
    const review = $('#comment').val();
	$.post('/Profile/Media/Review', { review, id, type: 'Portfolio' }, (data, status, xhr) => {

		if (status === 'success' && data === true) {
			$('#myCommentArea').remove()
			renderSuccessMessage(review)
		}

	});
}

const renderSuccessMessage = async(comment)=>{
	const template = document.querySelector('#successReviewed').innerHTML;
	const parentDiv = document.querySelector('#portfolioRatingsSection');
	const html = await Mustache.render(template,{comment,time:await moment(Date.now()).fromNow(),rating:$('.rate').val()});
	await parentDiv.insertAdjacentHTML('beforeend', html);
	await staticRatedForReviewConfig();
	$('#total-reviews').html(parseInt($('#total-reviews').html()) + 1);
	if(userID){
		socket.emit('notification',{myID,userID,notificationText:'just reviewed on your',notificationAbout:'portfolio',mediaName:portfolioTitle})
	 }
}

