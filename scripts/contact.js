/**
 * Shared Contact Form Module
 * Handles modal interactions and form submission via EmailJS.
 */

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form message on close
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.textContent = '';
            formMessage.classList.add('hidden');
        }
    }
}

function initContactForm() {
    // Initialize EmailJS. This assumes the library is loaded.
    try {
        emailjs.init("DL74aZmMD6MBCza2F");
        console.log('EmailJS initialized successfully for contact form.');
    } catch (e) {
        console.error("EmailJS initialization failed. Make sure the EmailJS script is loaded before contact.js.", e);
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('contactModal');
        if (event.target == modal) {
            closeContactModal();
        }
    });
}

function submitContactForm(event) {
    event.preventDefault();

    if (typeof emailjs === 'undefined') {
        alert('Email service is not available. Please try again later.');
        return;
    }

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('form-message');
    const originalText = submitBtn.textContent;

    // Clear previous messages and show loading state
    formMessage.textContent = '';
    formMessage.className = 'hidden text-center p-3 rounded-md mb-4 text-white';
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const now = new Date();
    const templateParams = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    };

    emailjs.send('service_0di3jju', 'template_ohrrhbb', templateParams)
        .then(function(response) {
            formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            formMessage.classList.remove('hidden', 'bg-red-500');
            formMessage.classList.add('bg-green-500');
            form.reset();
            setTimeout(closeContactModal, 3000); // Close modal after 3 seconds on success
        }, function(error) {
            console.error('FAILED...', error);
            formMessage.textContent = 'Failed to send message. Please try again later.';
            formMessage.classList.remove('hidden', 'bg-green-500');
            formMessage.classList.add('bg-red-500');
        })
        .finally(function() {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', initContactForm);