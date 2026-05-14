document.addEventListener('DOMContentLoaded', () => {
    let historyData = JSON.parse(localStorage.getItem('cropmind_history')) || [];
    
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const sortSelect = document.getElementById('sort-select');
    const historyAccordion = document.getElementById('history-accordion');
    const historyEmpty = document.getElementById('history-empty');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Populate filter dropdown
    function populateFilters() {
        const uniqueCrops = [...new Set(historyData.map(item => item.crop))].sort();
        filterSelect.innerHTML = '<option value="">All Crops</option>';
        uniqueCrops.forEach(crop => {
            const opt = document.createElement('option');
            opt.value = crop;
            opt.textContent = crop.charAt(0).toUpperCase() + crop.slice(1);
            filterSelect.appendChild(opt);
        });
    }

    // Render list
    function renderHistory() {
        let filtered = [...historyData];
        
        // Filter by text
        const query = searchInput.value.toLowerCase();
        if (query) {
            filtered = filtered.filter(item => item.crop.toLowerCase().includes(query));
        }
        
        // Filter by crop type
        const cropFilter = filterSelect.value;
        if (cropFilter) {
            filtered = filtered.filter(item => item.crop === cropFilter);
        }
        
        // Sort
        const sortVal = sortSelect.value;
        filtered.sort((a, b) => {
            if (sortVal === 'date-desc') return b.timestamp - a.timestamp;
            if (sortVal === 'date-asc') return a.timestamp - b.timestamp;
            if (sortVal === 'conf-desc') return b.confidence - a.confidence;
            if (sortVal === 'conf-asc') return a.confidence - b.confidence;
            return 0;
        });
        
        // Update UI
        historyAccordion.innerHTML = '';
        if (filtered.length === 0) {
            historyAccordion.classList.add('d-none');
            historyEmpty.classList.remove('d-none');
        } else {
            historyAccordion.classList.remove('d-none');
            historyEmpty.classList.add('d-none');
            
            filtered.forEach((item, index) => {
                const dateObj = new Date(item.timestamp);
                const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const confFormatted = parseFloat(item.confidence).toFixed(1) + '%';
                const id = `collapse-${index}`;
                
                const itemHtml = `
                    <div class="accordion-item border-0 border-bottom">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed py-3" type="button" data-bs-toggle="collapse" data-bs-target="#${id}">
                                <div class="d-flex align-items-center w-100 me-3">
                                    <div class="fs-4 me-3">${item.emoji}</div>
                                    <div class="flex-grow-1">
                                        <h6 class="fw-bold mb-0 text-capitalize text-primary-green">${item.crop}</h6>
                                        <small class="text-muted">${dateStr}</small>
                                    </div>
                                    <div class="text-end">
                                        <span class="badge bg-primary-green rounded-pill px-3 py-2 shadow-sm">${confFormatted}</span>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#history-accordion">
                            <div class="accordion-body bg-light border-top">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <h6 class="fw-bold poppins-font small border-bottom pb-2 mb-2">Soil Data</h6>
                                        <ul class="list-unstyled small mb-0 text-muted">
                                            <li><strong>N:</strong> ${item.N} mg/kg</li>
                                            <li><strong>P:</strong> ${item.P} mg/kg</li>
                                            <li><strong>K:</strong> ${item.K} mg/kg</li>
                                            <li><strong>pH:</strong> ${item.ph}</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="fw-bold poppins-font small border-bottom pb-2 mb-2">Climate Data</h6>
                                        <ul class="list-unstyled small mb-0 text-muted">
                                            <li><strong>Temp:</strong> ${item.temperature} °C</li>
                                            <li><strong>Humidity:</strong> ${item.humidity} %</li>
                                            <li><strong>Rainfall:</strong> ${item.rainfall} mm</li>
                                        </ul>
                                    </div>
                                    <div class="col-12 mt-3">
                                        <button class="btn btn-sm btn-outline-primary-green w-100 delete-item-btn" data-ts="${item.timestamp}">Delete Record</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                historyAccordion.insertAdjacentHTML('beforeend', itemHtml);
            });
            
            // Attach delete listeners
            document.querySelectorAll('.delete-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const ts = parseInt(e.target.getAttribute('data-ts'));
                    historyData = historyData.filter(i => i.timestamp !== ts);
                    localStorage.setItem('cropmind_history', JSON.stringify(historyData));
                    populateFilters();
                    renderHistory();
                });
            });
        }
    }

    // Event Listeners
    searchInput.addEventListener('input', renderHistory);
    filterSelect.addEventListener('change', renderHistory);
    sortSelect.addEventListener('change', renderHistory);

    exportCsvBtn.addEventListener('click', () => {
        if (historyData.length === 0) return;
        
        const headers = ['Timestamp', 'Date', 'Crop', 'Confidence', 'N', 'P', 'K', 'Temperature', 'Humidity', 'pH', 'Rainfall'];
        const csvRows = [headers.join(',')];
        
        historyData.forEach(item => {
            const dateStr = new Date(item.timestamp).toLocaleString().replace(/,/g, '');
            const row = [
                item.timestamp,
                `"${dateStr}"`,
                item.crop,
                item.confidence,
                item.N, item.P, item.K,
                item.temperature, item.humidity, item.ph, item.rainfall
            ];
            csvRows.push(row.join(','));
        });
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cropmind-history-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete all prediction history? This cannot be undone.")) {
            historyData = [];
            localStorage.removeItem('cropmind_history');
            populateFilters();
            renderHistory();
        }
    });

    // Init
    populateFilters();
    renderHistory();
});
