const searchCityInput = document.querySelector('.weather-form__search');
const searchCityButton = document.querySelector('.weather-form__btn-search');
const backGroundVideo = document.querySelector('.intro__video-bg');
const geloacationButton = document.querySelector('.weather-form__btn-geolacation');
const weatherParameters = {};


setInterval(() => {
    const dateTime = new Date();
    if (dateTime.getMinutes() < 10) {
        document.querySelector('.weather__city-minutes').innerHTML = '0' + dateTime.getMinutes();
    }
    else document.querySelector('.weather__city-minutes').innerHTML = dateTime.getMinutes();
    document.querySelector('.weather__city-hours').innerHTML = dateTime.getHours();

});


const getResponse = async (nameCity) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${nameCity}&lang=ru&appid=fecd0fb94f869b345e364c21d98455f9`);
        const responseResult = await response.json();
        weatherParameters.nameCity = responseResult.name;
        weatherParameters.weatherDescription = responseResult.weather[0].description;
        weatherParameters.humidity = responseResult.main.humidity;
        weatherParameters.temperature = Math.round(responseResult.main.temp);
        weatherParameters.feelsLike = Math.round(responseResult.main.feels_like);
        weatherParameters.clouds = responseResult.weather[0].description;
        weatherParameters.precipitation = responseResult.weather[0].main;
        weatherParameters.icon = `http://openweathermap.org/img/w/${responseResult.weather[0].icon}.png`;
        console.log(responseResult)
        showWeather();
        changeBackground();
    }
    catch {
        document.querySelector('.weather__city-name').textContent = 'Город не найден'
    }
}

function changeBackground() {
    switch (weatherParameters.precipitation) {
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

function showWeather() {
    document.querySelector('.weather__city-name').textContent = weatherParameters.nameCity;
    document.querySelector('.weather__clouds').textContent = weatherParameters.clouds;
    document.querySelector('.weather__feels-humidity').textContent = weatherParameters.humidity;
    document.querySelector('.weather__deg').textContent = weatherParameters.temperature;
    document.querySelector('.weather__feels-like').textContent = weatherParameters.feelsLike;
    document.querySelector('.weather__icon').src = weatherParameters.icon;
}

getResponse('Киев');
searchCityButton.addEventListener('click', (event) => {
    event.preventDefault();
    getResponse(searchCityInput.value);
    weatherParameters.nameCity = searchCityInput.value;
    searchCityInput.value = '';
    changeBackground();
});


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

geloacationButton.addEventListener('click', geolocal);

