document.addEventListener('DOMContentLoaded', () => {
    const buttonConcettuale = document.getElementById('buttonConcettuale');
    const buttonFisico = document.getElementById('button-fisico');
    const buttonCodice = document.getElementById('button-codice');

    const attesaSelezione = document.getElementById('attesaSelezione');
    const interfacciaConcettuale = document.getElementById('interfacciaConcettuale');
    const interfacciaFisica = document.getElementById('interfacciaFisica');
    const interfacciaCodice = document.getElementById('interfacciaCodice');

    let currentVisible = 'attesaSelezione';

    function showContent(contentId) {
        if (currentVisible === contentId) {
            attesaSelezione.style.display = 'flex';
            interfacciaConcettuale.style.display = 'none';
            interfacciaFisica.style.display = 'none';
            interfacciaCodice.style.display = 'none';
            currentVisible = 'attesaSelezione';
        } else {
            attesaSelezione.style.display = 'none';
            interfacciaConcettuale.style.display = 'none';
            interfacciaFisica.style.display = 'none';
            interfacciaCodice.style.display = 'none';

            document.getElementById(contentId).style.display = 'flex';
            currentVisible = contentId;
        }
    }

    buttonConcettuale.addEventListener('click', () => showContent('interfacciaConcettuale'));
    buttonFisico.addEventListener('click', () => showContent('interfacciaFisica'));
    buttonCodice.addEventListener('click', () => showContent('interfacciaCodice'));
});

document.addEventListener('DOMContentLoaded', () => {
    const schedina = document.getElementById('schedina');

    document.querySelectorAll('area').forEach(area => {
        area.addEventListener('mouseover', (event) => {
            const name = area.dataset.name; 
            const role = area.dataset.role;

            schedina.innerHTML = `<strong>${name}</strong><br>${role}`;
            schedina.style.display = 'block';

            const offsetX = 20;
            const offsetY = 20;
            schedina.style.left = `${event.pageX + offsetX}px`;
            schedina.style.top = `${event.pageY + offsetY}px`;
        });

        area.addEventListener('mouseout', () => {
            schedina.style.display = 'none';
        });
    });
});
