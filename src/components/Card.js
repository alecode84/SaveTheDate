import Phaser from "phaser";

export default class Card extends Phaser.GameObjects.Container {


    constructor (scene, x, y, children) {
        super(scene, x, y, children);

        this.bgFrame = this.scene.add.image( 0,  0  , 'frameImg');
        this.saveText =  this.scene.add.image( 0, 0, 'saveText' );


        this.add( this.saveText )
        this.add( this.bgFrame );

        this.scene.add.existing(this);



        // this.leafPath = new Phaser.Curves.Path(  leafX, leafY );
        // this.leafPath.cubicBezierTo(-393, -313, 471, -7, 659, -828);
        // this.leafPath.cubicBezierTo( 411, -145,	-565, -186,	15,	89);
        // this.leafPath.cubicBezierTo(-357, 29, 705, -283, 201, 161 );
        // this.leafPath.cubicBezierTo( 405, 239, -663, 5,	183,263);
        // this.leafPath.cubicBezierTo( -39, 461, 693, 221, 51, 479 );


        // this.saveText.setInteractive()
        // this.saveText.on( 'pointerdown', this.zoom );
    }

    create (){
        //
        // this.saveText =
        // this.leafImage.setDepth( 1 )
        // // this.leafImage.rotation = -.84
        // let leaf = new Leaf(  this, this.cameras.main.centerX - (70*newScale), (189*newScale)  )
        // this.add.existing( leaf )
        // leaf.rotation = -.84
        //
        // this.leafPath = new Phaser.Curves.Path(this.cameras.main.centerX - (70*newScale), (189*newScale));
        // this.leafPath.cubicBezierTo(this.cameras.main.centerX-(154*newScale),(234*newScale),this.cameras.main.centerX + (164*newScale),252*newScale, this.cameras.main.centerX +	(164*newScale), 252*newScale );

        // this.leafPath.cubicBezierTo(this.cameras.main.centerX+ 164,	this.cameras.main.centerY-252,this.cameras.main.centerX+776,	this.cameras.main.centerY-132, this.cameras.main.centerX+452, this.cameras.main.centerY + 36)
        // this.leafPath.cubicBezierTo( -9.82	171.98	-571.49	528.78	-315	114 )
        // this.leafPath.cubicBezierTo( 89.91	-3.22	99.12	335.31	465	384 );
        // this.leafPath.cubicBezierTo( 519	732	-531	336	-405	576)
        // this.leafPath.cubicBezierTo( -394.42	583.78	33.58	609.56	87	665 )


        // this.leafPath.cubicBezierTo(



        // this.leafPath.cubicBezierTo(this.cameras.main.centerX - 246, 627.00, 222.00, 489.00, 516.00, 729.00);
        // this.leafPath.cubicBezierTo(813.00,603.00, 1425.00,723.00, 1101.00,891.00);
        // this.leafPath.cubicBezierTo(984.00,705.00, 1302.00,1635.00, 882.00,1275.00)
        // this.leafPath.cubicBezierTo(462.00,915.00, 684.00,1173.00, 276.00,1389.00);
        // this.leafPath.cubicBezierTo(900.00,1845.00, 1716.00,1425.00, 468.00,1437.00);
        //
        // let leafGraphic = this.add.graphics();
        // leafGraphic.clear();
        // leafGraphic.lineStyle(2, 0xffffff, 1);
        //
        // this.leafPath.draw(leafGraphic );
        //
        //
        //
        //
        //
        //
        // let pinch = this.rexGestures.add.pinch({});
        //
        // let camera = this.cameras.main;
        // pinch.on('pinch', function (pinch) {
        //         let scaleFactor = pinch.scaleFactor;
        //         camera.zoom *= scaleFactor;
        //     }, this)
        //
        // this.bgFrame.setScale(newScale);
        // this.saveText.setScale(newScale);
        //
        // leaf.setScale( newScale )
        // this.saveText.setInteractive()
        // this.saveText.on( 'pointerdown', this.zoom );
    }
    update (time, delta) {

    }
    // zoom( e ){
    //
    //     // this.scene.children.list[0].leaf.startFollow(
    //     //     {
    //     //         duration: 6000,
    //     //         positionOnPath: false,
    //     //         repeat: 0,
    //     //         ease: function(v) {
    //     //             console.log( v )
    //     //             return v;
    //     //         }
    //     //     }
    //     // );
    //
    //     // this.scene.tweens.add({
    //     //     targets: this.scene.children.list[0].leaf,
    //     //     scale: this.scene.children.list[0].bgFrame.scale * 2.15,
    //     //     //alpha: 0,
    //     //     ease : 'Sine.easeInOut',
    //     //     duration: 2000
    //     // })
    //     // this.scene.tweens.add({
    //     //     targets: this.scene.children.list[0].bgFrame,
    //     //     scale: this.scene.children.list[0].bgFrame.scale * 2.15,
    //     //     //alpha: 0,
    //     //     ease : 'Sine.easeInOut',
    //     //     duration: 2000
    //     // })
    // }

    // zoom( e ){
    //     this.scene.tweens.add({
    //         targets: this.scene.bgFrame,
    //         scale: this.scene.bgFrame.scale * 2.15,
    //         //alpha: 0,
    //         ease : 'Sine.easeInOut',
    //         duration: 2000
    //     })
    // }
}
