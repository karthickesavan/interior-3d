
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

document.body.innerHTML = "";

document.body.style.cssText = `
  margin: 0;
  overflow: hidden;
  font-family: Arial, sans-serif;
  background: #f2eee5;
`;

const style = document.createElement("style");
style.textContent = `
  #room-ui {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 10;
    color: #fff;
    background: rgba(30, 48, 40, .92);
    padding: 16px;
    border-radius: 12px;
    max-width: 290px;
    box-shadow: 0 4px 18px #0003;
  }
  #room-ui h2 { margin: 0 0 8px; font-size: 19px; }
  #room-ui p { font-size: 12px; line-height: 1.6; margin: 0 0 10px; }
  #room-ui button {
    border: 0; border-radius: 6px; padding: 8px 10px;
    margin: 3px; cursor: pointer; background: #dce6d7;
    color: #24372c;
  }
  #room-ui button:hover { background: #fff; }
`;
document.head.appendChild(style);

const panel = document.createElement("div");
panel.id = "room-ui";
panel.innerHTML = `
  <h2>Sage & Cream</h2>
  <p>3D room concept · 10 ft wide × 12 ft deep × 10 ft high</p>
  <p>Drag to rotate · Scroll to zoom · Right-drag to pan</p>
  <button id="entrance">Entrance view</button>
  <button id="front">TV wall</button>
  <button id="top">Top view</button>
`;
document.body.appendChild(panel);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#e9e7df");

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(8, 7, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 4, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2;
controls.maxDistance = 24;
controls.maxPolarAngle = Math.PI * 0.49;

const sage = new THREE.MeshStandardMaterial({
  color: "#a8b8a0",
  roughness: 0.85
});
const cream = new THREE.MeshStandardMaterial({
  color: "#f2eadb",
  roughness: 0.9
});
const wood = new THREE.MeshStandardMaterial({
  color: "#79563c",
  roughness: 0.65
});
const dark = new THREE.MeshStandardMaterial({
  color: "#252a29",
  roughness: 0.4
});
const marble = new THREE.MeshStandardMaterial({
  color: "#eeeae1",
  roughness: 0.27,
  metalness: 0.02
});

function block(name, size, position, material, cast = true) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    material
  );
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

// Room dimensions: one Three.js unit represents one foot.
block("Marble floor", [10, 0.15, 12], [0, -0.075, 0], marble, false);
block("Back cream wall", [10, 10, 0.15], [0, 5, -6], cream, false);
block("Left sage wall", [0.15, 10, 12], [-5, 5, 0], sage, false);
block("Right sage wall", [0.15, 10, 12], [5, 5, 0], sage, false);
block("Ceiling", [10, 0.15, 12], [0, 10, 0], cream, false);

// Simple decorative ceiling border.
const ceilingTrim = new THREE.MeshStandardMaterial({ color: "#554b40" });
block("Ceiling border front", [10, 0.12, 0.15], [0, 9.88, 5.7], ceilingTrim);
block("Ceiling border back", [10, 0.12, 0.15], [0, 9.88, -5.7], ceilingTrim);
block("Ceiling border left", [0.12, 0.12, 11.4], [-4.94, 9.88, 0], ceilingTrim);
block("Ceiling border right", [0.12, 0.12, 11.4], [4.94, 9.88, 0], ceilingTrim);

// Door: 3 ft wide, approximately 7 ft high.
// Assumed to be on the left side near the entrance.
block("Wooden door", [0.10, 7, 3], [-4.86, 3.5, 3.6], wood);
block("Door frame left", [0.18, 7.25, 0.16], [-4.75, 3.6, 5.13], ceilingTrim);
block("Door frame right", [0.18, 7.25, 0.16], [-4.75, 3.6, 2.07], ceilingTrim);
block("Door frame top", [0.18, 0.18, 3.2], [-4.75, 7.2, 3.6], ceilingTrim);
block("Door handle", [0.12, 0.12, 0.12], [-4.72, 3.2, 2.65], dark);

// TV feature wall and floating console on the back wall.
block("TV backing panel", [6.1, 5.3, 0.12], [0, 5.1, -5.83], sage);
block("TV screen", [4.1, 2.35, 0.13], [0, 5.5, -5.72], dark);
block("TV display", [3.88, 2.13, 0.02], [0, 5.5, -5.64],
  new THREE.MeshStandardMaterial({
    color: "#182725",
    emissive: "#142321",
    emissiveIntensity: 0.3,
    roughness: 0.2
  })
);
block("Floating wooden console", [5.2, 0.38, 1.0], [0, 1.25, -5.1], wood);
block("Console shadow shelf", [5.5, 0.09, 1.05], [0, 0.98, -5.05], dark);

// Small side decorations, kept clear of the entrance.
block("Left accent shelf", [0.8, 0.12, 0.5], [-4.05, 5.2, -2.5], wood);
block("Right accent shelf", [0.8, 0.12, 0.5], [4.05, 5.2, -2.5], wood);

// Ceiling lights.
const lightMaterial = new THREE.MeshStandardMaterial({
  color: "#fff7dc",
  emissive: "#fff1c7",
  emissiveIntensity: 1.5
});

for (const x of [-3.6, 3.6]) {
  const light = new THREE.PointLight("#fff0d5", 85, 18);
  light.position.set(x, 9.4, 1.5);
  light.castShadow = true;
  scene.add(light);

  block("Ceiling light", [0.8, 0.07, 0.5], [x, 9.83, 1.5], lightMaterial, false);
}

scene.add(new THREE.AmbientLight("#ffffff", 1.4));

const sun = new THREE.DirectionalLight("#fff5df", 2.2);
sun.position.set(-4, 9, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

// Floor tile joints for a marble-tile appearance.
const grout = new THREE.MeshStandardMaterial({ color: "#d2cec4" });
for (let x = -4; x <= 4; x += 2) {
  block("Floor grout", [0.018, 0.008, 12], [x, 0.006, 0], grout, false);
}
for (let z = -5; z <= 5; z += 2) {
  block("Floor grout", [10, 0.008, 0.018], [0, 0.006, z], grout, false);
}

// Camera presets.
document.getElementById("entrance").onclick = () => {
  camera.position.set(8, 6, 10);
  controls.target.set(0, 4, 0);
  controls.update();
};
document.getElementById("front").onclick = () => {
  camera.position.set(0, 5, 5);
  controls.target.set(0, 4, -5);
  controls.update();
};
document.getElementById("top").onclick = () => {
  camera.position.set(0, 17, 0.1);
  controls.target.set(0, 0, 0);
  controls.update();
};

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
