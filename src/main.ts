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

const scene : Scene = new Scene()

const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100)
camera.position.z = 5;

const renderer = new WebGLRenderer()
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setAnimationLoop( animate );
container.appendChild(renderer.domElement)

function animate() {
    gameLoop()
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

//resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

//#endregion 


const geometry = new BoxGeometry( 1, 1, 1 );
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube: Mesh = new Mesh( geometry, material );
scene.add( cube );


function gameLoop(){
    cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}