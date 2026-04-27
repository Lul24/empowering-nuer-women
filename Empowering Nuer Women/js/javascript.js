// ===============================
// Mobile Menu Toggle
// ===============================
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburgerIcon = document.querySelector('.hamburger i');
  
  if (!navMenu) return;
  
  navMenu.classList.toggle('active');
  
  if (navMenu.classList.contains('active')) {
    if (hamburgerIcon) {
      hamburgerIcon.classList.remove('fa-bars');
      hamburgerIcon.classList.add('fa-times');
    }
    document.body.style.overflow = 'hidden';
  } else {
    if (hamburgerIcon) {
      hamburgerIcon.classList.remove('fa-times');
      hamburgerIcon.classList.add('fa-bars');
    }
    document.body.style.overflow = '';
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.querySelector('.hamburger');
  
  if (!navMenu || !hamburger) return;
  
  if (!navMenu.contains(event.target) && !hamburger.contains(event.target) && navMenu.classList.contains('active')) {
    toggleMenu();
  }
});

// ===============================
// Navbar background on scroll (matches CSS)
// ===============================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  // Using class-based approach (matches your CSS)
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===============================
// Scroll fade-up animation (matches CSS - uses 'visible' class)
// ===============================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// ===============================
// Smooth scrolling for anchor links
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId === '') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      
      // Close mobile menu if open
      const navMenu = document.getElementById('navMenu');
      if (navMenu && navMenu.classList.contains('active')) {
        toggleMenu();
      }
      
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  });
});

// ===============================
// FAQ Accordion Toggle
// ===============================
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', function() {
    const item = this.parentElement;
    if (item) {
      item.classList.toggle('active');
    }
  });
});

// ===============================
// Video Modal Functions
// ===============================
function closeVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const videoFrame = document.getElementById('videoFrame');
  
  if (videoModal) {
    videoModal.classList.remove('active');
  }
  if (videoFrame) {
    videoFrame.src = '';
  }
  document.body.style.overflow = '';
}

// Initialize video modal
function initVideoModal() {
  const playButtons = document.querySelectorAll('.play-btn');
  const videoModal = document.getElementById('videoModal');
  const videoFrame = document.getElementById('videoFrame');
  
  if (!videoModal || !videoFrame) return;
  
  playButtons.forEach(button => {
    button.addEventListener('click', function() {
      const videoUrl = this.getAttribute('data-video');
      if (videoUrl) {
        videoFrame.src = videoUrl + '?autoplay=1';
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal when clicking outside
  videoModal.addEventListener('click', function(e) {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });
}

// ===============================
// Donation Form Handler
// ===============================
function initDonationForm() {
  const donationForm = document.getElementById('donationForm');
  if (!donationForm) return;
  
  // Predefined amount selection
  const amountOptions = document.querySelectorAll('.amount-option, .select-amount');
  const customAmountInput = document.getElementById('customAmount');
  
  amountOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove selected class from all options
      document.querySelectorAll('.amount-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // Add selected class to clicked option if it's an amount-option
      if (this.classList.contains('amount-option')) {
        this.classList.add('selected');
      }
      
      // Set the custom amount input value
      const amount = this.getAttribute('data-amount');
      if (customAmountInput && amount) {
        customAmountInput.value = amount;
      }
    });
  });
  
  donationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = customAmountInput ? customAmountInput.value : '';
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const email = document.getElementById('email')?.value || '';
    
    if (!amount || amount < 1) {
      alert('Please enter a valid donation amount.');
      if (customAmountInput) customAmountInput.focus();
      return;
    }
    
    if (!firstName || !lastName || !email) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const submitBtn = donationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML || '';
    
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;
    }
    
    setTimeout(() => {
      alert(`Thank you, ${firstName}! Your donation of $${parseFloat(amount).toFixed(2)} has been received. A receipt will be sent to ${email}.`);
      donationForm.reset();
      
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
      
      // Remove selected class from amount options
      document.querySelectorAll('.amount-option').forEach(opt => {
        opt.classList.remove('selected');
      });
    }, 1500);
  });
}

// ===============================
// Contact Form Handler
// ===============================
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function showError(groupId, show) {
    const group = document.getElementById(groupId);
    if (group) {
      if (show) {
        group.classList.add('error');
      } else {
        group.classList.remove('error');
      }
    }
  }
  
  function validateForm() {
    let isValid = true;
    
    const firstName = document.getElementById('firstName');
    if (firstName && !firstName.value.trim()) {
      showError('firstNameGroup', true);
      isValid = false;
    } else {
      showError('firstNameGroup', false);
    }
    
    const lastName = document.getElementById('lastName');
    if (lastName && !lastName.value.trim()) {
      showError('lastNameGroup', true);
      isValid = false;
    } else {
      showError('lastNameGroup', false);
    }
    
    const email = document.getElementById('email');
    if (email && (!email.value.trim() || !validateEmail(email.value))) {
      showError('emailGroup', true);
      isValid = false;
    } else {
      showError('emailGroup', false);
    }
    
    const message = document.getElementById('message');
    if (message && !message.value.trim()) {
      showError('messageGroup', true);
      isValid = false;
    } else {
      showError('messageGroup', false);
    }
    
    return isValid;
  }
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML || '';
    
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
    }
    
    setTimeout(() => {
      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.style.display = 'block';
        contactForm.style.display = 'none';
        
        setTimeout(() => {
          successMessage.style.display = 'none';
          contactForm.style.display = 'block';
          contactForm.reset();
        }, 5000);
      } else {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
      }
      
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }, 1500);
  });
}

// ===============================
// Volunteer Form Handler
// ===============================
function initVolunteerForm() {
  const volunteerForm = document.getElementById('volunteerForm');
  if (!volunteerForm) return;
  
  volunteerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (isValid) {
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn?.innerHTML || '';
      
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
      }
      
      setTimeout(() => {
        alert('Thank you for your volunteer application! We will review it and contact you within 5-7 business days.');
        volunteerForm.reset();
        
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 1500);
    } else {
      alert('Please fill in all required fields marked with *');
    }
  });
  
  // Reset border color on focus
  volunteerForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('focus', function() {
      this.style.borderColor = '';
    });
  });
}

// ===============================
// Partnership Form Handler
// ===============================
function initPartnershipForm() {
  const partnerForm = document.getElementById('partnerForm');
  if (!partnerForm) return;
  
  partnerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (isValid) {
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn?.innerHTML || '';
      
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
      }
      
      setTimeout(() => {
        alert('Thank you for your partnership inquiry! Our team will contact you within 48 hours.');
        partnerForm.reset();
        
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 1500);
    } else {
      alert('Please fill in all required fields marked with *');
    }
  });
  
  // Reset border color on focus
  partnerForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('focus', function() {
      this.style.borderColor = '';
    });
  });
}

// ===============================
// Career Form Handler
// ===============================
function initCareerForm() {
  const jobForm = document.getElementById('jobApplicationForm');
  if (!jobForm) return;
  
  jobForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (isValid) {
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn?.innerHTML || '';
      
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
      }
      
      setTimeout(() => {
        alert('Thank you for your application! Our HR team will review your application and contact you if your qualifications match our needs.');
        jobForm.reset();
        
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 1500);
    } else {
      alert('Please fill in all required fields.');
    }
  });
  
  // Reset border color on focus
  jobForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('focus', function() {
      this.style.borderColor = '';
    });
  });
}

// ===============================
// Newsletter Form Handler
// ===============================
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim()) {
      alert(`Thank you for subscribing with ${emailInput.value}! You'll receive updates about our events and impact stories.`);
      this.reset();
    } else {
      alert('Please enter a valid email address.');
    }
  });
}

// ===============================
// Job Application Button Handler
// ===============================
function openApplication(position) {
  const positionSelect = document.getElementById('position');
  if (positionSelect) {
    positionSelect.value = position;
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
      applicationForm.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// ===============================
// Event Registration Handler
// ===============================
function openRegistration(eventName, eventDate) {
  alert(`Thank you for your interest in "${eventName}" on ${eventDate}!\n\nRegistration details will be sent to your email. Please check back soon for registration link.`);
}

// ===============================
// Progress Bar Animation for Transparency Page
// ===============================
function initProgressBars() {
  const fillElements = document.querySelectorAll('.breakdown-fill');
  
  const barObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        if (width) {
          fill.style.width = width;
        }
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });
  
  fillElements.forEach(fill => {
    barObserver.observe(fill);
  });
}

// ===============================
// Download Button Handler (Placeholder)
// ===============================
function initDownloadButtons() {
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('PDF report download will be available soon. Please check back later or contact us for reports.');
    });
  });
}

// ===============================
// Watch Recording Button Handler (Placeholder)
// ===============================
function initWatchButtons() {
  document.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Event recording will be available soon. Please check back later.');
    });
  });
}

// ===============================
// Initialize Everything on DOM Load
// ===============================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all forms
  initDonationForm();
  initContactForm();
  initVolunteerForm();
  initPartnershipForm();
  initCareerForm();
  initNewsletterForm();
  
  // Initialize video modal
  initVideoModal();
  
  // Initialize progress bars for transparency page
  initProgressBars();
  
  // Initialize placeholder buttons
  initDownloadButtons();
  initWatchButtons();
  
  // Add visible class to elements already in viewport
  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.8) {
      el.classList.add('visible');
    }
  });
});

// ===============================
// Make Functions Globally Available
// ===============================
window.toggleMenu = toggleMenu;
window.closeVideoModal = closeVideoModal;
window.openApplication = openApplication;
window.openRegistration = openRegistration;