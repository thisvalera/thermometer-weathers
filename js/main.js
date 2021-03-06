const searchCityInput = document.querySelector('.weather-form__search');
const searchCityButton = document.querySelector('.weather-form__btn-search');
const backGroundVideo = document.querySelector('.intro__video-bg');
const geloacationButton = document.querySelector('.weather-form__btn-geolacation');
const dateTime = new Date();
let weatherParameters = {};

geloacationButton.addEventListener('click', geolocal);
getResponse('Киев');
searchCityButton.addEventListener('mousedown', (event) => event.preventDefault());

searchCityButton.addEventListener('click', (event) => {
    event.preventDefault();
    getResponse(searchCityInput.value.trim());
    weatherParameters.nameCity = searchCityInput.value;
    searchCityInput.value = '';
    searchCityInput.blur();
});

//real time
function localTime(time) {
    if (dateTime.getMinutes() < 10) {
        document.querySelector('.weather__city-minutes').innerHTML = '0' + time.getMinutes();
    }
    else document.querySelector('.weather__city-minutes').innerHTML = time.getMinutes();
    document.querySelector('.weather__city-hours').innerHTML = time.getUTCHours();
}

async function getResponse(nameCity) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${nameCity}&lang=ru&appid=fecd0fb94f869b345e364c21d98455f9`);
        const responseResult = await response.json();
        const { name, timezone, dt: date, } = responseResult;
        const { temp, feels_like: feelsLike, humidity, pressure } = responseResult.main;
        const { description, main, icon, } = responseResult.weather[0];
        weatherParameters = { name, timezone, date, humidity, feelsLike, temp, description, main, icon, pressure };
        weatherParameters.timeSunrise = new Date((responseResult.sys.sunrise + timezone) * 1000);
        weatherParameters.timeSunset = new Date((responseResult.sys.sunset + timezone) * 1000);
        weatherParameters.localTime = new Date(((weatherParameters.date + weatherParameters.timezone) * 1000));
        console.log(responseResult);
        localTime(weatherParameters.localTime)
        changeBackground();
        showWeather();

    }
    catch {
        document.querySelector('.weather__city-name').textContent = 'Город не найден'
    }
}

//change background
function changeBackground() {
    if (weatherParameters.localTime.getUTCHours() >= 21 || weatherParameters.localTime.getUTCHours() < weatherParameters.timeSunrise.getUTCHours()) backGroundVideo.src = 'video/cloud-night.mp4';
    else {
        switch (weatherParameters.main) {
            case 'Rain': backGroundVideo.src = 'video/rain.mp4';
                break;
            case 'Clouds':
                backGroundVideo.src = 'video/clouds.mp4';
                break;
            case 'Snow':
                backGroundVideo.src = 'video/snow.mp4';
                break;
        }
    }

}

function showWeather() {
    document.querySelector('.weather__city-name').textContent = weatherParameters.name;
    document.querySelector('.weather__clouds').textContent = weatherParameters.description;
    document.querySelector('.weather__feels-humidity').textContent = weatherParameters.humidity;
    document.querySelector('.weather__feels-pressure').textContent = weatherParameters.pressure;
    document.querySelector('.weather__deg').innerHTML = Math.round(weatherParameters.temp) + '°';
    document.querySelector('.weather__feels-like').textContent = Math.round(weatherParameters.feelsLike);
    changeIcon();
    document.querySelector('.weather__time-sunrise__time').textContent =
        `${weatherParameters.timeSunrise.getUTCHours()}:${weatherParameters.timeSunrise.getMinutes() < 10 ?
            '0' + weatherParameters.timeSunrise.getMinutes() : weatherParameters.timeSunrise.getMinutes()}`;

    document.querySelector('.weather__time-sunset__time').textContent =
        `${weatherParameters.timeSunset.getUTCHours()}:${weatherParameters.timeSunset.getMinutes() < 10 ?
            '0' + weatherParameters.timeSunset.getMinutes() : weatherParameters.timeSunset.getMinutes()}`;
}

//change icon for weather
function changeIcon() {
    const showIcon = document.querySelector('.weather__icon');
    switch (weatherParameters.icon) {
        case '01n': showIcon.setAttribute('xlink:href', '#nigtCleare');
            break;
        case '02n': showIcon.setAttribute('xlink:href', '#nightMinClouds');
            break;
        case '04d': showIcon.setAttribute('xlink:href', '#bigCloudRain');
            break;
        case '04n': showIcon.setAttribute('xlink:href', '#bigCloudRain');
            break;
        case '03d': showIcon.setAttribute('xlink:href', '#dayMinClouds');
            break;
        case '02d': showIcon.setAttribute('xlink:href', '#cloudy');
            break;
        case '03n':
            showIcon.setAttribute('xlink:href', '#nightMinClouds');
            break;
        case '10d': showIcon.setAttribute('xlink:href', '#rainCloud');
            break;
        case '10n': showIcon.setAttribute('xlink:href', '#rainCloud');
            break;
        default: showIcon.setAttribute('xlink:href', '#sunCleare');
    }
}

//searchGeolocation
function geolocal(event) {
    event.preventDefault();
    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

    const succes = async (pos) => {
        const cordinations = pos.coords;
        const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lang=ru&lat=${cordinations.latitude}&lon=${cordinations.longitude}&apiKey=b1e398271cc94f168325b54fbf5f0c0c`);
        const result = await response.json();
        getResponse(result.features[0].properties.city);
    }

    const error = (error) => console.log(error.code)
    navigator.geolocation.getCurrentPosition(succes, error, options)
}

//swiper slider for bottom content
const slider = new Swiper('.swiper', {
    autoplay: {
        delay: 5000,
    },
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
    },
    breakpoints: {
        446: {
            slidesPerView: 2,
            spaceBetween: 10,

        },
        680: {
            slidesPerView: 3,
            spaceBetween: 10,

        }
    }
});





