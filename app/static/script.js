document.getElementById('qr_type').addEventListener('change', function() {
    const type = this.value;
    const dynamicFields = document.getElementById('dynamic-fields');
    dynamicFields.innerHTML = '';

    switch(type) {
        case 'text':
            dynamicFields.innerHTML = `
                <label for="content">Text/URL:</label>
                <input type="text" id="content" name="content" required>
            `;
            break;
        case 'epc':
            dynamicFields.innerHTML = `
                <label for="iban">IBAN:</label>
                <input type="text" id="iban" name="iban" required>
                <label for="beneficiary">Beneficiary:</label>
                <input type="text" id="beneficiary" name="beneficiary" required>
                <label for="amount">Amount (EUR):</label>
                <input type="number" step="0.01" id="amount" name="amount">
                <label for="reference">Reference:</label>
                <input type="text" id="reference" name="reference">
            `;
            break;
        case 'email':
            dynamicFields.innerHTML = `
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject">
                <label for="body">Body:</label>
                <textarea id="body" name="body"></textarea>
            `;
            break;
        case 'sms':
            dynamicFields.innerHTML = `
                <label for="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" required>
                <label for="message">Message:</label>
                <textarea id="message" name="message"></textarea>
            `;
            break;
        case 'wifi':
            dynamicFields.innerHTML = `
                <label for="ssid">SSID (Network Name):</label>
                <input type="text" id="ssid" name="ssid" required>
                <label for="password">Password:</label>
                <input type="text" id="password" name="password" required>
                <label for="security">Security Type:</label>
                <select id="security" name="security">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                </select>
            `;
            break;
    }
});

// Handle form submission via JavaScript for better UX
document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const response = await fetch('/generate', {
        method: 'POST',
        body: formData
    });
    
    if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        document.getElementById('qr-image').src = imageUrl;
        document.getElementById('download-link').href = imageUrl;
        document.getElementById('result').classList.remove('hidden');
    } else {
        alert('Error generating QR code');
    }
});