$(document).ready(() => {

    getRecommendations();
    checkTab();
    getViews()
})

checkTab = async () => {

    const params = new URLSearchParams(window.location.search)
    if (params.has('initial')) {
        if (params.get('initial') === 'predictions' || params.get('initial') === 'prediction') {

            switchToPredictions()

        } else {

            switchToNearestNeighbours()
        }

    }
    else {
        switchToNearestNeighbours()
    }
}


$('#nn').click(() => {
    if (!$('#nn').hasClass('active')) {
        $('#p').removeClass('active')
        switchToNearestNeighbours()
    }
})
$('#p').click(() => {
    if (!$('#p').hasClass('active')) {
        $('#nn').removeClass('active')
        switchToPredictions()

    }
})

const switchToNearestNeighbours = async () => {
    $('#nn').addClass('active')
    $('#predictions').hide()
    $('#nearest-neighbours').show()

}

const switchToPredictions = async () => {
    $('#p').addClass('active')
    $('#nearest-neighbours').hide()
    $('#predictions').show();
}

const getRecommendations = async () => {

    $.get('/Profile/Recommendations/Get', undefined, (data, status, xhr) => {
        if (status === 'success') {
            getViews()
            if (data.Neighbours.length !== 0) {
                getUserInfo(data)
            } else {
                renderNotFound()
            }
        }
    })
}


const getUserInfo = async (data) => {

    $.get('/Profile/Recommendations/User/Data/Fetch', data, (data, status, xhr) => {
        if (status === 'success') {
            renderNeighbours(data.neighbours);
            renderPredictions(data.predictions);
        }


    })
}

const getViews = async () => {

    $.get('/Profile/Recommendations/Get/Views', undefined, (data, status, xhr) => {
        if (status === 'success') {
            if (data.length !== 0) {
                getDataOfHighlyViewedProfiles(data)
            }
        }
    })

}

const renderNeighbours = async (data) => {
    const parent = document.querySelector('#nearest-neighbours');
    const template = document.querySelector('#user-card-recommendation').innerHTML;
    const html = Handlebars.compile(template);
    parent.insertAdjacentHTML('beforeend', html({ data }))

}

const renderPredictions = async (data) => {

    const parent = document.querySelector('#predictions');
    const template = document.querySelector('#user-card-recommendation').innerHTML;
    const html = Handlebars.compile(template);
    parent.insertAdjacentHTML('beforeend', html({ data }))
}

const getDataOfHighlyViewedProfiles = async (profileData) => {

    $.get('/Profile/Recommendations/HighViewed/Data/Fetch', { profileData }, (data, status, xhr) => {
        if (status === 'success') {
            renderHighViewedProfiles(data)
        }
    })

}

const renderHighViewedProfiles = async (data) => {

    const parent = document.querySelector('#sticky-sidebar');
    const template = document.querySelector('#side-bar-template').innerHTML;
    const html = Mustache.render(template, { Title: 'Most Viewed Profiles', data });
    parent.innerHTML = html;
}

const renderNotFound = async () => {

    const parent = document.querySelector('#nearest-neighbours');
    const parent2 = document.querySelector('#predictions');
    const template = document.querySelector('#not-found').innerHTML;
    const html = Handlebars.compile(template);
    parent.insertAdjacentHTML('beforeend', html({ message: 'No neighbours found yet!' }))
    parent2.insertAdjacentHTML('beforeend', html({ message: 'No predictions found yet!' }))

}


