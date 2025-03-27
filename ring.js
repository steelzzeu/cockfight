document.addEventListener('DOMContentLoaded', () => {
    const fighters = {
        'cockodile': {
            name: 'Cockodile Dundee',
            strength: 95,
            speed: 90,
            image: 'champsimg/cockdundee.png',
            specialMove: 'Outback Assault'
        },
        'pluck-norris': {
            name: 'Pluck Norris',
            strength: 100,
            speed: 100,
            image: 'champsimg/plucknorris.png',
            specialMove: 'Roundhouse Peck'
        },
        'pecker-wrecker': {
            name: 'Pecker Wrecker',
            strength: 98,
            speed: 85,
            image: 'champsimg/peckerwrecker.png',
            specialMove: 'Brutal Ram'
        },
        'feather-fucker': {
            name: 'Feather Fucker',
            strength: 92,
            speed: 95,
            image: 'champsimg/featherfucker.png',
            specialMove: 'Primal Rush'
        },
        'deep-clucker': {
            name: 'Deep Clucker',
            strength: 90,
            speed: 88,
            image: 'champsimg/deepclucker.png',
            specialMove: 'Deep Impact'
        },
        'throbbin-gobbler': {
            name: 'The Throbbin\' Gobbler',
            strength: 95,
            speed: 92,
            image: 'champsimg/throbbingobbler.png',
            specialMove: 'Throat Lock'
        }
    };

    let selectedFighters = [];
    let thrownItems = [];
    const startButton = document.querySelector('.start-fight');
    const timerDisplay = document.querySelector('.fight-timer');
    const fighterCards = document.querySelectorAll('.fighter-card');
    const throwButtons = document.querySelectorAll('.throw-item');
    const leftFighter = document.querySelector('.fighter-left');
    const rightFighter = document.querySelector('.fighter-right');

    // Initially hide fighters
    leftFighter.classList.remove('visible');
    rightFighter.classList.remove('visible');

    // Add mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Add viewport meta tag for mobile
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);
    }

    // Fighter Selection
    fighterCards.forEach(card => {
        card.addEventListener('click', () => {
            const fighterId = card.dataset.fighter;
            
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                selectedFighters = selectedFighters.filter(f => f !== fighterId);
                updateFighterVisibility();
            } else if (selectedFighters.length < 2) {
                card.classList.add('selected');
                selectedFighters.push(fighterId);
                updateFighterVisibility();
            }

            startButton.disabled = selectedFighters.length !== 2;
        });
    });

    function updateFighterVisibility() {
        if (selectedFighters.length > 0) {
            leftFighter.classList.add('visible');
            leftFighter.querySelector('img').src = fighters[selectedFighters[0]]?.image || '';
        } else {
            leftFighter.classList.remove('visible');
        }
        
        if (selectedFighters.length > 1) {
            rightFighter.classList.add('visible');
            rightFighter.querySelector('img').src = fighters[selectedFighters[1]].image;
        } else {
            rightFighter.classList.remove('visible');
        }
    }

    // Start Fight
    startButton.addEventListener('click', () => {
        if (selectedFighters.length !== 2) return;
        
        const [fighter1, fighter2] = selectedFighters;
        setupFight(fighter1, fighter2);
        startFight();
    });

    // Throw Items
    throwButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.dataset.item;
            throwItem(item);
        });
    });

    function setupFight(fighter1Id, fighter2Id) {
        const leftFighter = document.querySelector('.fighter-left img');
        const rightFighter = document.querySelector('.fighter-right img');
        
        leftFighter.src = fighters[fighter1Id].image;
        rightFighter.src = fighters[fighter2Id].image;
        
        // Reset health bars
        document.querySelectorAll('.health-fill').forEach(health => {
            health.style.width = '100%';
        });

        // Disable fighter selection
        fighterCards.forEach(card => {
            card.style.pointerEvents = 'none';
        });
        
        startButton.disabled = true;
        
        initializeFighterPositions();
        
        // Add keyboard controls for manual movement (for testing)
        document.addEventListener('keydown', handleFighterMovement);
    }

    function startFight() {
        let timeLeft = 30;
        timerDisplay.textContent = timeLeft;

        const fightInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft % 2 === 0) {
                performAttack();
            }

            if (timeLeft <= 0) {
                clearInterval(fightInterval);
                endFight();
            }
        }, 1000);

        // Enable throw buttons during fight
        throwButtons.forEach(button => {
            button.disabled = false;
        });
    }

    function performAttack() {
        const attackerSide = Math.random() < 0.5 ? 'left' : 'right';
        const attacker = document.querySelector(`.fighter-${attackerSide}`);
        const defender = document.querySelector(`.fighter-${attackerSide === 'left' ? 'right' : 'left'}`);
        
        // Clear any existing movement classes
        attacker.classList.remove('moving', 'circling', 'bouncing', 'strutting');
        defender.classList.remove('moving', 'circling', 'bouncing', 'strutting');
        
        // Choose a random attack pattern
        const attackPattern = Math.random();
        
        if (attackPattern < 0.3) {
            // Circle around opponent before attacking
            circleOpponent(attacker, defender, () => {
                performNormalAttack(attacker, defender);
            });
        } else if (attackPattern < 0.6) {
            // Quick dash attack
            dashAttack(attacker, defender);
        } else {
            // Standard attack with improved positioning
            improvedPositionAttack(attacker, defender);
        }
    }

    function circleOpponent(attacker, defender, callback) {
        const defenderRect = defender.getBoundingClientRect();
        const radius = 150; // Circle radius
        const angle = Math.random() * Math.PI * 2;
        
        // Calculate circle path
        const circleX = Math.cos(angle) * radius;
        const circleY = Math.sin(angle) * radius;
        
        // Set circle animation variables
        attacker.style.setProperty('--circle-x', `${circleX}px`);
        attacker.style.setProperty('--circle-y', `${circleY}px`);
        attacker.style.setProperty('--circle-rotate', `${angle * 180 / Math.PI}deg`);
        
        // Start circling animation
        attacker.classList.add('circling');
        
        // Execute attack after circling
        setTimeout(() => {
            attacker.classList.remove('circling');
            callback();
        }, 2000);
    }

    function dashAttack(attacker, defender) {
        const attackerRect = attacker.getBoundingClientRect();
        const defenderRect = defender.getBoundingClientRect();
        
        // Calculate dash position (80% of the way to the defender)
        const dx = defenderRect.left - attackerRect.left;
        const dy = defenderRect.top - attackerRect.top;
        const dashX = attackerRect.left + dx * 0.8;
        const dashY = attackerRect.top + dy * 0.8;
        
        // Quick movement to dash position
        moveFighter(attacker, dashX, dashY);
        
        setTimeout(() => {
            // Chance for defender to dodge
            if (Math.random() < 0.4) {
                dodgeAttack(defender);
            } else {
                performNormalAttack(attacker, defender);
            }
        }, 300);
    }

    function dodgeAttack(defender) {
        const ring = document.querySelector('.ring-circle');
        const ringRect = ring.getBoundingClientRect();
        
        // Calculate dodge direction (random angle away from current position)
        const dodgeAngle = Math.random() * Math.PI * 2;
        const dodgeDistance = 100;
        
        // Set dodge animation variables
        defender.style.setProperty('--dodge-x', `${Math.cos(dodgeAngle) * dodgeDistance}px`);
        defender.style.setProperty('--dodge-y', `${Math.sin(dodgeAngle) * dodgeDistance}px`);
        defender.style.setProperty('--dodge-rotate', `${Math.random() * 360}deg`);
        
        // Start dodge animation
        defender.classList.add('dodging');
        
        // Remove dodge class after animation
        setTimeout(() => {
            defender.classList.remove('dodging');
            
            // Move to new position after dodge
            const newPos = getRandomRingPosition();
            moveFighter(defender, newPos.x, newPos.y);
        }, 500);
    }

    function improvedPositionAttack(attacker, defender) {
        const attackerRect = attacker.getBoundingClientRect();
        const defenderRect = defender.getBoundingClientRect();
        
        // Calculate distance between fighters
        const dx = defenderRect.left - attackerRect.left;
        const dy = defenderRect.top - attackerRect.top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            // Too close, move to better position
            const newPos = getRandomRingPosition();
            moveFighter(attacker, newPos.x, newPos.y);
            setTimeout(() => performNormalAttack(attacker, defender), 500);
        } else if (distance > 300) {
            // Too far, move closer
            const moveX = attackerRect.left + dx * 0.6;
            const moveY = attackerRect.top + dy * 0.6;
            moveFighter(attacker, moveX, moveY);
            setTimeout(() => performNormalAttack(attacker, defender), 500);
        } else {
            // Good distance for attack
            performNormalAttack(attacker, defender);
        }
    }

    function performNormalAttack(attacker, defender) {
        const attackerRect = attacker.getBoundingClientRect();
        const defenderRect = defender.getBoundingClientRect();
        
        // Calculate impact point
        const impactX = (attackerRect.left + defenderRect.left) / 2;
        const impactY = (attackerRect.top + defenderRect.top) / 2;
        
        moveFighter(attacker, impactX, impactY);
        
        setTimeout(() => {
            attacker.classList.add('attacking');
            createImpactFlash(impactX, impactY);
            
            setTimeout(() => {
                defender.classList.add('hit');
                createBloodSplatter(impactX, impactY, 1);
                createSmokeEffect(impactX, impactY);
                createFeatherExplosion(defender);
                updateHealth(defender);
                
                // Move fighters to new positions
                const pos1 = getRandomRingPosition();
                const pos2 = getRandomRingPosition();
                moveFighter(attacker, pos1.x, pos1.y);
                moveFighter(defender, pos2.x, pos2.y);
                
                playRandomSound(['peck', 'squawk', 'flap']);
            }, 100);

            setTimeout(() => {
                attacker.classList.remove('attacking');
                defender.classList.remove('hit');
            }, 500);
        }, 300);
    }

    function performSpecialMove(attacker, defender) {
        attacker.classList.add('special-move');
        
        const defenderRect = defender.getBoundingClientRect();
        const impactX = defenderRect.left + defenderRect.width / 2;
        const impactY = defenderRect.top + defenderRect.height / 2;
        
        // Create multiple effects
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createBloodSplatter(
                        impactX + (Math.random() * 100 - 50),
                        impactY + (Math.random() * 100 - 50),
                        2
                    );
                    createSmokeEffect(
                        impactX + (Math.random() * 60 - 30),
                        impactY + (Math.random() * 60 - 30)
                    );
                    createImpactFlash(
                        impactX + (Math.random() * 40 - 20),
                        impactY + (Math.random() * 40 - 20)
                    );
                    createFeatherExplosion(defender);
                }, i * 200);
            }
            
            defender.classList.add('hit');
            updateHealth(defender, 20);
            
            playRandomSound([
                'special-attack',
                'power-up',
                'explosion'
            ]);
        }, 500);

        setTimeout(() => {
            attacker.classList.remove('special-move');
            defender.classList.remove('hit');
        }, 2000);
    }

    function createBloodSplatter(x, y, intensity = 1) {
        const container = document.querySelector('.fight-effects');
        const particleCount = Math.floor(Math.random() * (isMobile ? 3 : 5) + (isMobile ? 3 : 5)) * intensity;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'blood-particle';
            
            // Smaller particles on mobile
            const size = Math.random() * (isMobile ? 5 : 10) + (isMobile ? 3 : 5);
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Position around impact point
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (isMobile ? 30 : 50);
            particle.style.left = `${x + Math.cos(angle) * distance}px`;
            particle.style.top = `${y + Math.sin(angle) * distance}px`;
            
            container.appendChild(particle);
            
            // Faster animation on mobile
            particle.style.animation = `bloodSpray ${isMobile ? 0.3 : 0.5}s ease-out forwards`;
            setTimeout(() => particle.remove(), isMobile ? 300 : 500);
        }
        
        // Create gore particles for extra gruesome effect
        if (Math.random() < 0.3) {
            createGoreEffect(x, y);
        }
    }

    function createGoreEffect(x, y) {
        const container = document.querySelector('.fight-effects');
        const particleCount = Math.random() * 3 + 2;
        
        for (let i = 0; i < particleCount; i++) {
            const gore = document.createElement('div');
            gore.className = 'gore-particle';
            
            const size = Math.random() * 8 + 4;
            gore.style.width = `${size}px`;
            gore.style.height = `${size}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 30;
            gore.style.left = `${x + Math.cos(angle) * distance}px`;
            gore.style.top = `${y + Math.sin(angle) * distance}px`;
            
            container.appendChild(gore);
            
            // Animate with gravity effect
            const duration = Math.random() * 0.5 + 0.5;
            gore.style.transition = `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
            
            requestAnimationFrame(() => {
                gore.style.transform = `translate(${Math.random() * 60 - 30}px, ${Math.random() * 30 + 50}px)`;
                gore.style.opacity = '0';
            });
            
            setTimeout(() => gore.remove(), duration * 1000);
        }
    }

    function createSmokeEffect(x, y) {
        const container = document.querySelector('.fight-effects');
        const smokeCount = Math.floor(Math.random() * 3 + 2);
        
        for (let i = 0; i < smokeCount; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-effect';
            
            smoke.style.left = `${x}px`;
            smoke.style.top = `${y}px`;
            
            container.appendChild(smoke);
            
            smoke.style.animation = 'smokeRise 1s ease-out forwards';
            setTimeout(() => smoke.remove(), 1000);
        }
    }

    function createImpactFlash(x, y) {
        const container = document.querySelector('.fight-effects');
        const flash = document.createElement('div');
        flash.className = 'impact-flash';
        
        flash.style.left = `${x - 50}px`;
        flash.style.top = `${y - 50}px`;
        
        container.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    }

    function createFeatherExplosion(fighter) {
        const featherCount = 10;
        const fightingArea = document.querySelector('.fighting-area');
        
        for (let i = 0; i < featherCount; i++) {
            const feather = document.createElement('div');
            feather.className = 'feather';
            
            // Random position relative to the fighter
            const rect = fighter.getBoundingClientRect();
            const fighterCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            
            // Set random direction for feather explosion
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = Math.random() * 100 + 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            feather.style.setProperty('--x', `${x}px`);
            feather.style.setProperty('--y', `${y}px`);
            feather.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
            
            feather.style.left = `${fighterCenter.x}px`;
            feather.style.top = `${fighterCenter.y}px`;
            
            fightingArea.appendChild(feather);
            
            // Add animation
            feather.style.animation = 'featherExplosion 1s ease-out forwards';
            
            // Remove feather after animation
            setTimeout(() => feather.remove(), 1000);
        }
    }

    function updateHealth(defender, damage = 15) {
        const healthBar = defender.querySelector('.health-fill');
        const currentHealth = parseFloat(healthBar.style.width) || 100;
        let newHealth = Math.max(0, currentHealth - damage);
        
        // Calculate damage based on remaining time
        const timeLeft = parseInt(timerDisplay.textContent);
        if (timeLeft <= 5 && currentHealth > 30) {
            damage = currentHealth / 2; // Increase damage in final seconds
            newHealth = Math.max(0, currentHealth - damage);
        }
        
        healthBar.style.width = newHealth + '%';
        healthBar.classList.add('damage');
        setTimeout(() => healthBar.classList.remove('damage'), 300);
    }

    function throwItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'thrown-item';
        itemElement.textContent = {
            'money': '💰',
            'tomato': '🍅',
            'corn': '🌽'
        }[item];
        
        // Random position within the ring
        const ring = document.querySelector('.ring-circle');
        const ringRect = ring.getBoundingClientRect();
        const x = Math.random() * (ringRect.width * 0.6) + (ringRect.width * 0.2);
        const y = Math.random() * (ringRect.height * 0.6) + (ringRect.height * 0.2);
        
        itemElement.style.left = x + 'px';
        itemElement.style.top = y + 'px';
        
        document.querySelector('.arena-container').appendChild(itemElement);
        itemElement.style.animation = 'throwItem 1s ease-out forwards';
        
        // Store thrown item for cleanup
        thrownItems.push(itemElement);
    }

    function endFight() {
        const leftHealth = parseFloat(document.querySelector('.fighter-left .health-fill').style.width) || 0;
        const rightHealth = parseFloat(document.querySelector('.fighter-right .health-fill').style.width) || 0;
        
        const winner = leftHealth > rightHealth ? 'left' : 'right';
        const loser = winner === 'left' ? 'right' : 'left';
        
        const winnerFighter = document.querySelector(`.fighter-${winner}`);
        const loserFighter = document.querySelector(`.fighter-${loser}`);
        
        // Create blood overlay
        const bloodOverlay = document.createElement('div');
        bloodOverlay.className = 'blood-overlay-end';
        document.querySelector('.arena-container').appendChild(bloodOverlay);
        
        // Trigger final blood splatter effects
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createBloodSplatter(), i * 100);
        }
        
        // Show blood overlay
        setTimeout(() => {
            bloodOverlay.classList.add('visible');
        }, 1000);
        
        // Create end screen
        const endScreen = document.createElement('div');
        endScreen.className = 'end-screen';
        endScreen.innerHTML = `
            <div class="end-screen-content">
                <div class="winner-text">${fighters[selectedFighters[winner === 'left' ? 0 : 1]].name} WINS!</div>
                <button class="start-fight" onclick="location.reload()">Prepare Next Fight</button>
            </div>
        `;
        
        document.querySelector('.arena-container').appendChild(endScreen);
        
        // Show end screen and animate winner text
        setTimeout(() => {
            endScreen.classList.add('visible');
            endScreen.querySelector('.winner-text').classList.add('visible');
        }, 2000);
        
        // Start cleanup animation
        setTimeout(() => {
            cleanupRing();
        }, 3000);
    }

    function cleanupRing() {
        // Create cleanup container
        const cleanupContainer = document.createElement('div');
        cleanupContainer.className = 'cleanup-container';
        document.querySelector('.arena-container').appendChild(cleanupContainer);
        
        // Create bin
        const bin = document.createElement('div');
        bin.className = 'cleanup-bin';
        bin.textContent = '🗑️';
        cleanupContainer.appendChild(bin);
        
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'cleanup-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'cleanup-progress-bar';
        progressContainer.appendChild(progressBar);
        cleanupContainer.appendChild(progressContainer);
        
        // Show bin and progress bar
        setTimeout(() => {
            bin.classList.add('visible');
            progressContainer.classList.add('visible');
            progressBar.style.width = '100%';
        }, 100);

        // Collect all items to clean (blood splatters, thrown items, etc.)
        const itemsToClean = [
            ...Array.from(document.querySelectorAll('.blood-particle, .gore-particle, .thrown-item')),
            ...thrownItems
        ];
        
        // Get bin position for final animation
        const binRect = bin.getBoundingClientRect();
        const binX = binRect.left + binRect.width / 2;
        const binY = binRect.top + binRect.height / 2;
        
        // Animate each item to the bin
        itemsToClean.forEach((item, index) => {
            const delay = (index * 5000) / itemsToClean.length; // Spread over 5 seconds
            
            // Create cleanup clone
            const clone = document.createElement('div');
            clone.className = 'cleanup-item';
            clone.textContent = item.textContent || '';
            clone.style.width = item.offsetWidth + 'px';
            clone.style.height = item.offsetHeight + 'px';
            
            // Position clone at original item's position
            const rect = item.getBoundingClientRect();
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.background = getComputedStyle(item).background;
            cleanupContainer.appendChild(clone);
            
            // Calculate sweep path
            const sweepX = (Math.random() - 0.5) * 100;
            const sweepY = -Math.random() * 50;
            const sweepRotate = (Math.random() - 0.5) * 180;
            
            // Set animation variables
            clone.style.setProperty('--sweep-x', `${sweepX}px`);
            clone.style.setProperty('--sweep-y', `${sweepY}px`);
            clone.style.setProperty('--sweep-rotate', `${sweepRotate}deg`);
            clone.style.setProperty('--final-x', `${binX - rect.left}px`);
            clone.style.setProperty('--final-y', `${binY - rect.top}px`);
            
            // Start animation after delay
            setTimeout(() => {
                clone.style.animation = 'cleanupSweep 1s ease-out forwards';
                
                // Create sparkles
                createCleanupSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                
                // Shake bin
                bin.style.animation = 'binShake 0.5s ease-out';
                setTimeout(() => bin.style.animation = '', 500);
                
                // Remove original item
                item.remove();
                
                // Remove clone after animation
                setTimeout(() => clone.remove(), 1000);
            }, delay);
        });
        
        // Show "Next round ready" text after cleanup
        setTimeout(() => {
            bin.classList.remove('visible');
            progressContainer.classList.remove('visible');
            
            const message = document.createElement('div');
            message.className = 'winner-text';
            message.textContent = 'Next round ready - Select your fighters!';
            document.querySelector('.end-screen-content').appendChild(message);
            setTimeout(() => message.classList.add('visible'), 100);
            
            // Remove cleanup container
            setTimeout(() => cleanupContainer.remove(), 1000);
        }, 5000);
        
        // Clear thrown items array
        thrownItems = [];
    }

    function createCleanupSparkles(x, y) {
        const sparkleCount = 5;
        const container = document.querySelector('.cleanup-container');
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'cleanup-sparkle';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Random sparkle movement
            const angle = (Math.random() * Math.PI * 2);
            const distance = Math.random() * 30 + 10;
            sparkle.style.setProperty('--sparkle-x', `${Math.cos(angle) * distance}px`);
            sparkle.style.setProperty('--sparkle-y', `${Math.sin(angle) * distance}px`);
            
            container.appendChild(sparkle);
            
            // Animate sparkle
            sparkle.style.animation = 'sparkle 0.5s ease-out forwards';
            setTimeout(() => sparkle.remove(), 500);
        }
    }

    function playRandomSound(soundTypes) {
        // Placeholder for sound implementation
        console.log(`Playing sound: ${soundTypes[Math.floor(Math.random() * soundTypes.length)]}`);
    }

    // Fighter movement and positioning functions
    function initializeFighterPositions() {
        const ring = document.querySelector('.ring-circle');
        const ringRect = ring.getBoundingClientRect();
        
        // Position fighters relative to the ring
        const leftFighter = document.querySelector('.fighter-left');
        const rightFighter = document.querySelector('.fighter-right');
        
        // Set initial positions at 25% and 75% of ring width
        leftFighter.style.left = `${ringRect.width * 0.25}px`;
        leftFighter.style.top = `${ringRect.height / 2}px`;
        rightFighter.style.left = `${ringRect.width * 0.75}px`;
        rightFighter.style.top = `${ringRect.height / 2}px`;

        // Add combat stance animation
        leftFighter.classList.add('combat-stance');
        rightFighter.classList.add('combat-stance');
    }

    function moveFighter(fighter, targetX, targetY) {
        const ring = document.querySelector('.ring-circle');
        const ringRect = ring.getBoundingClientRect();
        
        // Convert target coordinates to be relative to ring
        const relativeX = targetX - ringRect.left;
        const relativeY = targetY - ringRect.top;
        
        // Calculate ring center relative to itself
        const ringCenterX = ringRect.width / 2;
        const ringCenterY = ringRect.height / 2;
        
        // Calculate distance from center
        const dx = relativeX - ringCenterX;
        const dy = relativeY - ringCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Adjust max radius based on device
        const maxRadius = (Math.min(ringRect.width, ringRect.height) / 2) * (isMobile ? 0.7 : 0.8);
        
        let finalX = relativeX;
        let finalY = relativeY;
        
        // If outside allowed radius, scale back to maximum radius
        if (distance > maxRadius) {
            const scale = maxRadius / distance;
            finalX = ringCenterX + dx * scale;
            finalY = ringCenterY + dy * scale;
        }
        
        // Add movement class for transition
        fighter.classList.add('moving');
        
        // Determine movement direction and add appropriate animation
        const currentX = parseInt(fighter.style.left) || 0;
        if (Math.abs(finalX - currentX) > 20) {
            fighter.classList.add(finalX > currentX ? 'moving-right' : 'moving-left');
        }
        
        // Add random movement animation (reduced on mobile)
        if (!isMobile || Math.random() < 0.3) {
            const moveAnim = Math.random();
            if (moveAnim < 0.3) {
                fighter.classList.add('bouncing');
            } else if (moveAnim < 0.6) {
                fighter.classList.add('strutting');
            }
        }
        
        // Update position relative to ring
        fighter.style.left = `${finalX}px`;
        fighter.style.top = `${finalY}px`;
        
        // Remove movement classes after animation
        setTimeout(() => {
            fighter.classList.remove('moving', 'moving-left', 'moving-right', 'bouncing', 'strutting');
        }, isMobile ? 300 : 500);
    }

    function getRandomRingPosition() {
        const ring = document.querySelector('.ring-circle');
        const ringRect = ring.getBoundingClientRect();
        
        // Calculate ring center relative to itself
        const ringCenterX = ringRect.width / 2;
        const ringCenterY = ringRect.height / 2;
        
        // Use 80% of the minimum ring dimension for the radius to keep fighters well inside
        const maxRadius = (Math.min(ringRect.width, ringRect.height) / 2) * 0.8;
        
        // Get random angle and distance
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * maxRadius;
        
        // Calculate position relative to ring
        return {
            x: ringCenterX + Math.cos(angle) * distance,
            y: ringCenterY + Math.sin(angle) * distance
        };
    }

    function handleFighterMovement(e) {
        const leftFighter = document.querySelector('.fighter-left');
        const rightFighter = document.querySelector('.fighter-right');
        const moveDistance = 50;

        switch(e.key) {
            // Left fighter controls (WASD)
            case 'w': moveFighter(leftFighter, parseInt(leftFighter.style.left), parseInt(leftFighter.style.top) - moveDistance); break;
            case 's': moveFighter(leftFighter, parseInt(leftFighter.style.left), parseInt(leftFighter.style.top) + moveDistance); break;
            case 'a': moveFighter(leftFighter, parseInt(leftFighter.style.left) - moveDistance, parseInt(leftFighter.style.top)); break;
            case 'd': moveFighter(leftFighter, parseInt(leftFighter.style.left) + moveDistance, parseInt(leftFighter.style.top)); break;
            
            // Right fighter controls (Arrow keys)
            case 'ArrowUp': moveFighter(rightFighter, parseInt(rightFighter.style.left), parseInt(rightFighter.style.top) - moveDistance); break;
            case 'ArrowDown': moveFighter(rightFighter, parseInt(rightFighter.style.left), parseInt(rightFighter.style.top) + moveDistance); break;
            case 'ArrowLeft': moveFighter(rightFighter, parseInt(rightFighter.style.left) - moveDistance, parseInt(rightFighter.style.top)); break;
            case 'ArrowRight': moveFighter(rightFighter, parseInt(rightFighter.style.left) + moveDistance, parseInt(rightFighter.style.top)); break;
        }
    }

    // Add this function to check if a position is within the ring
    function isPositionInRing(x, y) {
        const ring = document.querySelector('.ring-circle');
        const ringRect = ring.getBoundingClientRect();
        
        // Calculate position relative to ring
        const relativeX = x - ringRect.left;
        const relativeY = y - ringRect.top;
        
        // Calculate ring center relative to itself
        const ringCenterX = ringRect.width / 2;
        const ringCenterY = ringRect.height / 2;
        
        // Maximum allowed radius (80% of ring radius)
        const maxRadius = (Math.min(ringRect.width, ringRect.height) / 2) * 0.8;
        
        // Calculate distance from center
        const distance = Math.sqrt(
            Math.pow(relativeX - ringCenterX, 2) + 
            Math.pow(relativeY - ringCenterY, 2)
        );
        
        return distance <= maxRadius;
    }

    // Add touch controls for mobile
    if (isTouchDevice) {
        let touchStartX = 0;
        let touchStartY = 0;
        let activeFighter = null;

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const target = e.target.closest('.fighter');
            
            if (target) {
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                activeFighter = target;
                e.preventDefault(); // Prevent scrolling while dragging
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (activeFighter) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                
                const currentX = parseInt(activeFighter.style.left) || 0;
                const currentY = parseInt(activeFighter.style.top) || 0;
                
                moveFighter(activeFighter, currentX + deltaX, currentY + deltaY);
                
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            activeFighter = null;
        });
    }

    // Add mobile-specific event listeners
    if (isMobile) {
        // Prevent double-tap zoom
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.fighter')) {
                e.preventDefault();
            }
        }, { passive: false });

        // Optimize fighter selection for touch
        fighterCards.forEach(card => {
            card.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent scrolling
                card.click();
            }, { passive: false });
        });

        // Optimize throw buttons for touch
        throwButtons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent scrolling
                button.click();
            }, { passive: false });
        });
    }
}); 