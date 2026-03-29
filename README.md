# Colorful Particle Background
A premium, performant particle connection background implementation using HTML5 Canvas and Vanilla JavaScript.

## 專案簡介
這是一個使用 HTML5 Canvas 和純 JavaScript (Vanilla JS) 實作的高級粒子連線背景。它具有流暢的動畫、多彩的視覺效果以及生動的滑鼠互動感。

### 主要功能
- **多彩粒子**：隨機生成的鮮艷粒子（橘、綠、藍、紫、粉、黃、青），視覺效果豐富。
- **動態連線**：粒子間在一定距離內會自動建立連線，透明度隨距離變化。
- **發光效果 (Glow)**：粒子與連線均具備微妙的發光特效，在深色背景下特別出色。
- **滑鼠互動**：
  - **排斥效果 (Repel)**：滑鼠會將周圍的粒子彈開。
  - **動態偵測**：滑鼠也會與鄰近粒子產生互動連線。
- **效能優化**：使用 `requestAnimationFrame` 確保畫面的極致流暢。
- **響應式支援**：自動適應視窗大小調整粒子分佈。

### 如何使用
1. 將本專案下載至本地。
2. 直接在瀏覽器中打開 `index.html`。
3. 您可以透過修改 `script.js` 中的常量（如 `particlesCount`, `connectionDistance`）來調整視覺效果。

## 開發者資訊
由 Antigravity 實作，作為網頁動態背景解決方案。

## 授權條款 (License)
本專案遵循 [MIT License](LICENSE)。
