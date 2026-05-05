document.addEventListener('DOMContentLoaded', () => {
    // Soil Type Lookup for Helper Text
    const soilLookup = {
        'Clay': { N: 'Typical range: 20-60 mg/kg', P: 'Typical range: 20-50 mg/kg', K: 'Typical range: 30-60 mg/kg' },
        'Loam': { N: 'Typical range: 40-80 mg/kg', P: 'Typical range: 30-70 mg/kg', K: 'Typical range: 20-50 mg/kg' },
        'Sandy': { N: 'Typical range: 10-40 mg/kg', P: 'Typical range: 10-40 mg/kg', K: 'Typical range: 10-30 mg/kg' },
        'Silt': { N: 'Typical range: 30-60 mg/kg', P: 'Typical range: 20-50 mg/kg', K: 'Typical range: 20-40 mg/kg' },
        'Silty Clay': { N: 'Typical range: 25-55 mg/kg', P: 'Typical range: 25-45 mg/kg', K: 'Typical range: 25-50 mg/kg' }
    };

    const soilRadios = document.querySelectorAll('input[name="soilType"]');
    const helperN = document.querySelector('.helper-N');
    const helperP = document.querySelector('.helper-P');
    const helperK = document.querySelector('.helper-K');

    soilRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const type = e.target.value;
            if (soilLookup[type]) {
                helperN.textContent = soilLookup[type].N;
                helperP.textContent = soilLookup[type].P;
                helperK.textContent = soilLookup[type].K;
            }
        });
    });

    // Prediction Form Submit
    const form = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('predict-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner-border');
    
    const emptyState = document.getElementById('result-empty-state');
    const resultPanel = document.getElementById('result-panel');
    const resultEmoji = document.getElementById('result-emoji');
    const resultCropName = document.getElementById('result-crop-name');
    const resultConfidenceText = document.getElementById('result-confidence-text');
    const resultConfidenceBar = document.getElementById('result-confidence-bar');
    const resultDescription = document.getElementById('result-description');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Analyzing...';
        spinner.classList.remove('d-none');

        // Collect data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to predict crop');
            }

            // Update UI
            resultEmoji.textContent = result.emoji;
            resultCropName.textContent = result.crop;
            
            const confFormatted = result.confidence.toFixed(1) + '%';
            resultConfidenceText.textContent = confFormatted;
            resultConfidenceBar.style.width = confFormatted;
            resultConfidenceBar.setAttribute('aria-valuenow', result.confidence);
            
            resultDescription.textContent = result.description;

            // Animate transition
            emptyState.classList.add('d-none');
            resultPanel.classList.remove('d-none');
            
            // Trigger reflow to ensure CSS transition works
            void resultPanel.offsetWidth;
            
            resultPanel.style.opacity = '1';
            resultPanel.style.transform = 'translateY(0)';
            
            // Store result in window for later commits (chart, pdf, share)
            window.lastPrediction = { ...data, ...result };
            
            // Render Chart
            renderChart(result.feature_importance);
            
            // Render Rotation
            if (result.rotation) {
                renderRotation(result.rotation);
            }
            
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Predict Crop';
            spinner.classList.add('d-none');
        }
    });

    let chartInstance = null;

    function renderChart(importances) {
        const ctx = document.getElementById('feature-importance-chart').getContext('2d');
        
        // Sort importances
        const entries = Object.entries(importances).sort((a, b) => b[1] - a[1]);
        const labels = entries.map(e => e[0].toUpperCase());
        const data = entries.map(e => (e[1] * 100).toFixed(2));

        // Generate colors from light green to dark green
        const colors = data.map((val, index) => {
            const alpha = 1 - (index * 0.1);
            return `rgba(27, 67, 50, ${Math.max(0.2, alpha)})`;
        });

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Importance (%)',
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1,
                    borderColor: '#1B4332'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true, max: 100 }
                }
            }
        });
    }

    function renderRotation(rotation) {
        const container = document.getElementById('rotation-container');
        container.innerHTML = `
            <h6 class="fw-bold poppins-font border-bottom pb-2 mb-4 mt-5">Recommended 3-Season Rotation Plan</h6>
            <div class="row g-3 mb-3 position-relative">
                <div class="d-none d-md-block position-absolute border-top border-2 border-dashed" style="top: 50%; width: 90%; left: 5%; z-index: 0; opacity: 0.2;"></div>
                
                <div class="col-md-4 position-relative z-1">
                    <div class="card h-100 border-0 shadow-sm" style="background-color: var(--primary-green); color: white;">
                        <div class="card-body text-center">
                            <div class="small text-white-50 text-uppercase tracking-wider mb-2 fw-bold">Now &bull; Season 1</div>
                            <div class="display-4 mb-2">${rotation.season1.emoji}</div>
                            <h5 class="fw-bold poppins-font">${rotation.season1.name}</h5>
                            <p class="small mb-0 opacity-75">${rotation.season1.soil_effect}</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 position-relative z-1">
                    <div class="card h-100 border-0 shadow-sm" style="background-color: var(--accent-amber); color: white;">
                        <div class="card-body text-center">
                            <div class="small text-white-50 text-uppercase tracking-wider mb-2 fw-bold">Next &bull; Season 2</div>
                            <div class="display-4 mb-2">${rotation.season2.emoji}</div>
                            <h5 class="fw-bold poppins-font">${rotation.season2.name}</h5>
                            <p class="small mb-0 opacity-75">${rotation.season2.soil_effect}</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 position-relative z-1">
                    <div class="card h-100 border-0 shadow-sm" style="background-color: var(--accent-blue); color: white;">
                        <div class="card-body text-center">
                            <div class="small text-white-50 text-uppercase tracking-wider mb-2 fw-bold">Following &bull; Season 3</div>
                            <div class="display-4 mb-2">${rotation.season3.emoji}</div>
                            <h5 class="fw-bold poppins-font">${rotation.season3.name}</h5>
                            <p class="small mb-0 opacity-75">${rotation.season3.soil_effect}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="alert alert-info border-0 shadow-sm small">
                <strong>Agronomic Rationale:</strong> ${rotation.rationale}
            </div>
        `;
    }
});
