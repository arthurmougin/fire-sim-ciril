import { 
    Scene,
    PerspectiveCamera, 
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Case from "./case.ts";

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

const controls:OrbitControls = new OrbitControls(camera, renderer.domElement )
controls.enablePan = false;

function animate() {
    gameLoop()
	controls.update();
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


//#region setup logic

//load the config

const response = await fetch("/config.json");
const file : {
    p:number,
    l:number,
    h:number,
    fireStarts: [{x:number,y:number}]
} = await response.json();
console.log("cool file", file);

//spawn the cubes
const grid: Case[][] = [];

for (let y = 0; y < file.h; y++) {
    const row : Case[]= [];
    for (let x = 0; x < file.l; x++) {
        const isOnFire = file.fireStarts.some(start => start.x === x && start.y === y);
        const recenteredX = x - (file.l/2)
        const recenteredY = y - (file.h/2)
        row.push(new Case(recenteredX,recenteredY, scene, isOnFire ? 'en feu' : 'sain'));
    }
    grid.push(row);
}

console.log(grid);

//#endregion



function gameLoop(){
    
}