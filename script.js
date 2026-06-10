
async function getWeather() {

    const city = document.getElementById("city").value;

    if (!city) {
        alert("Enter city name");
        return;
    }

    try {

        const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`;

        const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKEY}`;

        const weatherRes = await fetch(weatherURL);
        const weatherData = await weatherRes.json();

        if (weatherData.cod != 200) {
            alert("City not found");
            return;
        }

        const forecastRes = await fetch(forecastURL);
        const forecastData = await forecastRes.json();

        displayWeather(weatherData);
        displayForecast(forecastData);

    } catch (error) {
        console.log(error);
    }
}

function displayWeather(data) {

    document.getElementById("mainCard").innerHTML = `

        <h2 class="text-4xl font-bold">${data.name}</h2>

        <div class="flex justify-between items-center mt-6">

            <div>

                <h1 class="text-6xl font-bold">
                    ${Math.round(data.main.temp)}°C
                </h1>

                <p class="mt-3 text-lg capitalize">
                    ${data.weather[0].description}
                </p>

                <p class="text-blue-400 mt-2">
                    Feels Like ${Math.round(data.main.feels_like)}°C
                </p>

            </div>

            <img
                class="w-28"
                src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
            >

        </div>
    `;

    document.getElementById("humidity").innerHTML =
    `${data.main.humidity}%`;

    document.getElementById("wind").innerHTML =
    `${data.wind.speed} m/s`;

    document.getElementById("pressure").innerHTML =
    `${data.main.pressure}`;

    document.getElementById("visibility").innerHTML =
    `${data.visibility / 1000} km`;

    document.getElementById("sunrise").innerHTML =
    new Date(data.sys.sunrise * 1000)
    .toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

    document.getElementById("sunset").innerHTML =
    new Date(data.sys.sunset * 1000)
    .toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

    document.getElementById("maxTemp").innerHTML =
    `${Math.round(data.main.temp_max)}°C`;

    document.getElementById("minTemp").innerHTML =
    `${Math.round(data.main.temp_min)}°C`;
}
async function getCurrentLocationWeather() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                const weatherURL =
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKEY}`;

                const forecastURL =
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKEY}`;

                const weatherRes = await fetch(weatherURL);
                const weatherData = await weatherRes.json();

                const forecastRes = await fetch(forecastURL);
                const forecastData = await forecastRes.json();

                displayWeather(weatherData);
                displayForecast(forecastData);

            } catch (error) {
                console.log(error);
            }
        },
        () => {
            console.log("Location permission denied");
        }
    );
}

function displayForecast(data) {

    const hourly = document.getElementById("hourlyForecast");
    hourly.innerHTML = "";

    data.list.slice(0, 8).forEach(item => {

        hourly.innerHTML += `
            <div class="bg-slate-900 text-white min-w-[140px] rounded-2xl p-5 text-center">
            <p>
                ${item.dt_txt.split(" ")[1].slice(0,5)}
            </p>

            <img
                class="mx-auto w-16"
                src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
            >

            <h3 class="text-xl font-bold">
                ${Math.round(item.main.temp)}°C
            </h3>

            <p class="text-slate-400">
                ${item.weather[0].main}
            </p>

        </div>
        `;
    });

    const forecast = document.getElementById("forecast");
    forecast.innerHTML = "";

    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    daily.slice(0,5).forEach(item => {

        forecast.innerHTML += `
        <div class="bg-slate-900 text-white rounded-2xl p-5 text-center">

            <h3 class="font-bold text-xl">
                ${new Date(item.dt_txt).toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                )}
            </h3>

            <img
                class="mx-auto w-20"
                src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
            >

            <h2 class="text-3xl font-bold">
                ${Math.round(item.main.temp)}°C
            </h2>

            <p class="text-slate-400">
                ${item.weather[0].main}
            </p>

        </div>
        `;
    });
}

document.getElementById("city")
.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

window.onload = () => {

    const savedTheme = localStorage.getItem("theme");

    const body = document.getElementById("body");
    const title = document.getElementById("dashboardTitle");
    const subtitle = document.getElementById("subtitle");
    const cityInput = document.getElementById("city");

    if (savedTheme === "light") {

        body.classList.replace("bg-slate-950", "bg-slate-100");
        body.classList.replace("text-white", "text-black");

        title.classList.remove("text-white");
        title.classList.add("text-black");

        subtitle.classList.remove("text-slate-400");
        subtitle.classList.add("text-slate-600");

        cityInput.classList.remove("bg-slate-900");
        cityInput.classList.add("bg-slate-100");
    }

    getCurrentLocationWeather();
};

function toggleTheme() {

    const body = document.getElementById("body");
    const title = document.getElementById("dashboardTitle");
    const subtitle = document.getElementById("subtitle");
    const cityInput = document.getElementById("city");

    if (body.classList.contains("bg-slate-950")) {

        // Light Theme
        body.classList.replace("bg-slate-950", "bg-slate-100");
        body.classList.replace("text-white", "text-black");

        title.classList.remove("text-white");
        title.classList.add("text-black");

        subtitle.classList.remove("text-slate-400");
        subtitle.classList.add("text-slate-600");

        cityInput.classList.remove("bg-slate-900");
        cityInput.classList.add("bg-slate-100");

        localStorage.setItem("theme", "light");

    } else {

        // Dark Theme
        body.classList.replace("bg-slate-100", "bg-slate-950");
        body.classList.replace("text-black", "text-white");

        title.classList.remove("text-black");
        title.classList.add("text-white");

        subtitle.classList.remove("text-slate-600");
        subtitle.classList.add("text-slate-400");

        cityInput.classList.remove("bg-slate-100");
        cityInput.classList.add("bg-slate-900");

        localStorage.setItem("theme", "dark");
    }
}