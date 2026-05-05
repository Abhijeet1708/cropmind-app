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

    // Prediction Form Submit (Mock for now, will be implemented in commit 8)
    const form = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('predict-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner-border');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Analyzing...';
        spinner.classList.remove('d-none');

        // Simulate API call delay for now
        setTimeout(() => {
            submitBtn.disabled = false;
            btnText.textContent = 'Predict Crop';
            spinner.classList.add('d-none');
        }, 1000);
    });
});
