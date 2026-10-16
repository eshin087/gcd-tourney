'use strict';

(async () => {
  const status = document.getElementById('load-status');
  const loadImage = (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Cannot load ${src}`));
    image.src = src;
  });

  try {
    const response = await fetch('diagnostic-anims.json');
    if (!response.ok) throw new Error(`Atlas metadata returned HTTP ${response.status}`);
    const meta = await response.json();
    const [sheet, combat, baseline] = await Promise.all([
      loadImage('diagnostic-sheet.png'),
      loadImage('combat.png'),
      loadImage('approved-idle.png'),
    ]);
    if (meta.frameWidth !== 256 || meta.frameHeight !== 256 || meta.columns !== 16) {
      throw new Error('Unexpected atlas geometry; native comparison stopped.');
    }
    if (combat.naturalWidth !== 256 || combat.naturalHeight !== 256 || baseline.naturalWidth !== 256 || baseline.naturalHeight !== 256) {
      throw new Error('Reference cells must be native 256×256.');
    }

    const players = [];
    for (const section of document.querySelectorAll('.candidate')) {
      const name = section.dataset.animation;
      const version = Number(section.dataset.version);
      const anim = meta.animations[name];
      const auditVersion = meta.scaleAudit?.anims?.[name]?.v;
      if (!anim || auditVersion !== version || anim.frames.length !== anim.durations.length) {
        throw new Error(`Selected ${name} v${version} does not match the exact atlas metadata.`);
      }
      const host = section.querySelector('.player');
      host.innerHTML = `
        <div class="native-row">
          <figure><figcaption>Approved combat v01</figcaption><img src="combat.png" alt="Approved Killua combat reference, native 256 pixels"></figure>
          <figure><figcaption>Shipped approved idle v08, frame 0</figcaption><img src="approved-idle.png" alt="Shipped approved idle frame 0, native 256 pixels"></figure>
          <figure><figcaption>Selected ${name} v${String(version).padStart(2, '0')} — diagnostic</figcaption><canvas width="256" height="256" aria-label="${name} diagnostic frame"></canvas></figure>
        </div>
        <div class="controls">
          <button type="button" data-action="play">Pause</button>
          <button type="button" data-action="previous">Previous frame</button>
          <button type="button" data-action="next">Next frame</button>
          <button type="button" data-action="restart">Restart at frame 0</button>
          <label>Speed <select data-control="speed"><option value="1">1×</option><option value="0.5">½×</option><option value="0.25">¼×</option></select></label>
          <label><input type="checkbox" data-control="loop" checked> Repeat for join review</label>
        </div>
        <p class="frame-status" role="status"></p>`;

      const canvas = host.querySelector('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas playback is unavailable.');
      context.imageSmoothingEnabled = false;
      const playButton = host.querySelector('[data-action="play"]');
      const frameStatus = host.querySelector('.frame-status');
      const loop = host.querySelector('[data-control="loop"]');
      const player = { frame: 0, elapsed: 0, playing: true, speed: 1, anim, loop };

      const draw = () => {
        const id = anim.frames[player.frame];
        const sx = (id % meta.columns) * meta.frameWidth;
        const sy = Math.floor(id / meta.columns) * meta.frameHeight;
        context.clearRect(0, 0, 256, 256);
        context.drawImage(sheet, sx, sy, 256, 256, 0, 0, 256, 256);
        canvas.setAttribute('aria-label', `${name} v${version}, frame ${player.frame} of ${anim.frames.length - 1}`);
        playButton.textContent = player.playing ? 'Pause' : 'Play';
        playButton.setAttribute('aria-pressed', String(player.playing));
        frameStatus.textContent = `Frame ${player.frame} of ${anim.frames.length - 1} · atlas cell ${id} · ${anim.durations[player.frame]} ms · ${player.playing ? 'playing' : 'paused'} · contract loop: ${anim.loop ? 'yes' : 'no'}`;
      };
      const step = (direction) => {
        player.playing = false;
        player.elapsed = 0;
        player.frame = (player.frame + direction + anim.frames.length) % anim.frames.length;
        draw();
      };
      playButton.addEventListener('click', () => {
        player.playing = !player.playing;
        player.elapsed = 0;
        draw();
      });
      host.querySelector('[data-action="previous"]').addEventListener('click', () => step(-1));
      host.querySelector('[data-action="next"]').addEventListener('click', () => step(1));
      host.querySelector('[data-action="restart"]').addEventListener('click', () => {
        player.frame = 0;
        player.elapsed = 0;
        draw();
      });
      host.querySelector('[data-control="speed"]').addEventListener('change', (event) => {
        player.speed = Number(event.target.value);
        player.elapsed = 0;
      });
      player.tick = (delta) => {
        if (!player.playing) return;
        player.elapsed += delta * player.speed;
        let changed = false;
        while (player.elapsed >= anim.durations[player.frame]) {
          player.elapsed -= anim.durations[player.frame];
          if (player.frame === anim.frames.length - 1 && !loop.checked) {
            player.playing = false;
            player.elapsed = 0;
            break;
          }
          player.frame = (player.frame + 1) % anim.frames.length;
          changed = true;
        }
        if (changed || !player.playing) draw();
      };
      players.push(player);
      draw();
    }
    status.textContent = 'Loaded exact diagnostic atlas: idle11, guard09, superDash08, stagger07 and win05. All remain HOLD.';
    let lastTime;
    const tick = (time) => {
      const delta = lastTime === undefined ? 0 : Math.min(time - lastTime, 250);
      lastTime = time;
      for (const player of players) player.tick(delta);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  } catch (error) {
    status.classList.add('error');
    status.textContent = `Playback unavailable: ${error.message}. Use the exact atlas and source links; no substitute animation is shown.`;
  }
})();
