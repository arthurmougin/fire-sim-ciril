import { 
AmbientLight,
    EquirectangularReflectionMapping, 
    LoadingManager, 
    PerspectiveCamera, 
    Scene, 
    WebGLRenderer 
} from "three";
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class App {
    private static instance: App;

    public scene: Scene;
    public camera: PerspectiveCamera;
    public renderer: WebGLRenderer;
    public container: HTMLElement;

    public exrLoader: EXRLoader;
    public gltfLoader: GLTFLoader;
    public treeWithoutLeaves : Promise<GLTF>;
    public treeOnFire : Promise<GLTF>;
    public tree : Promise<GLTF>;

    public skybox : GroundedSkybox;
    public controls: OrbitControls;

    private constructor() {

        const container = document.getElementById("app");
        if (!container) throw new Error("Missing App");
        this.container = container;

        this.scene = new Scene();
        
        this.camera = new PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          1,
          1000,
        );
        this.camera.position.set( - 20, 7, 20 );
        this.camera.lookAt( 0, 4, 0 );

        this.renderer = new WebGLRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setAnimationLoop(this.animate);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enablePan = false;

        this.exrLoader = new EXRLoader();
        const exrTexture = this.exrLoader.load("./DayEnvironmentHDRI021_2K-HDR.exr")
        exrTexture.mapping = EquirectangularReflectionMapping;
        
        this.skybox = new GroundedSkybox( exrTexture, 15, 100 );
        this.skybox.position.y = 15 - 0.01;
        this.scene.add( this.skybox );

        this.gltfLoader = new GLTFLoader(new LoadingManager())
        const urlModel1 = "./tree_with_leaves.gltf"
        const urlModel2 = "./tree.gltf"
        const urlModel3 = "./tree_fire.gltf"
        this.tree = this.gltfLoader.loadAsync(urlModel1)
        this.treeWithoutLeaves = this.gltfLoader.loadAsync(urlModel2)
        this.treeOnFire = this.gltfLoader.loadAsync(urlModel3)
        

        const color = 0xFFFFFF;
        const intensity = 2;
        const light = new AmbientLight(color, intensity);
        this.scene.add(light);

        //resize
        window.addEventListener("resize", () => {
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public animate(): void {

        this.controls.update()        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

export default App;