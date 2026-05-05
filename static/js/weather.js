document.addEventListener('DOMContentLoaded', () => {
    const fetchWeatherBtn = document.getElementById('fetch-weather-btn');
    const cityInput = document.getElementById('city-input');
    const alertContainer = document.getElementById('weather-alert-container');
    
    const inputTemp = document.getElementById('input-temp');
    const inputHumidity = document.getElementById('input-humidity');
    const inputRainfall = document.getElementById('input-rainfall');

    if (!fetchWeatherBtn) return;

    fetchWeatherBtn.addEventListener('click', async () => {
        const city = cityInput.value.trim();
        if (!city) return;

        // Loading state
        const originalText = fetchWeatherBtn.textContent;
        fetchWeatherBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        fetchWeatherBtn.disabled = true;
        alertContainer.innerHTML = '';

        try {
            const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch weather data');
            }

            // Fill inputs
            inputTemp.value = data.temperature;
            inputHumidity.value = data.humidity;
            inputRainfall.value = data.rainfall;

            // Highlight animation
            [inputTemp, inputHumidity, inputRainfall].forEach(input => {
                input.style.transition = 'background-color 0.6s ease';
                input.style.backgroundColor = 'rgba(27, 67, 50, 0.1)'; // Soft primary green tint
                setTimeout(() => {
                    input.style.backgroundColor = '';
                }, 600);
            });

            // Success alert
            alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show small py-2 mb-0" role="alert">
                    <strong>Success!</strong> Filled climate data for ${data.city}.
                    <button type="button" class="btn-close" style="padding: 0.75rem;" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        } catch (error) {
            // Error alert
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show small py-2 mb-0" role="alert">
                    <strong>Error:</strong> ${error.message}
                    <button type="button" class="btn-close" style="padding: 0.75rem;" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        } finally {
            fetchWeatherBtn.innerHTML = originalText;
            fetchWeatherBtn.disabled = false;
        }
    });
});
