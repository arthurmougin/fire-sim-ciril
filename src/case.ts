import * as THREE from 'three';

type Etat = 'sain' | 'en feu' | 'éteint';

class Case {
    x: number;
    y: number;
    etat: Etat;
    mesh: THREE.Mesh;

    constructor(x: number, y: number, scene:THREE.Scene, etat: Etat = 'sain') {
        this.x = x;
        this.y = y;
        this.etat = etat;
        
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: this.getColorByEtat(etat) });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, y, 0);
        
        scene.add( this.mesh );
    }

    private getColorByEtat(etat: Etat): number {
        switch (etat) {
            case 'sain':
                return 0x00ff00;
            case 'en feu':
                return 0xff0000;
            case 'éteint':
                return 0x0000ff;
            default:
                return 0xffffff;
        }
    }

    setEtat(etat: Etat) {
        this.etat = etat;
        (this.mesh.material as THREE.MeshBasicMaterial).color.set(this.getColorByEtat(etat));
    }
}

export default Case;