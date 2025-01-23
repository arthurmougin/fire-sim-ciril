import { 
    Scene,
    PerspectiveCamera, 
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three'

//#region generic threejs config
const container = document.getElementById("app")

if(!container) throw new Error('Missing App');

const scene = new Scene()

const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100)
camera.position.z = 2

const renderer = new WebGLRenderer()
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setAnimationLoop( animate );
container.appendChild(renderer.domElement)

const geometry = new BoxGeometry( 1, 1, 1 );
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

//resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

function animate() {
    cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );