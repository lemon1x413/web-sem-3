document.addEventListener('DOMContentLoaded', () => {
    const workArea = document.getElementById('work');
    const animArea = document.getElementById('anim');
    const ball = document.getElementById('ball');
    const msgBox = document.getElementById('messages');

    const btnPlay = document.getElementById('btnPlay');
    const btnClose = document.getElementById('btnClose');
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');
    const btnReload = document.getElementById('btnReload');

    const resultsBlock = document.getElementById('resultsBlock');
    const mainImg = document.getElementById('mainImg');
    const tableContainer = document.getElementById('logsTableContainer');

    let animId;
    let isRunning = false;
    let x, y, dx, dy;
    let ballRadius = 15;
    let eventCounter = 0;

    btnPlay.addEventListener('click', () => {
        workArea.style.display = 'flex';
        localStorage.setItem('animEvents', JSON.stringify([]));
        fetch('server.php', { method: 'DELETE' });
        eventCounter = 0;
        resetBall();
    });

    btnClose.addEventListener('click', () => {
        workArea.style.display = 'none';
        stopAnimation();
        showResults();
    });

    btnStart.addEventListener('click', () => {
        btnStart.style.display = 'none';
        btnStop.style.display = 'inline-block';

        if (!ball.style.display || ball.style.display === 'none') {
            initBall();
        }

        startAnimation();
        logEvent('Button START clicked');
    });

    btnStop.addEventListener('click', () => {
        btnStop.style.display = 'none';
        btnStart.style.display = 'inline-block';
        stopAnimation();
        logEvent('Button STOP clicked');
    });

    btnReload.addEventListener('click', () => {
        btnReload.style.display = 'none';
        btnStart.style.display = 'inline-block';
        resetBall();
        logEvent('Button RELOAD clicked');
    });

    function initBall() {
        const width = animArea.clientWidth;
        const height = animArea.clientHeight;

        x = Math.random() * (width - 2 * ballRadius);
        y = height - 2 * ballRadius;

        const speed = 3;
        dx = (Math.random() - 0.5) * speed * 2;
        dy = -1 * Math.abs(speed);

        updateBallView();
        ball.style.display = 'block';
    }

    function resetBall() {
        stopAnimation();
        ball.style.display = 'none';
        btnReload.style.display = 'none';
        btnStart.style.display = 'inline-block';
        btnStop.style.display = 'none';
    }

    function startAnimation() {
        if (!isRunning) {
            isRunning = true;
            loop();
        }
    }

    function stopAnimation() {
        isRunning = false;
        cancelAnimationFrame(animId);
    }

    function loop() {
        if (!isRunning) return;

        x += dx;
        y += dy;

        const width = animArea.clientWidth;

        let bounced = false;

        if (x <= 0 || x + 2 * ballRadius >= width) {
            dx = -dx;
            bounced = true;
            logEvent('Bounce Wall');
        }

        if (y < -2 * ballRadius) {
            stopAnimation();
            ball.style.display = 'none';
            btnStop.style.display = 'none';
            btnReload.style.display = 'inline-block';
            logEvent('Ball Exited');
            return;
        }

        updateBallView();
        animId = requestAnimationFrame(loop);
    }

    function updateBallView() {
        ball.style.left = x + 'px';
        ball.style.top = y + 'px';
    }

    function logEvent(text) {
        eventCounter++;
        const now = new Date();
        const timeString = now.toISOString();

        msgBox.textContent = `${eventCounter}. ${text}`;

        const eventData = {
            id: eventCounter,
            text: text,
            clientTime: timeString
        };

        sendToServerImmediate(eventData);

        saveToLocalStorage(eventData);
    }

    function sendToServerImmediate(data) {
        fetch('server.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: 'immediate',
                ...data
            })
        }).catch(err => console.error('Server error:', err));
    }

    function saveToLocalStorage(data) {
        let events = JSON.parse(localStorage.getItem('animEvents') || '[]');
        data.lsSaveTime = new Date().toISOString();
        events.push(data);
        localStorage.setItem('animEvents', JSON.stringify(events));
    }

    async function showResults() {
        mainImg.style.display = 'none';
        tableContainer.style.display = 'block';

        const localData = JSON.parse(localStorage.getItem('animEvents') || '[]');

        let serverData = [];
        try {
            const response = await fetch('server.php');
            serverData = await response.json();
        } catch (e) {
            console.error("Error fetching server logs", e);
        }

        let html = `<table class="log-table">
            <thead>
                <tr>
                    <th colspan="3">LocalStorage Data</th>
                    <th colspan="3">Server Data (Immediate)</th>
                </tr>
                <tr>
                    <th>ID</th><th>Event</th><th>LS Time</th>
                    <th>ID</th><th>Event</th><th>Server Time</th>
                </tr>
            </thead>
            <tbody>`;

        const count = Math.max(localData.length, serverData.length);

        for (let i = 0; i < count; i++) {
            const l = localData[i] || {};
            const s = serverData[i] || {};

            const lTime = l.lsSaveTime ? l.lsSaveTime.split('T')[1].slice(0, -1) : '-';
            const sTime = s.serverTime ? s.serverTime.split(' ')[1] : '-';

            html += `<tr>
                <td>${l.id || '-'}</td>
                <td>${l.text || '-'}</td>
                <td>${lTime}</td>
                <td>${s.id || '-'}</td>
                <td>${s.text || '-'}</td>
                <td>${sTime}</td>
            </tr>`;
        }

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;

        console.log("Порівняння завершено. Перевірте таблицю на розбіжності часу.");
    }
});