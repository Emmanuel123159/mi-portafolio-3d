import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';

// 1. Configuración básica de la escena
const scene = new THREE.Scene();

// 2. Configuración de la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;
camera.position.y = 1;

// 3. Configuración del renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Añadir el canvas de Three.js al documento como fondo
const canvas = renderer.domElement;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '-1'; // Detrás del contenido de la página
canvas.style.pointerEvents = 'none'; // Para que no bloquee los clics en la web
document.body.appendChild(canvas);

// 4. Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x38bdf8, 1); // Luz azul claro
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pinkLight = new THREE.DirectionalLight(0x818cf8, 0.8); // Luz morada/rosa
pinkLight.position.set(-5, -5, 2);
scene.add(pinkLight);

// Grupo principal para los modelos (facilita la animación general)
const group = new THREE.Group();
scene.add(group);

// 5. Cubo de prueba (Placeholder hasta tener el modelo 3D real)
const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);

// Material tipo wireframe moderno y brillante
const material = new THREE.MeshStandardMaterial({ 
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.8,
    wireframe: true,
    emissive: 0x0f172a,
    emissiveIntensity: 0.5
});
const cube = new THREE.Mesh(geometry, material);
group.add(cube);

// Para cuando tengas tu modelo GLB, descomenta y adapta esto:
/*
const loader = new GLTFLoader();
loader.load(
    'ruta/a/tu/modelo.glb', // Reemplazar con la ruta real
    function (gltf) {
        // Quitamos el cubo de prueba
        group.remove(cube);
        
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, -1, 0);
        group.add(model);
    },
    undefined,
    function (error) {
        console.error('Error al cargar el modelo 3D:', error);
    }
);
*/

// Partículas flotantes de fondo
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 400;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20; // x, y, z distribuidos
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 6. Interactividad (Movimiento con el mouse y el scroll)
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// 7. Loop de Animación
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotación suave del cubo de prueba
    cube.rotation.x += 0.003;
    cube.rotation.y += 0.005;
    
    // Rotación de las partículas
    particlesMesh.rotation.y = elapsedTime * 0.02;

    // Efecto parallax basado en la posición del ratón
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    group.rotation.y += 0.05 * (targetX - group.rotation.y);
    group.rotation.x += 0.05 * (targetY - group.rotation.x);
    
    // Mover el modelo hacia abajo al hacer scroll
    group.position.y = -scrollY * 0.003;

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();

// 8. Responsividad (Ajustar al redimensionar la ventana)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
