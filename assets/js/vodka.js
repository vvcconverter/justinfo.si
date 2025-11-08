const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 5; 

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(10, 10); 
document.body.appendChild(renderer.domElement);


renderer.domElement.style.position = 'fixed';
renderer.domElement.style.bottom = '0';
renderer.domElement.style.left = '0';


const geometry = new THREE.BoxGeometry(3, 3, 3); 
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const light = new THREE.AmbientLight(0xffffff); 
scene.add(light);


function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate(); 

window.addEventListener('resize', () => {
    renderer.setSize(10, 10);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
});
