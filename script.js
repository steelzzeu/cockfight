// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate stat bars on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statBars = entry.target.querySelectorAll('.fill');
                statBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.fighter-card').forEach(card => {
        observer.observe(card);
    });

    // Random animation delays for floating chickens
    document.querySelectorAll('.floating-chickens span').forEach(chicken => {
        chicken.style.animationDelay = `${Math.random() * 5}s`;
    });

    // Add hover effect to fighter cards
    document.querySelectorAll('.fighter-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add custom animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes peck {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-20deg); }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-50px) rotate(10deg); }
        }

        @keyframes sway {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
        }
    `;
    document.head.appendChild(style);
}); 