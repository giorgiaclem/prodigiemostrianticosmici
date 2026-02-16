
window.openTab = function (evt, tabName) {
    // Hide all tab content
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("ety-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    // Remove active class from tab buttons
    tablinks = document.getElementsByClassName("ety-tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show current tab and add active class to button
    document.getElementById(tabName).style.display = "block";

    // Add active class to the button that fired the event
    evt.currentTarget.classList.add("active");
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Active State ---
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-link');
    menuItems.forEach(item => {
        if (item.href === currentLocation) item.classList.add('active');
    });


    const canvasID = 'network-canvas';
    const canvas = document.getElementById(canvasID) || document.getElementById('constellation-canvas'); // Fallback for old ID if present

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let nodes = [];

        // Settings
        const nodeCount = 80;
        const connectionDist = 180;
        const mouseDist = 250;

        // Colors from CSS
        const pointColor = '#2c3e50';
        const lineColor = 'rgba(44, 62, 80, 0.15)'; // Very faint lines

        let mouse = { x: null, y: null };

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1; // Varied sizes
                this.originalSize = this.size;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse Interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseDist) {
                        // Gentle attraction/repulsion or just connecting
                        // Let's make nodes grow slightly near mouse
                        const scale = 1 + (mouseDist - distance) / mouseDist;
                        this.size = this.originalSize * scale;
                    } else {
                        this.size = this.originalSize;
                    }
                }
            }

            draw() {
                ctx.fillStyle = pointColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initNodes() {
            nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                nodes.push(new Node());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw lines first (so dots are on top)
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    let dx = nodes[i].x - nodes[j].x;
                    let dy = nodes[i].y - nodes[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDist) {
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1 - (dist / connectionDist);
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x != null) {
                    let dx = nodes[i].x - mouse.x;
                    let dy = nodes[i].y - mouse.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseDist) {
                        ctx.strokeStyle = 'rgba(44, 62, 80, 0.2)';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw nodes
            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
            initNodes();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resize();
        initNodes();
        animate();
    }

    // --- Tarot Flip Logic (Keep existing) ---
    const cards = document.querySelectorAll('.tarot-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // --- New Flip Card Logic (Teoria Page) ---
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });

});
