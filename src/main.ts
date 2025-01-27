import { EquirectangularReflectionMapping, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import Node, { Etat } from "./node.ts";

//#region generic threejs config
const container = document.getElementById("app");

if (!container) throw new Error("Missing App");

const scene: Scene = new Scene();

const camera = new PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  1,
  1000,
);
camera.position.set( - 20, 7, 20 );
camera.lookAt( 0, 4, 0 );

const renderer = new WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setAnimationLoop(animate);
container.appendChild(renderer.domElement);

const exrloader = new EXRLoader();
const exrTexture = exrloader.load("./DayEnvironmentHDRI021_2K-HDR.exr")
exrTexture.mapping = EquirectangularReflectionMapping;

const skybox = new GroundedSkybox( exrTexture, 15, 100 );
skybox.position.y = 15 - 0.01;
scene.add( skybox );

const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

function animate() {
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

//resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

//#endregion

//#region setup logic

//load the config
async function setup() {
  const gridScale = 3;

  const response = await fetch("./config.json");
  const config: {
    p: number;
    l: number;
    h: number;
    fireStarts: [{ x: number; y: number }];
  } = await response.json();
  console.log("cool file", config);

  const parent = new Object3D();
  parent.position.x = (-config.l+1) / 2 * gridScale;
  parent.position.z = gridScale / 2;
  parent.position.z = (-config.h+1) / 2 * gridScale;
  parent.scale.setScalar(gridScale)
  scene.add(parent);

  //spawn the cubes
  const grid: Node[][] = [];
  const burningNodes: Node[] = [];
  for (let x = 0; x < config.l; x++) {
    const row: Node[] = [];
    for (let y = 0; y < config.h; y++) {
      const isOnFire = config.fireStarts.some((start) =>
        start.x === x && start.y === y
      );
      const node = new Node(x, y, parent, isOnFire ? Etat.EnFeu : Etat.Sain);

      row.push(node);

      if (isOnFire) burningNodes.push(node);
    }
    grid.push(row);
  }

  console.log(grid);

  function getNeighbours(ref: Node): Node[] {
    const returnedList: Node[] = [];

    if (grid[ref.x - 1]) {
      const gridX = grid[ref.x - 1];

      if (gridX[ref.y - 1]) returnedList.push(gridX[ref.y - 1]);
      if (gridX[ref.y]) returnedList.push(gridX[ref.y]);
      if (gridX[ref.y + 1]) returnedList.push(gridX[ref.y + 1]);
    }
    if (grid[ref.x + 1]) {
      const gridX = grid[ref.x + 1];

      if (gridX[ref.y - 1]) returnedList.push(gridX[ref.y - 1]);
      if (gridX[ref.y]) returnedList.push(gridX[ref.y]);
      if (gridX[ref.y + 1]) returnedList.push(gridX[ref.y + 1]);
    }
    const gridX = grid[ref.x];

    if (gridX[ref.y - 1]) returnedList.push(gridX[ref.y - 1]);
    if (gridX[ref.y + 1]) returnedList.push(gridX[ref.y + 1]);

    returnedList.forEach((node) => {
      console.log(node.x, node.y);
    });
    return returnedList;
  }

  function gameLoop() {
    const catchingFireNodes: Node[] = [];
    const burnedNodes: Node[] = [];
    console.log(
      `Nombre de bois en feu en debut de tour : ${burningNodes.length}`,
    );
    burningNodes.forEach((node) => {
      const neighbours = getNeighbours(node);
      neighbours.forEach((neighbour) => {
        if (neighbour.etat != Etat.Sain) return;

        const isOnFire: boolean = Math.random() < config.p;
        if (!isOnFire) return;

        neighbour.setEtat(Etat.EnFeu);
        catchingFireNodes.push(neighbour);
      });

      burnedNodes.push(node);
      node.setEtat(Etat.Eteint);
    });

    burningNodes.push(...catchingFireNodes);
    burnedNodes.forEach((burnedNode) => {
      const index = burningNodes.indexOf(burnedNode);
      if (index > -1) {
        burningNodes.splice(index, 1);
      }
    });

    console.log(
      `Nombre de bois en feu en fin de tour : ${burningNodes.length}`,
    );
  }

  function resetFunction(){ 
    burningNodes.length = 0;
    for (let x = 0; x < config.l; x++) {
      for (let y = 0; y < config.h; y++) {
        const isOnFire = config.fireStarts.some((start) =>
          start.x === x && start.y === y
        );
        grid[x][y].setEtat(isOnFire ? Etat.EnFeu : Etat.Sain)
        if (isOnFire) burningNodes.push(grid[x][y]);
      }
    }
  }

  //@ts-ignore Saviez vous que l'on peux référencer un id html en nome de variable ? (a ne pas utiliser dans un contexte pro)
  next.addEventListener("click", () => {
    gameLoop();
  });

  //@ts-ignore même chose
  reset.addEventListener("click", () => {
    resetFunction();
  });
}

setup();

//#endregion
