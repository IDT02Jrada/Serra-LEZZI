function fetchData() {
  fetch('/get_data')
    .then(response => response.json())
    .then(data => {
      const tempElement = document.getElementById('internal-temperature');
      if (tempElement) {
        tempElement.innerText = data.temp || 'N/A';
      }

      const humidityElement = document.getElementById('internal-humidity');
      if (humidityElement) {
        humidityElement.innerText = data.umid_aria || 'N/A';
      }

      const soilHumidity1Element = document.getElementById('soil-humidity1');
      if (soilHumidity1Element) {
        soilHumidity1Element.innerText = data.umid_terr1 ? `${data.umid_terr1}%` : 'N/A';
      }

      const soilHumidity2Element = document.getElementById('soil-humidity2');
      if (soilHumidity2Element) {
        soilHumidity2Element.innerText = data.umid_terr2 ? `${data.umid_terr2}%` : 'N/A';
      }

      const soilHumidity3Element = document.getElementById('soil-humidity3');
      if (soilHumidity3Element) {
        soilHumidity3Element.innerText = data.umid_terr3 ? `${data.umid_terr3}%` : 'N/A';
      }

      const tankStatusElement = document.getElementById('tank-status');
      if (tankStatusElement) {
        if (data.liv_acqua < 150) {
          tankStatusElement.innerHTML = "<i class='bx bxs-battery-full bx-rotate-90' style='color:#ff0000; font-size: 96px; margin-right: 140px;'></i>";
        } else {
          tankStatusElement.innerHTML = "<i class='bx bxs-battery-full bx-rotate-90' style='color:#38ff00; font-size: 96px; margin-right: 140px;'></i>";
        }
      }

      const tankyStatusElement = document.getElementById('tanky-status');
      if (tankyStatusElement) {
        if (data.liv_acqua < 150) {
          tankyStatusElement.innerHTML = "<i class='bx bxs-battery-full bx-rotate-90' style='color:#ff0000; font-size: 30px; margin-left: 0px;'></i>";
        } else {
          tankyStatusElement.innerHTML = "<i class='bx bxs-battery-full bx-rotate-90' style='color:#38ff00; font-size: 30px; margin-left: 0px;'></i>";
        }
      }

      const lightingElement = document.getElementById('internal-lighting');
      if (lightingElement) {
        if (data.liv_lum < 270) {
          lightingElement.innerText = 'OFF';
        } else {
          lightingElement.innerText = 'ON';
        }
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

setInterval(fetchData, 1000);
window.onload = fetchData;
