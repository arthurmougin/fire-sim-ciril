import { Group, Object3D, Vector3 } from "three";
import App from "./app.ts";

export enum Etat {
  Sain = 'sain',
  EnFeu = 'en feu',
  Eteint = 'éteint'
}

export class Node {
    x: number;
    y: number;
    etat: Etat;
    oldEtat: Etat;

    root: Group;

    constructor(x: number, y: number, parent : Object3D, etat: Etat = Etat.Sain) {
        this.x = x;
        this.y = y;

        this.root = new Group();
        this.root.position.set(x, Math.random()*-0.5, y);
        this.root.rotateOnAxis(new Vector3(0,1,0),Math.random()*2*Math.PI)
        this.root.scale.set(0.5,0.5,0.5)
        
        this.etat = etat;
        this.SetMeshByEtat(etat)
        this.oldEtat = etat;
        parent.add( this.root );
    }

    /**
     * NOTE on model change,
     * One possible evolution would be to use instanced meshes if perfs becomes a problem.
     */
    private SetMeshByEtat(etat: Etat) {
        console.log(etat)
        if(this.oldEtat ==  etat) return;

        const app = App.getInstance()

        switch (etat) {
            case Etat.Sain:
                app.tree.then(tree => {
                    this.root.children.map(child => child.removeFromParent())
                    this.root.add(tree.scene.clone())
                })


                break; // Vert
            case Etat.EnFeu:
                app.treeOnFire.then(tree => {
                    this.root.children.map(child => child.removeFromParent())
                    this.root.add(tree.scene.clone())
                })

                break; // Rouge
            case Etat.Eteint:
                app.treeWithoutLeaves.then(tree => {
                    this.root.children.map(child => child.removeFromParent())
                    this.root.add(tree.scene.clone())
                })


                break 
            default:
                break;
        }
        this.oldEtat = etat;
    }

    setEtat(etat: Etat) {
        this.etat = etat;
        this.SetMeshByEtat(etat)
    }
}

export default Node;