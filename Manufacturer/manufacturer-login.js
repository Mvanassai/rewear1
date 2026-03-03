// manufacturer-login.js
// Demo-only permanent login for manufacturer portal (frontend only)
// For academic/project demonstration purposes only - NOT SECURE for production!

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    
    // Hard-coded manufacturer credentials (demo only!)
    const VALID_EMAIL = "cmr125@gmail.com";
    const VALID_PASSWORD = "cmr@125";

    if (!form) {
        console.error("Login form not found!");
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Always prevent default form submission

        // Get input values
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const enteredEmail = emailInput.value.trim();
        const enteredPassword = passwordInput.value;

        // Simple validation - check if fields are filled
        if (!enteredEmail || !enteredPassword) {
            showError("Please fill in all fields");
            return;
        }

        // Check credentials
        if (enteredEmail === VALID_EMAIL && enteredPassword === VALID_PASSWORD) {
            // Success case
            showSuccess("Login successful");
            
            // Small delay for user to see success message, then redirect
            setTimeout(() => {
                // Change this URL to your actual dashboard page
                window.location.href = "manufacturer-dashboard.html";
            }, 1200);
        } else {
            // Failure case
            showError("Invalid manufacturer credentials");
            // Optional: shake effect or highlight fields
            passwordInput.focus();
        }
    });

    // ── Helper Functions ────────────────────────────────────────

    function showSuccess(message) {
        // Remove any previous messages
        removeMessages();

        const messageEl = document.createElement('div');
        messageEl.className = 'form-message success';
        messageEl.textContent = message;
        
        const form = document.getElementById('login-form');
        form.insertAdjacentElement('afterend', messageEl);

        // Auto-remove after some time (optional)
        setTimeout(() => messageEl.remove(), 5000);
    }

    function showError(message) {
        removeMessages();

        const messageEl = document.createElement('div');
        messageEl.className = 'form-message error';
        messageEl.textContent = message;
        
        const form = document.getElementById('login-form');
        form.insertAdjacentElement('afterend', messageEl);

        setTimeout(() => messageEl.remove(), 4000);
    }

    function removeMessages() {
        document.querySelectorAll('.form-message').forEach(el => el.remove());
    }

    // Optional: Basic visual feedback on input focus
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
});