// ============================================
// BODY PARLOR - INTERACTIVE JAVASCRIPT
// Smooth Animations, Scroll Effects & More
// ============================================

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all elements with data-scroll attribute
document.querySelectorAll('[data-scroll]').forEach(el => {
    observer.observe(el);
});

// ============================================
// SHOPPING CART FUNCTIONALITY
// ============================================
let cart = JSON.parse(localStorage.getItem('bodyParlorCart')) || [];
const cartIcon = document.querySelector('.cart-count');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const whatsappCheckout = document.getElementById('whatsappCheckout');
const clearCartBtn = document.getElementById('clearCart');

// Update cart display
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartIcon.textContent = totalItems;
    
    if (cart.length === 0) {
        cartEmpty.classList.add('show');
        cartFooter.classList.remove('show');
        cartItems.innerHTML = '';
    } else {
        cartEmpty.classList.remove('show');
        cartFooter.classList.add('show');
        renderCartItems();
        updateCartTotal();
    }
    
    // Save to localStorage
    localStorage.setItem('bodyParlorCart', JSON.stringify(cart));
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-icon">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-size">Size: ${item.size}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${index})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${index})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" onclick="removeItem(${index})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[R,]/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    cartTotal.textContent = `R${total.toLocaleString()}`;
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => 
        item.name === product.name && item.size === product.size
    );
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Animate cart icon
    cartIcon.parentElement.style.animation = 'none';
    setTimeout(() => {
        cartIcon.parentElement.style.animation = 'pulse 0.5s ease';
    }, 10);
}

// Increase quantity
window.increaseQuantity = function(index) {
    cart[index].quantity++;
    updateCart();
};

// Decrease quantity
window.decreaseQuantity = function(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCart();
    } else {
        removeItem(index);
    }
};

// Remove item
window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCart();
    showNotification('Item removed from cart', 'info');
};

// Clear cart
clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCart();
        showNotification('Cart cleared', 'info');
    }
});

// Open cart
document.querySelector('.cart-icon').addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close cart
cartClose.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// WhatsApp Checkout
whatsappCheckout.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    let message = '🛍️ *Body Parlor Order*\n\n';
    
    cart.forEach(item => {
        message += `*${item.name}*\n`;
        message += `Size: ${item.size}\n`;
        message += `Quantity: ${item.quantity}\n`;
        message += `Price: ${item.price}\n\n`;
    });
    
    const total = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[R,]/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    
    message += `*Total: R${total.toLocaleString()}*\n\n`;
    message += 'Please confirm my order. Thank you! 🙏';
    
    const whatsappNumber = '27648079732'; // 064 807 9732 in international format
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
});

// Initialize cart on page load
updateCart();

// ============================================
// PRODUCT CARD INTERACTIONS
// ============================================
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    // Quick view functionality
    const quickViewBtn = card.querySelector('.quick-view');
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productName = card.querySelector('h3').textContent;
            showNotification(`Viewing ${productName}`, 'info');
        });
    }

    // Add to cart functionality
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.price').textContent;
            const productIcon = card.querySelector('.product-icon').className.split(' ')[1];
            
            // Default size M if no size selected
            const product = {
                name: productName,
                price: productPrice,
                size: 'M',
                icon: productIcon
            };
            
            addToCart(product);
        });
    }

    // Card tilt effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============================================
// GALLERY INTERACTIONS
// ============================================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    const video = item.querySelector('video');
    
    // Hover to play video
    if (video) {
        item.addEventListener('mouseenter', () => {
            video.play();
        });
        
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }

    // Click to expand (simple modal effect)
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const videoSrc = video ? video.querySelector('source').src : null;
        
        if (img || videoSrc) {
            createLightbox(img ? img.src : null, videoSrc);
        }
    });
});

// Lightbox for gallery
function createLightbox(imageSrc, videoSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            ${imageSrc ? `<img src="${imageSrc}" alt="Gallery Image">` : ''}
            ${videoSrc ? `<video src="${videoSrc}" controls autoplay></video>` : ''}
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => lightbox.classList.add('active'), 10);
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// Add lightbox styles dynamically
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 2rem;
    }
    
    .lightbox.active {
        opacity: 1;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        animation: zoomIn 0.3s ease;
    }
    
    .lightbox-content img,
    .lightbox-content video {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 8px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(212, 175, 55, 0.3);
        color: white;
        font-size: 2rem;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .lightbox-close:hover {
        background: var(--primary);
        color: var(--secondary);
        transform: rotate(90deg);
    }
    
    @keyframes zoomIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }
`;
document.head.appendChild(lightboxStyles);

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Simulate form submission
    showNotification(`Thank you, ${name}! We'll be in touch soon.`, 'success');
    
    // Reset form
    contactForm.reset();
    
    // Remove focus from all inputs
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.blur();
    });
});

// Newsletter form
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        showNotification(`Welcome to our style community! 🎉`, 'success');
        form.reset();
    });
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        info: 'fa-info-circle',
        error: 'fa-exclamation-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 2rem;
        background: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(20px);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border: 1px solid rgba(212, 175, 55, 0.3);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success {
        border-color: #4ade80;
    }
    
    .notification-success i {
        color: #4ade80;
    }
    
    .notification-info {
        border-color: #60a5fa;
    }
    
    .notification-info i {
        color: #60a5fa;
    }
    
    .notification-error {
        border-color: #f87171;
    }
    
    .notification-error i {
        color: #f87171;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 1rem;
            left: 1rem;
            transform: translateY(-150px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(notificationStyles);

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// PARALLAX EFFECT FOR HERO
// ============================================
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = hero.offsetHeight;
    
    if (scrolled < heroHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / heroHeight);
    }
});

// ============================================
// HERO TEXT ANIMATION WITH 5 SECOND DELAY
// ============================================
const heroVideo = document.getElementById('heroVideo');
const heroText = document.getElementById('heroText');

// Function to show hero text with animation
function showHeroText() {
    heroText.style.transition = 'opacity 1s ease';
    heroText.style.opacity = '1';
}

// Function to hide hero text
function hideHeroText() {
    heroText.style.transition = 'opacity 0.5s ease';
    heroText.style.opacity = '0';
}

// Show text after 5 seconds on page load
setTimeout(showHeroText, 5000);

// Listen for video loop to restart animation
if (heroVideo) {
    heroVideo.addEventListener('timeupdate', () => {
        // When video restarts (currentTime is less than 0.5 seconds)
        if (heroVideo.currentTime < 0.5 && heroVideo.currentTime > 0) {
            hideHeroText();
            setTimeout(showHeroText, 5000);
        }
    });
}

// ============================================
// CURSOR EFFECT (PREMIUM TOUCH)
// ============================================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursorFollower);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Smooth follower animation
function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor interactions
const interactiveElements = document.querySelectorAll('a, button, .product-card, .gallery-item');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
    });
});

// Add cursor styles
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        width: 10px;
        height: 10px;
        background: var(--primary);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
        mix-blend-mode: difference;
    }
    
    .cursor-follower {
        width: 40px;
        height: 40px;
        border: 2px solid var(--primary);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
        opacity: 0.5;
    }
    
    .custom-cursor.cursor-hover {
        width: 20px;
        height: 20px;
    }
    
    .cursor-follower.cursor-hover {
        width: 60px;
        height: 60px;
    }
    
    @media (max-width: 1024px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyles);

// ============================================
// DYNAMIC TEXT ANIMATION
// ============================================
const animateText = (element) => {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.animation = `fadeInChar 0.5s ease ${index * 0.03}s forwards`;
        element.appendChild(span);
    });
};

// Add text animation styles
const textAnimStyles = document.createElement('style');
textAnimStyles.textContent = `
    @keyframes fadeInChar {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(textAnimStyles);

// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Body Parlor ✨', 'info');
    }, 1000);
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ACTIVE SECTION HIGHLIGHTING IN NAV
// ============================================
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);

// Add active link style
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
    .nav-link.active {
        color: var(--primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeLinkStyle);

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c🌟 Welcome to Body Parlor 🌟', 'font-size: 20px; font-weight: bold; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cLooking for opportunities? Contact us at careers@bodyparlor.com', 'font-size: 14px; color: #b0b0b0;');

// ============================================
// INITIALIZATION COMPLETE
// ============================================
console.log('✅ Body Parlor - All systems ready!');
