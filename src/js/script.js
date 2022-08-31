const {
  dat: { GUI },
} = window;
const gui = new GUI();

const getCSSProp = (element, propName) =>
  getComputedStyle(element).getPropertyValue(propName);

const elFactory = (type, attributes, ...children) => {
  const el = document.createElement(type);

  for (key in attributes) {
    el.setAttribute(key, attributes[key]);
  }

  children.forEach((child) => {
    if (typeof child === 'string')
      el.appendChild(document.createTextNode(child));
    else el.appendChild(child);
  });

  return el;
};

const deleteAnimatedNode = (el) => {
  el.addEventListener(
    'animationend',
    () => {
      el.removeEventListener('animationend', this);
      el.remove();
    },
    true
  );
};

const blendModes = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const root = document.documentElement;
  const wFrame = getCSSProp(root, '--w-frame');
  const hFrame = getCSSProp(root, '--h-frame');
  const radius = getCSSProp(root, '--radius');
  const blurStart = getCSSProp(root, '--blur-start');
  const blurEnd = getCSSProp(root, '--blur-end');
  const scaleEnd = getCSSProp(root, '--scale-end');
  const imgBlendMode = getCSSProp(root, '--img-blend-mode').trim();
  const frameBlendMode = getCSSProp(root, '--frame-blend-mode').trim();

  const CONFIG = {
    '--w-frame': +wFrame,
    '--h-frame': +hFrame,
    '--radius': +radius,
    '--blur-start': +blurStart,
    '--blur-end': +blurEnd,
    '--scale-end': +scaleEnd,
    '--img-color': 'rgba(255,255,255,0.5)',
    '--frame-color': 'rgba(255, 255, 255, 0.3)',
    '--img-blend-mode': imgBlendMode,
    '--frame-blend-mode': frameBlendMode,
  };

  for (const key of Object.keys(CONFIG)) {
    root.style.setProperty(`${key}`, CONFIG[key]);
  }

  const update = (target, link) => (value) => {
    root.style.setProperty(`${target}`, value);
    if (CONFIG.linked && link) {
      CONFIG[link] = value;
      root.style.setProperty(`${link}`, value);
      gui.updateDisplay();
    }
  };

  gui.add(CONFIG, '--w-frame', 5, 200).onChange(update('--w-frame'));
  gui.add(CONFIG, '--h-frame', 5, 200).onChange(update('--h-frame'));

  const cursor = gui.addFolder('Cursor');
  cursor.add(CONFIG, '--radius', 0, 50).onChange(update('--radius'));
  cursor.add(CONFIG, '--blur-start', 0, 20).onChange(update('--blur-start'));
  cursor.add(CONFIG, '--blur-end', 0, 20).onChange(update('--blur-end'));
  cursor.add(CONFIG, '--scale-end', 0, 1, 0.1).onChange(update('--scale-end'));
  cursor
    .addColor(CONFIG, '--frame-color', 'rgba(255, 255, 255, 0.3)')
    .onChange(update('--frame-color'));
  cursor
    .add(CONFIG, '--frame-blend-mode', blendModes)
    .onChange(update('--frame-blend-mode'));

  const image = gui.addFolder('Image');
  image
    .addColor(CONFIG, '--img-color', 'rgba(255,255,255,0.5)')
    .onChange(update('--img-color'));
  image
    .add(CONFIG, '--img-blend-mode', blendModes)
    .onChange(update('--img-blend-mode'));

  const handlerMousemove = (event) => {
    const [x, y] = [Math.floor(event.clientX), Math.floor(event.clientY)];
    const el = elFactory('span', {
      class: `circle`,
      style: `--x: ${x - CONFIG['--w-frame'] / 2}px; --y: ${
        y - CONFIG['--h-frame'] / 2
      }px`,
    });
    body.appendChild(el);
    deleteAnimatedNode(el);
  };

  document.addEventListener('mousemove', handlerMousemove);
});
