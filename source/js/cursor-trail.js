(() => {
    'use strict';

    if (document.getElementById('cursor-trail')) return;
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.id = 'cursor-trail';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);

    let particles = [];
    let last = null;
    let frame = 0;
    let previousTime = 0;
    const enabled = () => pointer.matches && !motion.matches && !document.hidden;

    function reset() {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
        last = null;
        particles = [];
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function resize() {
        reset();
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(window.innerWidth * ratio);
        canvas.height = Math.round(window.innerHeight * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(time) {
        frame = 0;
        if (!enabled()) { reset(); return; }
        if (previousTime && time - previousTime < 32) {
            frame = requestAnimationFrame(draw);
            return;
        }
        previousTime = time;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles = particles.filter(particle => time - particle.born < particle.life);

        for (const particle of particles) {
            const age = (time - particle.born) / particle.life;
            const alpha = (1 - age) ** 2;
            const x = particle.x + particle.dx * age;
            const y = particle.y + particle.dy * age;
            const radius = particle.radius * (1 - age * 0.45);
            context.fillStyle = `rgba(118,166,227,${alpha * 0.1})`;
            context.beginPath();
            context.arc(x, y, radius * 3.5, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = `rgba(160,200,247,${alpha * 0.8})`;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
            if (particle.sparkle) {
                context.strokeStyle = `rgba(217,235,255,${alpha * 0.7})`;
                context.lineWidth = 0.65;
                context.beginPath();
                context.moveTo(x - radius * 2.6, y);
                context.lineTo(x + radius * 2.6, y);
                context.moveTo(x, y - radius * 2.6);
                context.lineTo(x, y + radius * 2.6);
                context.stroke();
            }
        }

        // Completely stop rendering once the short trail has faded.
        if (particles.length) frame = requestAnimationFrame(draw);
        else previousTime = 0;
    }

    document.addEventListener('pointermove', (event) => {
        if (!enabled() || event.pointerType !== 'mouse') return;
        const now = performance.now();
        const current = { x: event.clientX, y: event.clientY, time: now };
        if (!last || now - last.time > 120) { last = current; return; }
        const dx = current.x - last.x;
        const dy = current.y - last.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 5) return;
        // Reset after jumps rather than drawing a line across the screen.
        if (distance > 200) { last = current; return; }
        const count = Math.min(8, Math.floor(distance / 5));
        for (let i = 0; i < count; i++) {
            const fraction = i / count;
            particles.push({
                x: last.x + dx * fraction + (Math.random() - 0.5) * 5,
                y: last.y + dy * fraction + (Math.random() - 0.5) * 5,
                dx: (Math.random() - 0.5) * 12 - dx * 0.07,
                dy: (Math.random() - 0.5) * 12 - dy * 0.07,
                radius: 0.6 + Math.random() * 0.9,
                born: now,
                life: 320 + Math.random() * 240,
                sparkle: Math.random() < 0.12,
            });
        }
        if (particles.length > 90) particles.splice(0, particles.length - 90);
        last = current;
        if (!frame) frame = requestAnimationFrame(draw);
    }, { passive: true });

    document.addEventListener('pointerout', event => { if (!event.relatedTarget) reset(); });
    document.addEventListener('visibilitychange', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => { last = null; }, { passive: true });
    motion.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
    resize();
})();
