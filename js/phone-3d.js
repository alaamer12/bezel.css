/* Optional rounded-solid builder; geometry remains ordinary pf-* CSS elements. */
(() => {
  function build(solid) {
    const [width, height, radius, depth] = solid.dataset.pfSolid.split(',').map(Number);
    if (![width, height, radius, depth].every(Number.isFinite) ||
        width <= 0 || height <= 0 || depth <= 0 || radius < 0 || radius > Math.min(width, height) / 2) return;
    for (const [key, value] of Object.entries({ width, height, radius, depth })) {
      solid.style.setProperty(`--pf-3d-${key}`, `${value}px`);
    }
    solid.querySelectorAll(':scope > .pf-3d-side').forEach(side => side.remove());
    const points = [];
    const corners = [[width - radius, radius, -90], [width - radius, height - radius, 0],
      [radius, height - radius, 90], [radius, radius, 180]];
    for (const [cx, cy, start] of corners) {
      for (let step = 0; step <= 16; step++) {
        const angle = (start + step * 90 / 16) * Math.PI / 180;
        points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
      }
    }
    points.forEach(([x, y], index) => {
      const [nx, ny] = points[(index + 1) % points.length];
      const length = Math.hypot(nx - x, ny - y);
      if (length < 0.001) return;
      const side = document.createElement('i');
      side.className = 'pf-3d-side';
      side.setAttribute('aria-hidden', 'true');
      Object.assign(side.style, {
        width: `${length + 0.8}px`, height: `${depth}px`,
        left: `${(x + nx - length - 0.8) / 2}px`, top: `${(y + ny - depth) / 2}px`,
        transform: `rotateZ(${Math.atan2(ny - y, nx - x)}rad) rotateX(90deg)`,
      });
      solid.append(side);
    });
  }
  function init(root = document) {
    if (root.matches?.('[data-pf-solid]')) build(root);
    root.querySelectorAll('[data-pf-solid]').forEach(build);
  }
  window.PhoneFrames3D = { init };
  init();
})();