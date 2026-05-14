document.addEventListener('DOMContentLoaded', () => {
    // Read JSON data
    let knowledgeData = {};
    try {
        const dataScript = document.getElementById('knowledge-data');
        if (dataScript) {
            knowledgeData = JSON.parse(dataScript.textContent);
        }
    } catch (e) {
        console.error("Failed to parse knowledge data", e);
    }

    const searchInput = document.getElementById('encyclopedia-search');
    const seasonSelect = document.getElementById('encyclopedia-season');
    const cropCards = document.querySelectorAll('.crop-card-wrapper');
    const emptyState = document.getElementById('encyclopedia-empty');

    function filterCrops() {
        const query = searchInput.value.toLowerCase();
        const season = seasonSelect.value;
        let visibleCount = 0;

        cropCards.forEach(card => {
            const name = card.getAttribute('data-name');
            const desc = card.getAttribute('data-desc');
            const cardSeason = card.getAttribute('data-season');

            const matchesQuery = name.includes(query) || desc.includes(query);
            const matchesSeason = !season || cardSeason === season;

            if (matchesQuery && matchesSeason) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            emptyState.classList.remove('d-none');
        } else {
            emptyState.classList.add('d-none');
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterCrops);
    if (seasonSelect) seasonSelect.addEventListener('change', filterCrops);

    // Modal logic
    const cropModalEl = document.getElementById('cropModal');
    let radarChart = null;

    if (cropModalEl) {
        const cropModal = new bootstrap.Modal(cropModalEl);

        document.querySelectorAll('.crop-card').forEach(card => {
            card.addEventListener('click', () => {
                const cropKey = card.getAttribute('data-crop');
                const info = knowledgeData[cropKey];
                if (!info) return;

                // Populate Modal Text
                document.getElementById('modal-emoji').textContent = info.emoji;
                document.getElementById('modal-title').textContent = cropKey;
                document.getElementById('modal-season').textContent = info.season;
                document.getElementById('modal-desc').textContent = info.description;

                document.getElementById('modal-n').textContent = `${info.ideal_n[0]} - ${info.ideal_n[1]} mg/kg`;
                document.getElementById('modal-p').textContent = `${info.ideal_p[0]} - ${info.ideal_p[1]} mg/kg`;
                document.getElementById('modal-k').textContent = `${info.ideal_k[0]} - ${info.ideal_k[1]} mg/kg`;
                document.getElementById('modal-ph').textContent = `${info.ideal_ph[0]} - ${info.ideal_ph[1]}`;

                // Averages for Radar Chart (normalize NPK roughly to 0-100 scale for visual comparison)
                // N: max ~150, P: max ~100, K: max ~100
                const avgN = (info.ideal_n[0] + info.ideal_n[1]) / 2;
                const avgP = (info.ideal_p[0] + info.ideal_p[1]) / 2;
                const avgK = (info.ideal_k[0] + info.ideal_k[1]) / 2;
                // Scale pH to look good on the same 0-100 chart (pH is 0-14, so multiply by ~7)
                const avgPH = ((info.ideal_ph[0] + info.ideal_ph[1]) / 2) * 7.14; 

                // Render Chart
                const ctx = document.getElementById('nutrient-radar-chart').getContext('2d');
                if (radarChart) {
                    radarChart.destroy();
                }

                radarChart = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'pH Level (Scaled)'],
                        datasets: [{
                            label: 'Optimal Level',
                            data: [avgN, avgP, avgK, avgPH],
                            backgroundColor: 'rgba(27, 67, 50, 0.2)',
                            borderColor: 'rgba(27, 67, 50, 1)',
                            pointBackgroundColor: 'rgba(217, 119, 6, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(217, 119, 6, 1)',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: { display: true },
                                suggestedMin: 0,
                                suggestedMax: 100
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });

                cropModal.show();
            });
        });
    }
});
