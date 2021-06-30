import Phaser from 'phaser'

export default class Leaf extends Phaser.GameObjects.Container {
    constructor(scene, x, y){
        super(scene,  x, y )
        this.scene = scene;
        this.x = x
        this.y = y
        this.label = "leaf"
        this.shimmering = false;
        this.dropped = false;

        this.leafSprite = scene.matter.add.sprite( x, y,  'textureSet', 'leaf.png')
        // this.leafTouch =

        scene.add.existing(this).setInteractive();
    }

    shimmer(time){
        let p = 4*Math.abs(Math.cos( time/(4*Math.PI) ))
        if(Phaser.Math.RND.frac() > p){
            const rand = Phaser.Math.RND.frac();
            if( !this.shimmering) {
                this.shimmering = true;
                this.scene.tweens.add({
                    targets: this,
                    rotation: this.rotation + (rand > .5 ? .1 : -.1 ) ,
                    ease : 'Sine.easeInOut',
                    yoyo: true,
                    duration: 50,
                    repeat: 3,
                    onComplete: ()=>this.shimmering = false
                })
                if( rand > .4 ){
                    this.dropSnow()
                }
            }
        }
    }
    dropSnow(){
        for(let i = 0; i<Phaser.Math.RND.between(1, 3); ++i) {
            let newFlake = this.scene.matter.add.sprite( this.x+Phaser.Math.RND.between(20, 28), this.y+Phaser.Math.RND.between(20, 28), 'textureSet', ""+this.scene.flakeKeys[Phaser.Math.Between(1, 5)-1])
                newFlake.label = "flake"
        }


    }

}