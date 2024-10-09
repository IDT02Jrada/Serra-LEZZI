document.addEventListener('DOMContentLoaded', function () {
    const showGraphButton = document.getElementById('showGraphButton');
    const tableContainer = document.querySelector('.table-container');
    const chartContainer = document.getElementById('chart');

    let storicoData = [];
    let isGraphVisible = false;

    // Nascondi inizialmente il contenitore del grafico
    chartContainer.style.display = 'none';

    fetch('/get_storico_data')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';

        if (data.error) {
            console.error(data.error);
            return;
        }

        // Ordina i dati per data in ordine decrescente
        data.sort((a, b) => new Date(b.id) - new Date(a.id));

        let temperatureData = [];
        let humidityData = [];
        let umidTerrBasilicoData = [];
        let umidTerrPrezzemoloData = [];
        let umidTerrMentaData = [];
        let illuminazioneData = [];
        let livelloSerbatoioData = [];
        let dateLabels = [];

        // Filtra i dati ogni 3 minuti (180 secondi)
        const filteredData = data.filter((row, index) => index % 3 === 0); // Ogni terzo valore

        filteredData.forEach(row => {
            const formattedDate = new Date(row.id).toLocaleString('it-IT', { hour12: false }).replace(',', '');

            temperatureData.push(row.temp);
            humidityData.push(row.umid_aria);
            umidTerrBasilicoData.push(row.umid_terr1);
            umidTerrPrezzemoloData.push(row.umid_terr2);
            umidTerrMentaData.push(row.umid_terr3);
            
            const illuminazione = row.liv_lum < 270 ? 'OFF' : 'ON'; // Determina ON/OFF
            const livelloSerbatoio = row.liv_acqua < 50 ? 'VUOTO' : 'PIENO'; // Determina VUOTO/PIENO
            
            dateLabels.push(formattedDate);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formattedDate.trim()}</td>
                <td>${row.temp}</td>
                <td>${row.umid_aria}</td>
                <td>${row.umid_terr1}</td>
                <td>${row.umid_terr2}</td>
                <td>${row.umid_terr3}</td>
                <td style="color: ${illuminazione === 'ON' ? 'orange' : 'gray'};">${illuminazione}</td>
                <td style="color: ${livelloSerbatoio === 'PIENO' ? 'blue' : 'red'};">${livelloSerbatoio}</td>
            `;
            tableBody.appendChild(tr);
        });

        storicoData = {
            dateLabels,
            temperatureData,
            humidityData,
            umidTerrBasilicoData,
            umidTerrPrezzemoloData,
            umidTerrMentaData,
            illuminazioneData,
            livelloSerbatoioData
        };
    })
    .catch(error => console.error('Errore nel recupero dei dati:', error));

    function createPlotlyGraphs(data) {
        // Creare una lista di valori di tick (ogni 3 minuti)
        const xTickValues = [];
        const xTickLabels = [];
    
        // Aggiungere ogni terzo valore
        for (let i = 0; i < data.dateLabels.length; i++) {
            if (i % 3 === 0) { // Ogni 3 minuti
                xTickValues.push(i); // Indice dell'etichetta
                xTickLabels.push(data.dateLabels[i]); // Valore dell'etichetta
            }
        }
    
        // Temperatura
        const tempData = [{
            x: data.dateLabels,
            y: data.temperatureData,
            type: 'scatter',
            mode: 'lines',
            name: 'Temperatura (°C)',
            line: { color: 'red' }
        }];
        const tempLayout = {
            title: 'Temperatura',
            xaxis: {
                title: '',
                tickvals: xTickValues,
                ticktext: xTickLabels,
                tickangle: -45
            },
            yaxis: { title: 'Temperatura (°C)' },
            margin: { t: 50, b: 100 }
        };
        Plotly.newPlot('tempChart', tempData, tempLayout);
    
        // Illuminazione (ON/OFF)
        const illuminazioneData = [{
            x: data.dateLabels,
            y: data.illuminazioneData.map(value => value === 'ON' ? 1 : 0), // 1 per ON, 0 per OFF
            type: 'bar',
            name: 'Illuminazione',
            marker: { color: 'yellow' }
        }];
        const illuminazioneLayout = {
            title: 'Illuminazione',
            xaxis: {
                title: '',
                tickvals: xTickValues,
                ticktext: xTickLabels,
                tickangle: -45
            },
            yaxis: { title: 'Stato (ON/OFF)', tickvals: [0, 1], ticktext: ['OFF', 'ON'] },
            margin: { t: 50, b: 100 }
        };
        Plotly.newPlot('illuminazioneChart', illuminazioneData, illuminazioneLayout);
    
        // Livello del Serbatoio (PIENO/VUOTO)
        const livelloData = [{
            x: data.dateLabels,
            y: data.livelloSerbatoioData.map(value => value === 'PIENO' ? 1 : 0), // 1 per PIENO, 0 per VUOTO
            type: 'bar',
            name: 'Livello Serbatoio',
            marker: { color: 'blue' }
        }];
        const livelloLayout = {
            title: 'Livello del Serbatoio',
            xaxis: {
                title: '',
                tickvals: xTickValues,
                ticktext: xTickLabels,
                tickangle: -45
            },
            yaxis: { title: 'Livello (PIENO/VUOTO)', tickvals: [0, 1], ticktext: ['VUOTO', 'PIENO'] },
            margin: { t: 50, b: 100 }
        };
        Plotly.newPlot('livelloChart', livelloData, livelloLayout);
    
        // Grafico combinato per Umidità dell'Aria, Basilico, Prezzemolo e Menta
        const combinedHumidityData = [{
            x: data.dateLabels,
            y: data.humidityData,
            type: 'scatter',
            mode: 'lines',
            name: 'Umidità Aria (%)',
            line: { color: 'blue' }
        }, {
            x: data.dateLabels,
            y: data.umidTerrBasilicoData,
            type: 'scatter',
            mode: 'lines',
            name: 'Umid. Terr. Basilico (%)',
            line: { color: 'green' }
        }, {
            x: data.dateLabels,
            y: data.umidTerrPrezzemoloData,
            type: 'scatter',
            mode: 'lines',
            name: 'Umid. Terr. Prezzemolo (%)',
            line: { color: 'purple' }
        }, {
            x: data.dateLabels,
            y: data.umidTerrMentaData,
            type: 'scatter',
            mode: 'lines',
            name: 'Umid. Terr. Menta (%)',
            line: { color: 'orange' }
        }];
    
        const combinedHumidityLayout = {
            title: 'Umidità (Aria, Basilico, Prezzemolo, Menta)',
            xaxis: {
                title: '',
                tickvals: xTickValues,
                ticktext: xTickLabels,
                tickangle: -45
            },
            yaxis: { title: 'Umidità (%)' },
            margin: { t: 50, b: 100 }
        };
    
        Plotly.newPlot('combinedHumidityChart', combinedHumidityData, combinedHumidityLayout);
    }
    
    // Event listener per mostrare/nascondere il grafico (toggle)
    showGraphButton.addEventListener('click', function () {
        if (isGraphVisible) {
            chartContainer.style.display = 'none';
            tableContainer.style.display = 'block';
            showGraphButton.textContent = 'Visualizza Grafico';
        } else {
            tableContainer.style.display = 'none';
            chartContainer.style.display = 'grid'; // Cambia il display in grid per la griglia 2x2
            createPlotlyGraphs(storicoData); // Crea i grafici solo qui
            showGraphButton.textContent = 'Visualizza Tabella';
        }
        isGraphVisible = !isGraphVisible;
    });
});
