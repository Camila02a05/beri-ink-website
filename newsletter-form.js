// Newsletter Form Handler - Google Sheets
// All subscriber data goes directly to your Google Sheet
// Follow the setup instructions in NEWSLETTER_SETUP.md

// ============================================
// SETUP: Replace with your Google Script URL
// ============================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9eMJHvS8ss_s8gI-0OJZYCF7cm6IgCMpyfo0h1CIzpQkURcrIiSGJJ1X8sIrAoX5iCw/exec';

document.addEventListener('DOMContentLoaded', function() {
    // Find all newsletter forms on the page
    const forms = document.querySelectorAll('.newsletter-form, form[name="newsletter"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = form.querySelector('input[type="text"], input[name="name"]');
            const emailInput = form.querySelector('input[type="email"], input[name="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            
            if (!nameInput || !emailInput) {
                console.error('Form inputs not found');
                return;
            }
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            
            // Validate
            if (!name || !email) {
                alert('Please fill in both name and email.');
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Disable submit button
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            try {
                // Submit to Google Sheets
                if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
                    await submitToGoogleSheets(name, email);
                } else {
                    console.error('Google Script URL not configured. Please set GOOGLE_SCRIPT_URL in newsletter-form.js');
                    alert('Form is not configured yet. Please contact the website administrator.');
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                    return;
                }
                
                // Show success message
                submitButton.textContent = 'Subscribed! ✓';
                submitButton.style.background = '#4caf50';
                
                // Reset form
                nameInput.value = '';
                emailInput.value = '';
                
                // Show thank you message
                showThankYouMessage(form);
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                    submitButton.style.background = '';
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error. Please try again later or email us directly at beri.tattoo@gmail.com');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    });
});

// Submit to Google Sheets
async function submitToGoogleSheets(name, email) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            timestamp: new Date().toISOString()
        })
    });
    
    // Note: no-cors mode doesn't return response, so we assume success
    return { success: true };
}

function showThankYouMessage(form) {
    // Create or show thank you message
    let messageDiv = form.querySelector('.thank-you-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'thank-you-message';
        messageDiv.style.cssText = 'margin-top: 1rem; padding: 0.75rem; background: #d4edda; color: #155724; border-radius: 4px; text-align: center; font-size: 0.9rem;';
        form.appendChild(messageDiv);
    }
    messageDiv.textContent = 'Thank you for subscribing!';
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

