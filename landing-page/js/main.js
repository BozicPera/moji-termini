// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle clicked item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide previous messages
        formSuccess.style.display = 'none';
        formError.style.display = 'none';

        // Get form data
        const formData = new FormData(contactForm);

        // Basic validation and sanitization
        const data = {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            phone: formData.get('phone')?.trim() || '',
            clinic: formData.get('clinic')?.trim() || '',
            message: formData.get('message')?.trim() || ''
        };

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            formError.textContent = '✗ Molimo popunite sva obavezna polja (ime, email, poruka).';
            formError.style.display = 'block';
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            formError.textContent = '✗ Molimo unesite validnu email adresu.';
            formError.style.display = 'block';
            return;
        }

        // Check honeypot (spam protection)
        if (formData.get('website')) {
            // Silently reject spam
            formSuccess.style.display = 'block';
            contactForm.reset();
            return;
        }

        // Disable submit button with loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.setAttribute('aria-busy', 'true');

        try {
            // Send data to PHP backend
            const response = await fetch('send-email.php', {
                method: 'POST',
                body: new URLSearchParams(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                formSuccess.style.display = 'block';
                contactForm.reset();

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error(result.message || 'Submission failed');
            }

        } catch (error) {
            // Show error message with more context
            let errorMessage = '✗ Greška prilikom slanja. ';

            if (!navigator.onLine) {
                errorMessage += 'Proverite internet konekciju.';
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Molimo pokušajte ponovo ili nas kontaktirajte direktno na info@mojitermini.rs';
            }

            formError.textContent = errorMessage;
            formError.style.display = 'block';

            // Scroll to error message
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Log error for debugging (remove in production)
            console.error('Form submission error:', error);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.setAttribute('aria-busy', 'false');
        }
    });
}

// Note: Form submission now uses send-email.php backend
// No simulation function needed

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default if href is just "#"
        if (href === '#') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// Animate elements on scroll (simple intersection observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .problem-card, .testimonial-card, .pricing-card, .step');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Stats counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                stat.dataset.suffix = suffix;
                animateCounter(stat, target);
            });
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Production version - debug logs removed
// For development, uncomment the following:
// console.log('%c🎉 Moji Termini Landing Page', 'font-size: 20px; font-weight: bold; color: #3B82F6;');
// console.log('%cVersion: 1.0.0', 'color: #6B7280;');
