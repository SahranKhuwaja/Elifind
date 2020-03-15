
$('#create').click(() => {

	if ($('#msform').validate().form()) {
		createProject();
		$('#create').attr('data-dismiss', 'modal')
	}
})


const createProject = () => {

	const createProject = {
		Title: $('#pTitle').val(),
		Type: $('#pType').val(),
		Category: $('#pCat').val(),
		Technology: $('#pTech').val(),
		Description: $('#pDes').val(),
		GitLink: $('#pGit').val() !== "" ? $('#pGit').val() : undefined,
		Tags: $('#pTag').val() !== "" ? $('#pTag').val() : undefined,
	}

	$.post('/Profile/Projects/Create', createProject, (data, status, xhr) => {
		if (Object.entries(data).length !== 0 && status === 'success') {
			renderIndividualProject(data);
			resetForm();

		}
	})


}

const resetForm = () => {
	$('#msform').trigger('reset');
	$("#pTag").tagsinput('removeAll');
	$("#progressbar li").eq(1).removeClass('active');
	$("#progressbar li").eq(2).removeClass('active');
	$("fieldset").eq(0).css({ 'opacity': 1, 'position': 'relative', 'display': 'block', 'transform': 'scale(1)' })
	$("fieldset").eq(1).css({ 'transform': 'scale(1)', 'position': 'relative' });
	$("fieldset").eq(2).hide();

}

$(document).ready(() => {
	getUserProjects();
})

const url = window.location.pathname;
const userID = url.split('/')[3];
let updateProjects = false;

const getUserProjects = () => {

	$.get('/Profile/Projects/MyProjects/Get', { userID }, (data, status, xhr) => {
		getProjectRatings(data);
	})

}
const getProjectRatings = (projectsInfo) => {
	$.get('/Profile/Media/Ratings', { projects: projectsInfo, userID }, (data, status, xhr) => {
		renderProjects(data);
	})
}
const renderProjects = (data) => {
	const template = document.querySelector('#project-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#projectsList');
	let html = undefined
	if (Object.entries(data).length !== 0) {
		html = Mustache.render(template, { Projects: data.Projects.reverse() })
	}
	parentDiv.insertAdjacentHTML('beforeend', html);
	ratingConfig();
}

const renderIndividualProject = (data) => {
	const template = document.querySelector('#project-thumbnail').innerHTML;
	const parentDiv = document.querySelector('#projectsList');
	const html = Mustache.render(template, { Projects: data });
	parentDiv.insertAdjacentHTML('beforebegin', html);
	ratingConfig();
};

const open = (id, total, average, oneStar, twoStar, threeStar, fourStar, fiveStar) => {

	$.get('/Profile/Projects/MyProjects/Project/Open', { id, userID }, (data, status, xhr) => {
		openDirectory(...data, { total, average, oneStar, twoStar, threeStar, fourStar, fiveStar });
	})

}

const openDirectory = (data, ratings) => {
	$('#page-contents').hide('slow');
	directoryDetails(data);
	directoryFiles(data.Project, data._id);
	directoryRatings(data._id, ratings);
	$('#projectFilesSection').hide('fast');
	$('#projectRatingsSection').hide('fast');
	$('#projectFiles').click((e) => {
		e.preventDefault();
		toggleToFiles();
	})
	$('#projectDetails').click((e) => {
		e.preventDefault();
		toggleToDetails();
	})
	$('#projectRatings').click((e) => {
		e.preventDefault();
		toggleToRating();
	})
}

const directoryDetails = (data) => {
	const template = document.querySelector('#directory').innerHTML;
	const parentDiv = document.querySelector('#timeline');
	let Project = { ...data };
	delete Project.Project
	const html = Mustache.render(template, { Project: data, createdAt: moment(data.createdAt).fromNow(), updatedAt: moment(data.updatedAt).fromNow() })
	parentDiv.insertAdjacentHTML('beforeend', html);

}
const directoryFiles = async (data, id) => {

	await renderAlbum(data.Images, id);
	await renderVideos(data.Videos, id);
	await toggleCheck();

	$('#albumSecLabel').click(() => {
		$('#videoSecLabel').removeClass('active');
		$('#albumSecLabel').addClass('active');
		toggleCheck();
	})
	$('#videoSecLabel').click(() => {
		$('#albumSecLabel').removeClass('active');
		$('#videoSecLabel').addClass('active');
		toggleCheck();
	})

}
const directoryRatings = async (id, ratings) => {
	await renderAverageRating(ratings);
	await getUserRating(id, userID);
	await getReviews(id);
}

const back = async (e) => {

	$('.back').remove();
	$('#page-contents').show('slow');
	if (updateProjects) {
		$('.project').remove();
		await getUserProjects();
	}

}

const toggleToFiles = () => {

	$('#pDetails').removeClass('active');
	$('#pD').removeClass('active');
	$('#pRatings').removeClass('active');
	$('#pR').removeClass('active');
	$('#pFiles').addClass('active');
	$('#pF').addClass('active');
	$('#projectDetailsSection').hide('slow');
	$('#projectRatingsSection').hide('slow');
	$('#projectFilesSection').show('slow');

}

const toggleToDetails = () => {

	$('#pFiles').removeClass('active');
	$('#pF').removeClass('active');
	$('#pRatings').removeClass('active');
	$('#pR').removeClass('active');
	$('#pDetails').addClass('active');
	$('#pD').addClass('active');
	$('#projectFilesSection').hide('slow');
	$('#projectRatingsSection').hide('slow');
	$('#projectDetailsSection').show('slow');

}

const toggleToRating = () => {
	$('#pDetails').removeClass('active');
	$('#pD').removeClass('active');
	$('#pFiles').removeClass('active');
	$('#pF').removeClass('active');
	$('#pRatings').addClass('active');
	$('#pR').addClass('active');
	$('#projectDetailsSection').hide('slow');
	$('#projectFilesSection').hide('slow');
	$('#projectRatingsSection').show('slow');

}


const renderAlbum = async (data, id) => {

	const template = document.querySelector('#albumSection').innerHTML;
	const parentDiv = document.querySelector('#projectFilesSection');
	const html = await Mustache.render(template, { data, id });
	await parentDiv.insertAdjacentHTML('beforeend', html);
	if ($('#dropzoneImages').length !== 0) {
		let imageDropzone = new Dropzone("#dropzoneImages", { url: '/Profile/Projects/Album/Upload' });
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

		});
	}

}


const renderVideos = async (data, id) => {

	const template = document.querySelector('#videoSection').innerHTML;
	const parentDiv = document.querySelector('#projectFilesSection');
	await data.filter(async (e) => e.created = await moment(e.createdAt).fromNow())
	const html = await Mustache.render(template, { data, id });
	await parentDiv.insertAdjacentHTML('beforeend', html);
	if ($('#dropzoneVideos').length !== 0) {
		let videoDropzone = new Dropzone("#dropzoneVideos", { url: '/Profile/Projects/Video/Upload' });
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

		});
	}

}


const renderAverageRating = async (ratings) => {
	const template = document.querySelector('#avgRating').innerHTML;
	const parentDiv = document.querySelector('#projectRatingsSection');
	const html = await Mustache.render(template, { ratings });
	await parentDiv.insertAdjacentHTML('afterbegin', html);
	await staticRatedConfig();
}

const getUserRating = (id, userID) => {
	$.get('/Profile/Media/Ratings/MyRating', { id, userID }, (data, status, xhr) => {
		if (status === 'success') {
			renderUserRating(data.Rating, data.createdAt, id)
		}
	})

}

const renderUserRating = async (value, time, id) => {

	const template = document.querySelector('#userRating').innerHTML;
	const parentDiv = document.querySelector('#projectRatingsSection');
	const html = await Mustache.render(template, { value, time: time ? await moment(time).fromNow() : undefined });
	await parentDiv.insertAdjacentHTML('beforeend', html);
	await rateConfig();
	if (value === undefined) {
		return await allowRating(id);
	}
	await renderRating();
}

const getReviews = (id) => {

	$.get('/Profile/Media/Reviews',{id,userID},(data,status,xhr)=>{

		if(status==='success'){

			renderReviews(id,data);
		}
		
	})

	

}
const renderReviews = async (id,data) => {
	const template = document.querySelector('#userReviews').innerHTML;
	const parentDiv = document.querySelector('#projectRatingsSection');
	let reviewed = data.length===0?"":data.filter(e=>e.reviewed===true)
	setTimeout(async () => {
		const html = await Mustache.render(template,{rating:$('.rate').val(),data,total:data.length,reviewed:reviewed.length!==0?true:false});
		await parentDiv.insertAdjacentHTML('beforeend', html);
		await staticRatedForReviewConfig();
		await setListenerForReview(id)
	}, 700);
}


const toggleCheck = () => {


	if ($('#albumSecLabel').hasClass('active')) {
		$('#vS').hide('fast');
		$('#aS').show('fast');

	} else {

		$('#aS').hide('fast');
		$('#vS').show('fast');
	}
}
const rateConfig = () => {
	$('.rate').rating({
		min: 0, max: 5, step: 0.1, size: "lg", stars: "5",
		theme: 'krajee-fa',
		filledStar: '<i class="icon fa fa-star"></i>',
		emptyStar: '<i class="icon fa fa-star"></i>',

	});
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
	$.post('/Profile/Media/Rate', { rating, id, userID, type: 'Project' }, (data, status, xhr) => {
		if (status === 'success' && data === true) {
			$('#stats').remove();
			updateRatingStats(id, userID)
			renderRating(rating);
			$('#ratedTime').html(moment(Date.now()).fromNow())
		}

	});
}

const updateRatingStats = async (id, userID) => {

	$.get('/Profile/Media/Ratings/Overall', { id, userID }, (data, status, xhr) => {
		if (status === 'success' && data !== null) {
			updateProjects = true;
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
	$.post('/Profile/Media/Review', { review, id, userID, type: 'Project' }, (data, status, xhr) => {

		if (status === 'success' && data === true) {
			$('#myCommentArea').remove()
			renderSuccessMessage(review)
		}

	});
}

const renderSuccessMessage = async(comment)=>{
	const template = document.querySelector('#successReviewed').innerHTML;
	const parentDiv = document.querySelector('#projectRatingsSection');
	const html = await Mustache.render(template,{comment,time:await moment(Date.now()).fromNow(),rating:$('.rate').val()});
	await parentDiv.insertAdjacentHTML('beforeend', html);
	await staticRatedForReviewConfig();
	$('#total-reviews').html(parseInt($('#total-reviews').html()) + 1);
	
}



