import * as THREE from 'three';

export enum Etat {
  Sain = 'sain',
  EnFeu = 'en feu',
  Eteint = 'éteint'
}

export class Node {
    x: number;
    y: number;
    etat: Etat;
    mesh: THREE.Mesh;

    constructor(x: number, y: number, parent : THREE.Object3D, etat: Etat = Etat.Sain) {
        this.x = x;
        this.y = y;
        this.etat = etat;
        
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: this.getColorByEtat(etat) });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.position.set(x, 0, y);
        
        parent.add( this.mesh );
    }

    private getColorByEtat(etat: Etat): number {
        switch (etat) {
            case Etat.Sain:
                return 0x00ff00; // Vert
            case Etat.EnFeu:
                return 0xff0000; // Rouge
            case Etat.Eteint:
                return 0x0000ff; // Bleu
            default:
                return 0xffffff; // Blanc
        }
    }

    setEtat(etat: Etat) {
        this.etat = etat;
        (this.mesh.material as THREE.MeshBasicMaterial).color.set(this.getColorByEtat(etat));
    }
}

export default Node;