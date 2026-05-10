// Photo paths
const photos = [];
for (let i = 1; i <= 31; i++) {
    photos.push(`photos/${i}.jpg`);
}

// State
let currentPage = 0;
let totalPhotosFound = 0;
const totalPages = 9;

// Photo distribution per page
const pagePhotos = {
    1: ['photos/18.jpg','photos/19.jpg','photos/20.jpg','photos/21.jpg',],
    2: photos.slice(4, 8),
    3: photos.slice(8, 12),
    4: photos.slice(12, 16),
    5: ['photos/18.jpg','photos/1.jpg','photos/2.jpg','photos/3.jpg',],
    6: ['photos/4.jpg','photos/22.jpg','photos/23.jpg','photos/24.jpg',],
    7: photos.slice(24, 28),
    8: photos.slice(28, 31),
};

// Navigation
function createNav() {
    const nav = document.getElementById('navBar');
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToPage(i);
        nav.appendChild(dot);
    }
}

function goToPage(n) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-dot').forEach(d => d.classList.remove('active'));
    currentPage = n;
    document.getElementById(`page-${n}`).classList.add('active');
    document.querySelectorAll('.nav-dot')[n].classList.add('active');
    initPageIfNeeded(n);
}

function nextPage() { if (currentPage < totalPages - 1) goToPage(currentPage + 1); }
function prevPage() { if (currentPage > 0) goToPage(currentPage - 1); }

// Photo reveal
function showPhoto(src) {
    const reveal = document.getElementById('photoReveal');
    document.getElementById('revealImg').src = src;
    reveal.classList.add('show');
    totalPhotosFound++;
    document.getElementById('photoCount').textContent = totalPhotosFound;
}

function closePhoto() {
    document.getElementById('photoReveal').classList.remove('show');
}

function showSuccess(msg) {
    const el = document.getElementById('successMsg');
    el.textContent = msg;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
}

// === PAGE 1: SNOWFLAKES ===
let snowflakeInited = false;
function initSnowflakes() {
    if (snowflakeInited) return;
    snowflakeInited = true;

    const grid = document.getElementById('snowflakeGrid');
    const pieces = document.getElementById('snowflakePieces');
    let filledCount = 0;

    for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = 'snowflake-slot';
        slot.dataset.index = i;
        slot.innerHTML = '<span style="opacity:0.4">&#10052;</span>';

        slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('highlight'); });
        slot.addEventListener('dragleave', () => { slot.classList.remove('highlight'); });
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('highlight');
            const piece = document.getElementById(e.dataTransfer.getData('text'));
            if (piece && !slot.classList.contains('filled')) {
                slot.classList.add('filled');
                slot.innerHTML = '';
                piece.classList.add('placed');
                filledCount++;
                showPhoto(pagePhotos[1][filledCount - 1]);
                if (filledCount === 4) setTimeout(() => showSuccess('Зимняя сказка открыта!'), 500);
            }
        });
        grid.appendChild(slot);
    }

    const symbols = ['\u2744', '\u2745', '\u2746', '\u273B', '\u2744', '\u2745'];
    symbols.forEach((sym, i) => {
        const piece = document.createElement('div');
        piece.className = 'snowflake-piece';
        piece.id = `snow-${i}`;
        piece.textContent = sym;
        piece.draggable = true;
        piece.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', piece.id));

        // Touch support for drag and drop
        let touchClone = null;
        piece.addEventListener('touchstart', (e) => {
            if (piece.classList.contains('placed')) return;
            e.preventDefault();
            const touch = e.touches[0];
            touchClone = piece.cloneNode(true);
            touchClone.style.position = 'fixed';
            touchClone.style.zIndex = '9999';
            touchClone.style.pointerEvents = 'none';
            touchClone.style.opacity = '0.8';
            touchClone.style.left = (touch.clientX - 25) + 'px';
            touchClone.style.top = (touch.clientY - 25) + 'px';
            document.body.appendChild(touchClone);
        });

        piece.addEventListener('touchmove', (e) => {
            if (!touchClone) return;
            e.preventDefault();
            const touch = e.touches[0];
            touchClone.style.left = (touch.clientX - 25) + 'px';
            touchClone.style.top = (touch.clientY - 25) + 'px';

            // Highlight slots on hover
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            document.querySelectorAll('.snowflake-slot').forEach(s => s.classList.remove('highlight'));
            if (el && el.classList.contains('snowflake-slot')) {
                el.classList.add('highlight');
            }
        });

        piece.addEventListener('touchend', (e) => {
            if (!touchClone) return;
            const touch = e.changedTouches[0];
            if (touchClone) {
                touchClone.remove();
                touchClone = null;
            }
            document.querySelectorAll('.snowflake-slot').forEach(s => s.classList.remove('highlight'));

            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            if (el && el.classList.contains('snowflake-slot') && !el.classList.contains('filled')) {
                el.classList.add('filled');
                el.innerHTML = '';
                piece.classList.add('placed');
                filledCount++;
                showPhoto(pagePhotos[1][filledCount - 1]);
                if (filledCount === 4) setTimeout(() => showSuccess('Зимняя сказка открыта!'), 500);
            }
        });

        pieces.appendChild(piece);
    });

    // Snow particles
    const snowBg = document.getElementById('snowBg');
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('span');
        p.className = 'snow-particle';
        p.textContent = '\u2744';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (4 + Math.random() * 5) + 's';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.fontSize = (0.5 + Math.random() * 1.2) + 'rem';
        snowBg.appendChild(p);
    }
}

// === PAGE 2: TREE CHOPPING ===
let treeInited = false;
function initTree() {
    if (treeInited) return;
    treeInited = true;

    const container = document.getElementById('forestContainer');
    const treesData = [
        { left: '8%', hits: 5 },
        { left: '30%', hits: 4 },
        { left: '52%', hits: 6 },
        { left: '74%', hits: 4 },
    ];

    treesData.forEach((data, i) => {
        const tree = document.createElement('div');
        tree.className = 'tree';
        tree.style.left = data.left;
        tree.style.position = 'absolute';
        tree.style.bottom = '30px';

        let hits = 0;
        const maxHits = data.hits;

        const counter = document.createElement('div');
        counter.className = 'chop-counter';
        counter.textContent = `0 / ${maxHits}`;

        const crown = document.createElement('div');
        crown.className = 'tree-crown';
        // Add some variety to tree sizes
        crown.style.width = (70 + i * 10) + 'px';
        crown.style.height = (100 + i * 15) + 'px';

        const trunk = document.createElement('div');
        trunk.className = 'tree-trunk';

        const photoReveal = document.createElement('div');
        photoReveal.className = 'tree-photo-reveal';
        const img = document.createElement('img');
        img.src = pagePhotos[2][i];
        img.addEventListener('click', (e) => { e.stopPropagation(); showPhoto(pagePhotos[2][i]); });
        photoReveal.appendChild(img);

        tree.appendChild(counter);
        tree.appendChild(crown);
        tree.appendChild(trunk);
        tree.appendChild(photoReveal);

        tree.addEventListener('click', (e) => {
            if (tree.classList.contains('chopped')) return;
            hits++;
            counter.textContent = `${hits} / ${maxHits}`;

            // Shake effect
            tree.style.transform = `translateX(${(Math.random()-0.5)*8}px)`;
            setTimeout(() => tree.style.transform = '', 100);

            // Axe icon effect
            const axe = document.createElement('span');
            axe.className = 'axe-icon';
            axe.textContent = '\u{1FA93}';
            axe.style.left = (e.offsetX || 40) + 'px';
            axe.style.top = (e.offsetY || 60) + 'px';
            tree.appendChild(axe);
            setTimeout(() => axe.remove(), 400);

            // Wood chips
            for (let c = 0; c < 3; c++) {
                const chip = document.createElement('span');
                chip.style.cssText = `
                    position:absolute;
                    left:${40 + Math.random()*20}px;
                    top:${80 + Math.random()*40}px;
                    width:6px;height:6px;
                    background:#8d6e63;
                    border-radius:2px;
                    pointer-events:none;
                    animation: chipFly 0.5s ease forwards;
                `;
                tree.appendChild(chip);
                setTimeout(() => chip.remove(), 600);
            }

            if (hits >= maxHits) {
                tree.classList.add('chopped');
                setTimeout(() => {
                    photoReveal.classList.add('show');
                    totalPhotosFound++;
                    document.getElementById('photoCount').textContent = totalPhotosFound;
                }, 1200);

                if (document.querySelectorAll('.tree.chopped').length === 4) {
                    setTimeout(() => showSuccess('Весь лес повален!'), 1500);
                }
            }
        });

        container.appendChild(tree);
    });

    // Add chip fly animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes chipFly {
            0% { opacity:1; transform: translate(0,0) rotate(0deg); }
            100% { opacity:0; transform: translate(${Math.random()*40-20}px, -${30+Math.random()*20}px) rotate(${Math.random()*360}deg); }
        }
    `;
    document.head.appendChild(style);
}

// === PAGE 3: BUBBLES ===
let bubblesInited = false;
function initBubbles() {
    if (bubblesInited) return;
    bubblesInited = true;

    const container = document.getElementById('bubbleContainer');
    let popped = 0;

    const positions = [
        { x: 10, y: 8, size: 120 },
        { x: 50, y: 5, size: 135 },
        { x: 28, y: 42, size: 115 },
        { x: 62, y: 45, size: 125 },
    ];

    positions.forEach((pos, i) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = pos.x + '%';
        bubble.style.top = pos.y + '%';
        bubble.style.width = pos.size + 'px';
        bubble.style.height = pos.size + 'px';
        bubble.style.animationDelay = (i * 0.7) + 's';

        bubble.addEventListener('click', () => {
            if (bubble.classList.contains('popped')) return;
            bubble.classList.add('popped');
            popped++;

            setTimeout(() => {
                const photo = document.createElement('div');
                photo.className = 'bubble-photo';
                photo.style.left = pos.x + '%';
                photo.style.top = pos.y + '%';
                photo.style.width = pos.size + 'px';
                photo.style.height = pos.size + 'px';

                const img = document.createElement('img');
                img.src = pagePhotos[3][i];
                img.onclick = () => showPhoto(pagePhotos[3][i]);
                photo.appendChild(img);
                container.appendChild(photo);

                setTimeout(() => photo.classList.add('revealed'), 50);
                totalPhotosFound++;
                document.getElementById('photoCount').textContent = totalPhotosFound;
            }, 400);

            if (popped === 4) setTimeout(() => showSuccess('Все пузыри лопнули!'), 800);
        });

        container.appendChild(bubble);
    });

    // Add small decorative bubbles
    for (let i = 0; i < 8; i++) {
        const mini = document.createElement('div');
        mini.style.cssText = `
            position:absolute;
            left:${Math.random()*90}%;
            top:${Math.random()*80}%;
            width:${20+Math.random()*30}px;
            height:${20+Math.random()*30}px;
            border-radius:50%;
            border:1px solid rgba(139,108,199,0.15);
            pointer-events:none;
            animation: float ${3+Math.random()*3}s ease-in-out infinite;
            animation-delay:${Math.random()*3}s;
        `;
        container.appendChild(mini);
    }
}

// === PAGE 4: GIFTS ===
let giftsInited = false;
function initGifts() {
    if (giftsInited) return;
    giftsInited = true;

    const container = document.getElementById('giftsContainer');
    let opened = 0;

    for (let i = 0; i < 4; i++) {
        const box = document.createElement('div');
        box.className = 'gift-box';

        const body = document.createElement('div');
        body.className = 'gift-box-body';

        const ribbonV = document.createElement('div');
        ribbonV.className = 'gift-ribbon-v';
        body.appendChild(ribbonV);

        const ribbonH = document.createElement('div');
        ribbonH.className = 'gift-ribbon-h';
        body.appendChild(ribbonH);

        const lid = document.createElement('div');
        lid.className = 'gift-box-lid';

        const bow = document.createElement('div');
        bow.className = 'gift-bow';

        const photo = document.createElement('div');
        photo.className = 'gift-photo';
        const img = document.createElement('img');
        img.src = pagePhotos[4][i];
        img.onclick = (e) => { e.stopPropagation(); showPhoto(pagePhotos[4][i]); };
        photo.appendChild(img);

        box.appendChild(body);
        box.appendChild(lid);
        box.appendChild(bow);
        box.appendChild(photo);

        box.addEventListener('click', () => {
            if (box.classList.contains('opened')) return;
            box.classList.add('opened');
            opened++;
            totalPhotosFound++;
            document.getElementById('photoCount').textContent = totalPhotosFound;

            // Sparkle particles
            const colors = ['#ffd700', '#ff6b6b', '#5dade2', '#58d68d', '#bb8fce'];
            for (let s = 0; s < 12; s++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'gift-sparkle';
                sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
                sparkle.style.left = '50%';
                sparkle.style.top = '30%';
                sparkle.style.setProperty('--tx', (Math.random() * 120 - 60) + 'px');
                sparkle.style.setProperty('--ty', (Math.random() * 80 - 60) + 'px');
                sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
                box.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
            }

            if (opened === 4) {
                setTimeout(() => showSuccess('Все подарки открыты!'), 800);
            }
        });

        container.appendChild(box);
    }
}

// === PAGE 5: CONSTELLATION (TAURUS) ===
let constellationInited = false;
function initConstellation() {
    if (constellationInited) return;
    constellationInited = true;

    const container = document.getElementById('constellationContainer');
    const canvas = document.getElementById('constellationCanvas');

    // Size canvas
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Taurus constellation - V-shape with horns, positioned in upper area
    // Based on real Taurus star positions (scaled)
    const taurusStars = [
        { x: 0.25, y: 0.18 },  // 1 - left horn tip
        { x: 0.32, y: 0.30 },  // 2 - left horn base
        { x: 0.40, y: 0.38 },  // 3 - forehead left
        { x: 0.50, y: 0.42 },  // 4 - Aldebaran (eye)
        { x: 0.58, y: 0.36 },  // 5 - forehead right
        { x: 0.65, y: 0.28 },  // 6 - right horn base
        { x: 0.72, y: 0.15 },  // 7 - right horn tip
        { x: 0.45, y: 0.55 },  // 8 - chin/face bottom
        { x: 0.38, y: 0.65 },  // 9 - neck
        { x: 0.32, y: 0.75 },  // 10 - shoulder
    ];

    const stars = taurusStars.map(s => ({
        x: Math.round(s.x * w),
        y: Math.round(s.y * h)
    }));

    let nextStar = 0;
    let connected = [];
    let photosShown = 0;

    // Draw background stars
    for (let i = 0; i < 150; i++) {
        const brightness = 0.1 + Math.random() * 0.4;
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // A few slightly colored stars
    for (let i = 0; i < 10; i++) {
        const colors = ['rgba(255,200,150,0.3)', 'rgba(150,200,255,0.3)', 'rgba(255,220,100,0.25)'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Create clickable star elements
    stars.forEach((star, i) => {
        const el = document.createElement('div');
        el.className = 'star-point';
        el.style.left = (star.x - 11) + 'px';
        el.style.top = (star.y - 11) + 'px';
        el.style.animationDelay = (i * 0.25) + 's';
        el.dataset.index = i;

        // Aldebaran (star 4) is bigger and orange-ish
        if (i === 3) {
            el.style.width = '28px';
            el.style.height = '28px';
            el.style.background = 'radial-gradient(circle, #fff, rgba(255,180,100,0.5))';
            el.style.boxShadow = '0 0 15px rgba(255,180,100,0.7)';
            el.style.left = (star.x - 14) + 'px';
            el.style.top = (star.y - 14) + 'px';
        }

        const label = document.createElement('span');
        label.style.cssText = 'position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:0.7rem;color:rgba(255,220,150,0.6);font-family:Caveat;';
        label.textContent = i + 1;
        el.appendChild(label);

        el.addEventListener('click', () => {
            if (parseInt(el.dataset.index) === nextStar) {
                el.classList.add('connected');
                connected.push(stars[nextStar]);

                if (connected.length > 1) {
                    const prev = connected[connected.length - 2];
                    const curr = connected[connected.length - 1];

                    // Glow line
                    ctx.strokeStyle = 'rgba(230, 168, 92, 0.2)';
                    ctx.lineWidth = 8;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);
                    ctx.stroke();

                    // Main line
                    ctx.strokeStyle = 'rgba(230, 168, 92, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);
                    ctx.stroke();
                }

                nextStar++;

                // Photo thresholds at 3, 5, 7, 10 connections
                const thresholds = [3, 5, 7, 10];
                if (photosShown < 4 && nextStar >= thresholds[photosShown]) {
                    showPhoto(pagePhotos[5][photosShown]);
                    photosShown++;
                }

                if (nextStar === stars.length) {
                    showSuccess('Телец зажёгся!');
                }
            }
        });

        container.appendChild(el);
    });
}

// === PAGE 6: MUSIC BOX ===
let musicBoxInited = false;
function initMusicBox() {
    if (musicBoxInited) return;
    musicBoxInited = true;

    const box = document.getElementById('musicBox');
    const crankArm = document.getElementById('crankArm');
    const crankContainer = document.getElementById('crankContainer');
    const turnsDisplay = document.getElementById('musicboxTurns');

    let lastAngle = 0;
    let totalRotation = 0;
    let turns = 0;
    let cranking = false;
    let photosShown = 0;
    const targetTurns = 8;

    crankContainer.addEventListener('mousedown', (e) => { e.preventDefault(); cranking = true; });
    document.addEventListener('mouseup', () => { cranking = false; });

    // Touch support for crank
    crankContainer.addEventListener('touchstart', (e) => { e.preventDefault(); cranking = true; });
    document.addEventListener('touchend', () => { cranking = false; });
    document.addEventListener('touchcancel', () => { cranking = false; });

    function handleCrankMove(clientX, clientY) {
        if (!cranking) return;
        const rect = crankContainer.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);

        let diff = angle - lastAngle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        totalRotation += diff;
        lastAngle = angle;
        crankArm.style.transform = `rotate(${totalRotation}deg)`;

        const newTurns = Math.floor(Math.abs(totalRotation) / 360);
        if (newTurns > turns) {
            turns = newTurns;
            turnsDisplay.textContent = `Повороты: ${Math.min(turns, targetTurns)} / ${targetTurns}`;

            const note = document.createElement('span');
            note.className = 'music-note';
            note.textContent = ['\u266A', '\u266B', '\u266C'][Math.floor(Math.random() * 3)];
            note.style.left = (Math.random() * 200) + 'px';
            note.style.top = '-20px';
            box.appendChild(note);
            setTimeout(() => note.remove(), 2000);

            const thresholds = [2, 4, 6, 8];
            if (photosShown < 4 && turns >= thresholds[photosShown]) {
                showPhoto(pagePhotos[6][photosShown]);
                photosShown++;
            }

            if (turns >= targetTurns) {
                box.classList.add('open');
                showSuccess('Шкатулка открыта!');
            }
        }
    }

    document.addEventListener('mousemove', (e) => { handleCrankMove(e.clientX, e.clientY); });
    document.addEventListener('touchmove', (e) => {
        if (!cranking) return;
        e.preventDefault();
        handleCrankMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
}

// === PAGE 7: FLOWERS ===
let flowersInited = false;
function initFlowers() {
    if (flowersInited) return;
    flowersInited = true;

    const container = document.getElementById('gardenContainer');
    let watered = 0;
    const positions = [12, 32, 52, 72];

    positions.forEach((pos, i) => {
        const pot = document.createElement('div');
        pot.className = 'flower-pot';
        pot.style.left = pos + '%';

        const bloom = document.createElement('div');
        bloom.className = 'flower-bloom';
        const img = document.createElement('img');
        img.src = pagePhotos[7][i];
        img.onclick = (e) => { e.stopPropagation(); showPhoto(pagePhotos[7][i]); };
        bloom.appendChild(img);

        const stem = document.createElement('div');
        stem.className = 'flower-stem';

        const rim = document.createElement('div');
        rim.className = 'pot-rim';

        const base = document.createElement('div');
        base.className = 'pot-base';

        pot.appendChild(bloom);
        pot.appendChild(stem);
        pot.appendChild(rim);
        pot.appendChild(base);

        pot.addEventListener('click', () => {
            if (pot.classList.contains('watered')) return;
            pot.classList.add('watered');
            watered++;
            totalPhotosFound++;
            document.getElementById('photoCount').textContent = totalPhotosFound;

            for (let d = 0; d < 6; d++) {
                const drop = document.createElement('div');
                drop.className = 'water-drop';
                drop.style.position = 'absolute';
                drop.style.left = (pos + Math.random() * 4 - 2) + '%';
                drop.style.top = '40%';
                drop.style.animationDelay = (d * 0.08) + 's';
                container.appendChild(drop);
                setTimeout(() => drop.remove(), 900);
            }

            if (watered === 4) setTimeout(() => showSuccess('Сад расцвёл!'), 1800);
        });

        container.appendChild(pot);
    });

    // Add butterflies
    const butterflies = ['\u{1F98B}', '\u{1F98B}', '\u{1F98B}'];
    butterflies.forEach((b, i) => {
        const el = document.createElement('span');
        el.className = 'butterfly';
        el.textContent = b;
        el.style.left = (20 + i * 25) + '%';
        el.style.top = (10 + i * 12) + '%';
        el.style.animationDelay = (i * 2) + 's';
        el.style.animationDuration = (7 + i * 2) + 's';
        container.appendChild(el);
    });
}

// === PAGE 8: PUZZLE ===
let puzzleInited = false;
function initPuzzle() {
    if (puzzleInited) return;
    puzzleInited = true;

    const container = document.getElementById('puzzleContainer');
    let nextPiece = 0;
    const assignments = [0, 0, 0, 1, 1, 1, 2, 2, 2];
    const rotations = [12, -8, 15, -12, 6, -15, 10, -6, 14];

    for (let i = 0; i < 9; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.setProperty('--rot', rotations[i] + 'deg');
        piece.dataset.order = i;

        const img = document.createElement('img');
        img.src = pagePhotos[8][assignments[i]];
        piece.appendChild(img);

        const num = document.createElement('div');
        num.className = 'puzzle-piece-number';
        num.textContent = i + 1;
        piece.appendChild(num);

        piece.addEventListener('click', () => {
            if (parseInt(piece.dataset.order) === nextPiece) {
                piece.classList.add('revealed');
                nextPiece++;

                if (nextPiece % 3 === 0) {
                    const photoIdx = Math.floor((nextPiece - 1) / 3);
                    showPhoto(pagePhotos[8][photoIdx]);
                }

                if (nextPiece === 9) {
                    setTimeout(() => showSuccess('Альбом завершён!'), 500);
                    setTimeout(() => {
                        document.getElementById('finalMessage').style.opacity = '1';
                        launchConfetti();
                    }, 1500);
                }
            }
        });

        container.appendChild(piece);
    }
}

// Page initialization router
const pageInitFunctions = {
    1: initSnowflakes,
    2: initTree,
    3: initBubbles,
    4: initGifts,
    5: initConstellation,
    6: initMusicBox,
    7: initFlowers,
    8: initPuzzle,
};

function initPageIfNeeded(n) {
    if (pageInitFunctions[n]) pageInitFunctions[n]();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'Escape') closePhoto();
});

document.getElementById('photoReveal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePhoto();
});

// Create intro sparkles
function createIntroSparkles() {
    const container = document.getElementById('introSparkles');
    for (let i = 0; i < 20; i++) {
        const s = document.createElement('div');
        s.className = 'intro-sparkle';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = (Math.random() * 4) + 's';
        s.style.animationDuration = (3 + Math.random() * 3) + 's';
        container.appendChild(s);
    }
}

// Create confetti on puzzle completion
function launchConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#c8874b', '#e6a85c', '#d4667a', '#6bb3d4', '#8b6cc7', '#5ea86b', '#f2a5b3'];
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-5%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.width = (5 + Math.random() * 8) + 'px';
        piece.style.height = (5 + Math.random() * 8) + 'px';
        piece.style.animationDelay = (Math.random() * 1.5) + 's';
        piece.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(piece);
    }
}

// === SWIPE NAVIGATION ===
(function() {
    let swipeStartX = 0;
    let swipeStartY = 0;
    let swiping = false;

    const interactiveSelectors = [
        '.snowflake-piece', '.crank-container', '.crank-arm', '.crank-handle'
    ];

    document.addEventListener('touchstart', (e) => {
        // Don't interfere with interactive elements
        const target = e.target;
        for (const sel of interactiveSelectors) {
            if (target.closest(sel)) return;
        }
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
        swiping = true;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!swiping) return;
        swiping = false;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - swipeStartX;
        const deltaY = touch.clientY - swipeStartY;

        // Only trigger if horizontal swipe is dominant and threshold met
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX < -50) nextPage();
            else if (deltaX > 50) prevPage();
        }
    }, { passive: true });
})();

// Init
createNav();
createIntroSparkles();
