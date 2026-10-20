(() => {
    'use strict';

    const hero = document.getElementById('home-head');
    if (!hero || document.getElementById('home-stars')) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.id = 'home-stars';
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', '交互星空：移动鼠标产生视差，拖动或使用方向键旋转');
    hero.prepend(canvas);
    hero.classList.add('stars-interactive');

    const background = document.getElementById('home-background');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stars = Array.from({ length: 560 }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 7,
        z: (Math.random() - 0.5) * 4,
        radius: 0.45 + Math.random() ** 3 * 1.6,
        alpha: 0.25 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
    }));

    let width = 1;
    let height = 1;
    let yaw = 0;
    let pitch = 0;
    let rotationX = 0;
    let rotationY = 0;
    let hoverX = 0;
    let hoverY = 0;
    let drag = null;
    let visible = true;
    let frame = 0;
    let previousTime = 0;
    let animationTime = 0;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const active = () => visible && !document.hidden && !motion.matches;

    function draw(time) {
        frame = 0;
        if (!active()) return;
        // Limit work to 30fps, including on high-refresh-rate screens.
        if (previousTime && time - previousTime < 32) {
            frame = requestAnimationFrame(draw);
            return;
        }
        const elapsed = previousTime ? Math.min(time - previousTime, 64) : 33;
        previousTime = time;
        animationTime += elapsed / 1000;
        const easing = 1 - Math.exp(-elapsed / 140);
        yaw += (rotationX + hoverX * 0.12 - yaw) * easing;
        pitch += (rotationY + hoverY * 0.08 - pitch) * easing;

        const angle = yaw + Math.sin(animationTime * 0.06) * 0.025;
        const cy = Math.cos(angle);
        const sy = Math.sin(angle);
        const cx = Math.cos(pitch);
        const sx = Math.sin(pitch);
        const focal = Math.max(width, height) * 0.68;
        context.clearRect(0, 0, width, height);

        for (const star of stars) {
            const x = star.x * cy + star.z * sy;
            const z = -star.x * sy + star.z * cy;
            const y = star.y * cx - z * sx;
            const depth = star.y * sx + z * cx + 6;
            if (depth < 1) continue;
            const scale = focal / depth;
            const px = width / 2 + x * scale;
            const py = height / 2 + y * scale;
            if (px < -10 || px > width + 10 || py < -10 || py > height + 10) continue;
            const radius = star.radius * (6 / depth);
            const twinkle = 0.86 + Math.sin(animationTime * star.speed + star.phase) * 0.14;
            context.fillStyle = `rgba(208,227,255,${star.alpha * twinkle})`;
            context.beginPath();
            context.arc(px, py, radius, 0, Math.PI * 2);
            context.fill();
            if (radius > 1.65) {
                context.fillStyle = `rgba(127,178,255,${0.07 * twinkle})`;
                context.beginPath();
                context.arc(px, py, radius * 3.5, 0, Math.PI * 2);
                context.fill();
            }
        }

        if (background) {
            background.style.transform = `translate(${-hoverX * 12}px, ${-hoverY * 9}px) scale(1.06)`;
        }
        frame = requestAnimationFrame(draw);
    }

    function syncAnimation() {
        if (!active()) {
            cancelAnimationFrame(frame);
            frame = 0;
            previousTime = 0;
        } else if (!frame) {
            frame = requestAnimationFrame(draw);
        }
    }

    new ResizeObserver(() => {
        width = hero.clientWidth;
        height = hero.clientHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        syncAnimation();
    }).observe(hero);

    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncAnimation();
    }).observe(hero);
    document.addEventListener('visibilitychange', syncAnimation);
    motion.addEventListener('change', syncAnimation);

    hero.addEventListener('pointermove', (event) => {
        if (motion.matches) return;
        const bounds = hero.getBoundingClientRect();
        if (event.pointerType === 'mouse') {
            hoverX = clamp((event.clientX - bounds.left) / width * 2 - 1, -1, 1);
            hoverY = clamp((event.clientY - bounds.top) / height * 2 - 1, -1, 1);
        }
        if (drag && drag.id === event.pointerId) {
            rotationX = drag.yaw + (event.clientX - drag.x) * 0.003;
            rotationY = clamp(drag.pitch + (event.clientY - drag.y) * 0.002, -0.5, 0.5);
        }
    }, { passive: true });

    canvas.addEventListener('pointerdown', (event) => {
        if (motion.matches || event.button !== 0) return;
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: rotationX, pitch: rotationY };
        canvas.setPointerCapture(event.pointerId);
    });
    const release = () => { drag = null; };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('lostpointercapture', release);
    hero.addEventListener('pointerleave', () => {
        hoverX = 0;
        hoverY = 0;
    });
    canvas.addEventListener('keydown', (event) => {
        if (motion.matches || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'ArrowLeft') rotationX -= 0.12;
        if (event.key === 'ArrowRight') rotationX += 0.12;
        if (event.key === 'ArrowUp') rotationY = clamp(rotationY - 0.08, -0.5, 0.5);
        if (event.key === 'ArrowDown') rotationY = clamp(rotationY + 0.08, -0.5, 0.5);
    });
})();
