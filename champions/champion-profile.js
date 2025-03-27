document.addEventListener('DOMContentLoaded', () => {
    // Initialize stat bars
    const statBars = document.querySelectorAll('.stat-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const value = entry.target.getAttribute('data-value');
                entry.target.style.transform = `scaleX(${value / 100})`;
            }
        });
    }, { threshold: 0.5 });

    statBars.forEach(bar => {
        bar.style.transform = 'scaleX(0)';
        observer.observe(bar);
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        timelineObserver.observe(item);
    });

    // Add parallax effect to champion portrait
    const portrait = document.querySelector('.champion-portrait');
    let isHovering = false;

    portrait.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    portrait.addEventListener('mouseleave', () => {
        isHovering = false;
        portrait.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });

    portrait.addEventListener('mousemove', (e) => {
        if (!isHovering) return;

        const rect = portrait.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xRotation = ((y - rect.height / 2) / rect.height) * 20;
        const yRotation = ((x - rect.width / 2) / rect.width) * 20;

        portrait.style.transform = `
            perspective(1000px)
            rotateX(${-xRotation}deg)
            rotateY(${yRotation}deg)
        `;
    });

    // Add hover effect to stats
    document.querySelectorAll('.stat-item').forEach(stat => {
        stat.addEventListener('mouseenter', () => {
            const fill = stat.querySelector('.stat-fill');
            fill.style.filter = 'brightness(1.2)';
            fill.style.transform = `scaleX(${(parseInt(fill.getAttribute('data-value')) / 100) * 1.02})`;
        });

        stat.addEventListener('mouseleave', () => {
            const fill = stat.querySelector('.stat-fill');
            fill.style.filter = 'brightness(1)';
            fill.style.transform = `scaleX(${parseInt(fill.getAttribute('data-value')) / 100})`;
        });
    });

    // Add scroll-based parallax to header
    const header = document.querySelector('.profile-header');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        header.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    });

    // Animate champion emoji
    const emoji = document.querySelector('.champion-emoji');
    let rotation = 0;
    let floatY = 0;

    function animateEmoji() {
        floatY += 0.02;
        rotation = Math.sin(floatY) * 5;
        
        emoji.style.transform = `
            translate(-50%, -50%)
            rotate(${rotation}deg)
            scale(${1 + Math.sin(floatY) * 0.05})
        `;

        requestAnimationFrame(animateEmoji);
    }

    animateEmoji();
}); 