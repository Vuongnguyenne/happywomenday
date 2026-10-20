document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.getElementById('open-garden');
  const invitation = document.getElementById('invitation');
  const wishSection = document.querySelector('.wish');
  const musicToggle = document.getElementById('music-toggle');
  const musicLabel = document.getElementById('music-label');
  const backgroundMusic = document.getElementById('background-music');
  const musicHint = document.getElementById('music-hint');
  const motionToggle = document.getElementById('motion');
  const motionLabel = document.getElementById('motion-label');
  const replayButton = document.getElementById('replay');

  // Trạng thái sẵn sàng sau 1 giây
  setTimeout(() => {
    if (openButton) {
      openButton.disabled = false;
      invitation.textContent = 'Khu vườn đã sẵn sàng.';
    }
  }, 1000);

  // Hiển thị lời chúc khi nhấn mở khu vườn
  if (openButton) {
    openButton.addEventListener('click', () => {
      document.querySelector('.greeting').style.opacity = '0';
      document.querySelector('.greeting').style.transition = 'opacity 0.8s ease';
      setTimeout(() => {
        document.querySelector('.greeting').style.display = 'none';
        wishSection.classList.add('visible');
        if (replayButton) replayButton.hidden = false;
      }, 800);
    });
  }

  // Quản lý âm thanh
  if (backgroundMusic) {
    backgroundMusic.play().catch(() => {
      if (musicHint) musicHint.hidden = false;
    });

    document.body.addEventListener('click', () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play();
        if (musicHint) musicHint.hidden = true;
        if (musicLabel) musicLabel.textContent = 'Tắt nhạc';
        if (musicToggle) musicToggle.setAttribute('aria-pressed', 'true');
      }
    }, { once: true });
  }

  if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicLabel.textContent = 'Tắt nhạc';
        musicToggle.setAttribute('aria-pressed', 'true');
      } else {
        backgroundMusic.pause();
        musicLabel.textContent = 'Bật nhạc';
        musicToggle.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Quản lý hiệu ứng chuyển động gió
  let motionActive = true;
  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      motionActive = !motionActive;
      motionToggle.setAttribute('aria-pressed', motionActive);
      motionLabel.textContent = motionActive ? 'Gió đang thổi' : 'Đã dừng gió';
    });
  }

  if (replayButton) {
    replayButton.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // Xử lý canvas hiệu ứng đom đóm/hạt bay
  const canvas = document.getElementById('garden-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#ff85a1' : '#a3b1ae',
      speedY: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        if (motionActive) {
          p.y -= p.speedY;
          p.x += p.speedX;
          if (p.y < 0) p.y = height;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  }
});