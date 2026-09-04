import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '../styles/globals.css'
import App from './App.jsx'
import iconSrc from '../assets/Icon.png'

// Generate gray-lined favicon from Icon.png with thicker strokes
const img = new Image();
img.onload = () => {
  // Use a temp canvas to find the icon's bounding box (trim whitespace)
  const tmp = document.createElement('canvas');
  tmp.width = img.width;
  tmp.height = img.height;
  const tmpCtx = tmp.getContext('2d');
  tmpCtx.drawImage(img, 0, 0);
  const src = tmpCtx.getImageData(0, 0, tmp.width, tmp.height);
  let top = tmp.height, left = tmp.width, bottom = 0, right = 0;
  for (let y = 0; y < tmp.height; y++) {
    for (let x = 0; x < tmp.width; x++) {
      const i = (y * tmp.width + x) * 4;
      if (src.data[i + 3] > 10 && (src.data[i] < 240 || src.data[i + 1] < 240 || src.data[i + 2] < 240)) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  // Draw cropped icon to fill the favicon with small padding
  const size = 64;
  const pad = 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cw = right - left, ch = bottom - top;
  const scale = Math.min((size - pad * 2) / cw, (size - pad * 2) / ch);
  const dw = cw * scale, dh = ch * scale;
  const dx = (size - dw) / 2, dy = (size - dh) / 2;
  ctx.drawImage(img, left, top, cw, ch, dx, dy, dw, dh);
  // Thicken strokes
  ctx.globalAlpha = 0.7;
  ctx.drawImage(img, left, top, cw, ch, dx - 0.5, dy - 0.5, dw + 1, dh + 1);
  ctx.globalAlpha = 1;
  const imageData = ctx.getImageData(0, 0, size, size);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 0) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      if (r < 100 && g < 100 && b < 100) {
        d[i] = 110; d[i + 1] = 110; d[i + 2] = 110;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const link = document.querySelector("link[rel='icon']");
  if (link) link.href = canvas.toDataURL('image/png');
};
img.src = iconSrc;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
