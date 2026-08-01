(() => {
  const modal = document.getElementById("pong-modal");
  const canvas = document.getElementById("pong-canvas");
  const pauseBtn = document.getElementById("pong-pause");
  if (!modal || !canvas || !pauseBtn) return;

  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const state = {
    running: false,
    paused: false,
    raf: 0,
    scoreL: 0,
    scoreR: 0,
  };

  const keys = new Set();
  const paddle = { w: 12, h: 72, speed: 6.4 };
  const ballR = 5;

  let left = { x: 28, y: H / 2 - paddle.h / 2 };
  let right = { x: W - 28 - paddle.w, y: H / 2 - paddle.h / 2 };
  let ball = { x: W / 2, y: H / 2, vx: 0, vy: 0 };

  function resetBall(direction = Math.random() > 0.5 ? 1 : -1) {
    ball.x = W / 2;
    ball.y = H / 2;
    const angle = (Math.random() * 0.65 - 0.325) * Math.PI;
    const speed = 5.1;
    ball.vx = Math.cos(angle) * speed * direction;
    ball.vy = Math.sin(angle) * speed;
  }

  function resetMatch() {
    state.scoreL = 0;
    state.scoreR = 0;
    left.y = H / 2 - paddle.h / 2;
    right.y = H / 2 - paddle.h / 2;
    state.paused = false;
    pauseBtn.textContent = "PAUSE";
    resetBall(1);
  }

  function clampPaddle(p) {
    p.y = Math.max(14, Math.min(H - 14 - paddle.h, p.y));
  }

  function hitPaddle(side) {
    const p = side === "left" ? left : right;
    return (
      ball.x - ballR < p.x + paddle.w &&
      ball.x + ballR > p.x &&
      ball.y > p.y &&
      ball.y < p.y + paddle.h
    );
  }

  function update() {
    if (state.paused) return;

    if (keys.has("ArrowUp") || keys.has("KeyW")) left.y -= paddle.speed;
    if (keys.has("ArrowDown") || keys.has("KeyS")) left.y += paddle.speed;
    clampPaddle(left);

    const target = ball.y - paddle.h / 2;
    const aiError = (Math.random() - 0.5) * 18;
    const aiSpeed = paddle.speed * 0.78;
    const diff = target + aiError - right.y;
    right.y += Math.max(-aiSpeed, Math.min(aiSpeed, diff * 0.12));
    clampPaddle(right);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ballR < 14 || ball.y + ballR > H - 14) {
      ball.vy *= -1;
      ball.y = Math.max(14 + ballR, Math.min(H - 14 - ballR, ball.y));
    }

    if (ball.vx < 0 && hitPaddle("left")) {
      ball.vx = Math.abs(ball.vx) * 1.04;
      const offset = (ball.y - (left.y + paddle.h / 2)) / (paddle.h / 2);
      ball.vy = offset * 5.2;
      ball.x = left.x + paddle.w + ballR;
    }

    if (ball.vx > 0 && hitPaddle("right")) {
      ball.vx = -Math.abs(ball.vx) * 1.04;
      const offset = (ball.y - (right.y + paddle.h / 2)) / (paddle.h / 2);
      ball.vy = offset * 5.2;
      ball.x = right.x - ballR;
    }

    const maxSpeed = 11;
    ball.vx = Math.max(-maxSpeed, Math.min(maxSpeed, ball.vx));
    ball.vy = Math.max(-maxSpeed, Math.min(maxSpeed, ball.vy));

    if (ball.x < -20) {
      state.scoreR += 1;
      resetBall(1);
    } else if (ball.x > W + 20) {
      state.scoreL += 1;
      resetBall(-1);
    }
  }

  function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(W - 10, 10);
    ctx.moveTo(10, H - 10);
    ctx.lineTo(W - 10, H - 10);
    ctx.stroke();

    ctx.setLineDash([10, 12]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2, 18);
    ctx.lineTo(W / 2, H - 18);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(state.scoreL), W / 2 - 54, 58);
    ctx.fillRect(W / 2 - 4, 38, 8, 8);
    ctx.fillText(String(state.scoreR), W / 2 + 54, 58);

    ctx.fillRect(left.x, left.y, paddle.w, paddle.h);
    ctx.fillRect(right.x, right.y, paddle.w, paddle.h);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballR, 0, Math.PI * 2);
    ctx.fill();

    if (state.paused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#8be9fd";
      ctx.font = "bold 28px 'JetBrains Mono', monospace";
      ctx.fillText("PAUSE", W / 2, H / 2);
    }
  }

  function loop() {
    if (!state.running) return;
    update();
    draw();
    state.raf = requestAnimationFrame(loop);
  }

  function openPong() {
    modal.hidden = false;
    document.body.classList.add("pong-open");
    resetMatch();
    state.running = true;
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(loop);
    pauseBtn.focus({ preventScroll: true });
  }

  function closePong() {
    state.running = false;
    cancelAnimationFrame(state.raf);
    modal.hidden = true;
    document.body.classList.remove("pong-open");
    keys.clear();
  }

  function togglePause() {
    if (!state.running) return;
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? "RESUME" : "PAUSE";
  }

  window.PongGame = { open: openPong, close: closePong };

  pauseBtn.addEventListener("click", togglePause);

  modal.querySelectorAll("[data-pong-close]").forEach((el) => {
    el.addEventListener("click", closePong);
  });

  window.addEventListener("keydown", (event) => {
    if (modal.hidden) return;

    if (event.code === "Escape") {
      event.preventDefault();
      closePong();
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      togglePause();
      return;
    }

    if (["ArrowUp", "ArrowDown", "KeyW", "KeyS"].includes(event.code)) {
      event.preventDefault();
      keys.add(event.code);
    }
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
  });

  canvas.addEventListener(
    "pointermove",
    (event) => {
      if (modal.hidden || state.paused) return;
      const rect = canvas.getBoundingClientRect();
      const scale = H / rect.height;
      left.y = (event.clientY - rect.top) * scale - paddle.h / 2;
      clampPaddle(left);
    },
    { passive: true }
  );
})();
