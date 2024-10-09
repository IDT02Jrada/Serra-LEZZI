document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '2bed12e67da46aae4ddbe0420d78215b'; 
    const city = 'Cremona';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const location = data.name;
            const temperature = data.main.temp;
            const tempMax = data.main.temp_max;
            const tempMin = data.main.temp_min;
            const humidity = data.main.humidity;

            document.getElementById('location').textContent = location;
            document.getElementById('temperature').textContent = temperature;
            document.getElementById('temp-max').textContent = tempMax;
            document.getElementById('temp-min').textContent = tempMin;
            document.getElementById('humidity').textContent = humidity;
        })
        .catch(error => console.error('Errore:', error));
});
