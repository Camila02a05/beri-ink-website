// Newsletter Form Handler - Google Sheets
// All subscriber data goes directly to your Google Sheet
// Follow the setup instructions in NEWSLETTER_SETUP.md

// ============================================
// SETUP: Replace with your Google Script URL
// ============================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9eMJHvS8ss_s8gI-0OJZYCF7cm6IgCMpyfo0h1CIzpQkURcrIiSGJJ1X8sIrAoX5iCw/exec';

function initNewsletterForms() {
    console.log('Newsletter form handler loading...');
    // Find all newsletter forms on the page
    const forms = document.querySelectorAll('.newsletter-form, form[name="newsletter"]');
    console.log('Found forms:', forms.length);
    
    if (forms.length === 0) {
        console.warn('No newsletter forms found on this page');
        return;
    }
    
    forms.forEach((form, index) => {
        console.log(`Setting up form ${index + 1}`);
        
        // Check if listener already attached
        if (form.dataset.listenerAttached === 'true') {
            console.log('Listener already attached, skipping');
            return;
        }
        form.dataset.listenerAttached = 'true';
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Form submitted!');
            
            // Get form inputs
            const nameInput = form.querySelector('input[type="text"], input[name="name"]');
            const emailInput = form.querySelector('input[type="email"], input[name="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            
            console.log('Inputs found:', { nameInput: !!nameInput, emailInput: !!emailInput, submitButton: !!submitButton });
            
            if (!nameInput || !emailInput) {
                console.error('Form inputs not found');
                alert('Form error: Could not find form fields. Please refresh the page.');
                return;
            }
            
            if (!submitButton) {
                console.error('Submit button not found');
                alert('Form error: Could not find submit button. Please refresh the page.');
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletterForms);
} else {
    // DOM is already loaded
    initNewsletterForms();
}

// Submit to Google Sheets
async function submitToGoogleSheets(name, email) {
    const data = {
        name: name,
        email: email,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Try with CORS to see if it works
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Submission successful:', result);
            return result;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('CORS submission failed, trying no-cors:', error);
        
        // Fallback: Use no-cors (required for some Google Apps Script deployments)
        // Note: We can't see the response with no-cors, but it usually works
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // With no-cors, assume success (data should still be saved)
            console.log('Form submitted (no-cors mode)');
            return { success: true };
        } catch (fallbackError) {
            console.error('Both submission methods failed:', fallbackError);
            throw new Error('Failed to submit. Please check your Google Script URL and try again.');
        }
    }
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

