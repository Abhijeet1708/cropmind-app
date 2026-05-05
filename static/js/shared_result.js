document.addEventListener('DOMContentLoaded', () => {
    const tokenEl = document.getElementById('share-token-data');
    if (!tokenEl) return;
    
    const token = tokenEl.getAttribute('data-token');
    const storageKey = `cropmind_share_${token}`;
    
    const loadingEl = document.getElementById('shared-result-loading');
    const errorEl = document.getElementById('shared-result-error');
    const panelEl = document.getElementById('shared-result-panel');
    
    // Simulate slight loading for effect
    setTimeout(() => {
        const dataStr = localStorage.getItem(storageKey);
        
        loadingEl.classList.add('d-none');
        
        if (!dataStr) {
            errorEl.classList.remove('d-none');
            return;
        }
        
        try {
            const pred = JSON.parse(dataStr);
            
            // Populate fields
            document.getElementById('result-emoji').textContent = pred.emoji;
            document.getElementById('result-crop-name').textContent = pred.crop;
            
            const confFormatted = parseFloat(pred.confidence).toFixed(1) + '%';
            document.getElementById('result-confidence-text').textContent = confFormatted;
            document.getElementById('result-confidence-bar').style.width = confFormatted;
            
            document.getElementById('result-description').textContent = pred.description;
            
            document.getElementById('val-N').textContent = `${pred.N} mg/kg`;
            document.getElementById('val-P').textContent = `${pred.P} mg/kg`;
            document.getElementById('val-K').textContent = `${pred.K} mg/kg`;
            document.getElementById('val-temp').textContent = `${parseFloat(pred.temperature).toFixed(1)} °C`;
            document.getElementById('val-hum').textContent = `${parseFloat(pred.humidity).toFixed(1)} %`;
            document.getElementById('val-ph').textContent = parseFloat(pred.ph).toFixed(2);
            document.getElementById('val-rain').textContent = `${parseFloat(pred.rainfall).toFixed(1)} mm`;
            
            // Render Chart
            if (pred.feature_importance) {
                renderChart(pred.feature_importance);
            }
            
            // Render Rotation
            if (pred.rotation) {
                renderRotation(pred.rotation);
            }
            
            panelEl.classList.remove('d-none');
            
        } catch (e) {
            console.error("Error parsing shared result", e);
            errorEl.classList.remove('d-none');
        }
    }, 500);

    function renderChart(importances) {
        const ctx = document.getElementById('feature-importance-chart').getContext('2d');
        const entries = Object.entries(importances).sort((a, b) => b[1] - a[1]);
        const labels = entries.map(e => e[0].toUpperCase());
        const data = entries.map(e => (e[1] * 100).toFixed(2));

        const colors = data.map((val, index) => {
            const alpha = 1 - (index * 0.1);
            return `rgba(27, 67, 50, ${Math.max(0.2, alpha)})`;
        });

        new Chart(ctx, {
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
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, max: 100 } }
            }
        });
    }

    function renderRotation(rotation) {
        const container = document.getElementById('rotation-container');
        container.innerHTML = `
            <h6 class="fw-bold poppins-font border-bottom pb-2 mb-4">Recommended 3-Season Rotation Plan</h6>
            <div class="row g-3 mb-3 position-relative">
                <div class="d-none d-md-block position-absolute border-top border-2 border-dashed" style="top: 50%; width: 90%; left: 5%; z-index: 0; opacity: 0.2;"></div>
                
                <div class="col-md-4 position-relative z-1">
                    <div class="card h-100 border-0 shadow-sm" style="background-color: var(--primary-green); color: white;">
                        <div class="card-body text-center">
                            <div class="small text-white-50 text-uppercase tracking-wider mb-2 fw-bold">Season 1</div>
                            <div class="display-5 mb-2">${rotation.season1.emoji}</div>
                            <h6 class="fw-bold poppins-font">${rotation.season1.name}</h6>
                            <p class="small mb-0 opacity-75" style="font-size: 0.8rem;">${rotation.season1.soil_effect}</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 position-relative z-1">
                    <div class="card h-100 border-0 shadow-sm" style="background-color: var(--accent-amber); color: white;">
                        <div class="card-body text-center">
                            <div class="small text-white-50 text-uppercase tracking-wider mb-2 fw-bold">Season 2</div>
                            <div class="display-5 mb-2">${rotation.season2.emoji}</div>
                            <h6 class="fw-bold poppins-font">${rotation.season2.name}</h6>
                            <p class="small mb-0 opacity-75" style="font-size: 0.8rem;">${rotation.season2.soil_effect}</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 position-relative z-1">
                    <div class="card h-100 border-0 shadow-sm" style="background-color: var(--accent-blue); color: white;">
                        <div class="card-body text-center">
                            <div class="small text-white-50 text-uppercase tracking-wider mb-2 fw-bold">Season 3</div>
                            <div class="display-5 mb-2">${rotation.season3.emoji}</div>
                            <h6 class="fw-bold poppins-font">${rotation.season3.name}</h6>
                            <p class="small mb-0 opacity-75" style="font-size: 0.8rem;">${rotation.season3.soil_effect}</p>
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
