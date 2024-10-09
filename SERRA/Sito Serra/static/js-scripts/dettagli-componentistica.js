document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-details');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sensorDetails = this.closest('tr').nextElementSibling;
            
            // Chiudi tutti i dettagli aperti tranne quello attualmente cliccato
            const allSensorDetails = document.querySelectorAll('.sensor-details');
            allSensorDetails.forEach(detail => {
                if (detail !== sensorDetails && detail.style.display !== 'none') {
                    detail.style.display = 'none';
                }
            });

            // Toggle dei dettagli del sensore cliccato
            if (sensorDetails.style.display === 'none' || sensorDetails.style.display === '') {
                sensorDetails.style.display = 'table-row';
            } else {
                sensorDetails.style.display = 'none';
            }
        });
    });
});
