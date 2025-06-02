# 🌴 Floating Island Showcase

An interactive 3D website built with **Next.js**, **TypeScript**, and **Three.js** that showcases a floating island scene. Users can explore the island with camera controls, interact with 3D objects, and experience smooth animations—all rendered directly in the browser.

---

## 🚀 Tech Stack

| Technology         | Purpose                                   |
|--------------------|-------------------------------------------|
| [Next.js](https://nextjs.org/)         | React-based framework for the web                |
| [TypeScript](https://www.typescriptlang.org/)     | Type-safe JavaScript                            |
| [pnpm](https://pnpm.io/)               | Fast and disk-efficient package manager          |
| [Three.js](https://threejs.org/)       | WebGL-powered 3D engine                          |
| [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) | React renderer for Three.js                     |
| [@react-three/drei](https://github.com/pmndrs/drei) | Useful helpers for common 3D tasks               |
| [GSAP](https://gsap.com/)             | Smooth animations for floating/island motion     |
| [Leva](https://github.com/pmndrs/leva) _(optional)_ | Live tweak controls for debugging lighting/positions |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework                      |

---

## 🏝️ Project Features

### 1. Floating 3D Island Scene
- A floating island model rendered using Three.js (can use placeholder or `.glb` file).
- Environmental lighting using a **Directional Light** (sunlight) and **Ambient Light** (global fill).

### 2. 3D Models on the Island
- Load `.glb` models using `useGLTF` from `@react-three/drei`:
  - A house or temple
  - Trees or foliage
  - Optional: Waterfall or animated stream

### 3. Camera Controls
- Interactive orbit using `OrbitControls` from `drei`.
- Optional idle camera animation with **gsap** for cinematic feel.

### 4. Animations
- Subtle floating/bobbing motion of the island using **gsap** or `react-spring`.
- Optional rotating clouds or background objects.

### 5. Interactivity with Raycasting
- Use raycasting to detect user clicks or hovers on 3D models.
- Display floating labels or HTML popups with additional information.

### 6. Responsive UI
- Tailwind CSS for styling
- Mobile-friendly layout and touch interactions

---

## 🛠️ Getting Started

### 1. Project Setup

```bash
pnpm create next-app@latest floating-island-showcase --ts --app
cd floating-island-showcase
