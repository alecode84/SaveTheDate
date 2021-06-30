import Phaser from "phaser";

import frameImg from "../assets/frame_no_leaf.png";
import saveText from "../assets/text.png"
import texture from "../assets/texture.png"
import textureMap from "../assets/texture.json"
import Card from "../components/Card";
import Leaf from "../components/Leaf";
import LeafContainer from "../components/LeafContainer";



export default class SaveTheDate extends Phaser.Scene {

    constructor() {
        super( 'SaveTheDate');

        this.FRAME_POSITION = { top: -475, right: 300, bottom: 475, left: -300 };
        this.LEAF_POSITION = {x: -60, y: -890 };
        this.MARGIN = { top: 70, bottom: 70, left: 30, right: 30}

        this.DATE_ARRAY = ["O", "C", "T", "O", "B", "E", "R", "", "9", "", "2", "0", "2", "1", ""]
        this.date_index = 0

        this.animateLeaf = false;
        this.card = null
        this.leaf = null
        this.scoreBoard = null

        this.leafScaleModifier = 1.25
        this.ground = null
        this.timer = 0;
        this.resources = 0;
        this.gameStarted = false
        this.snowing = false

        this.score = 0;


        this.flakeKeys = ["Flake1.png", "Flake2.png", "Flake3.png", "Flake4.png", "Flake5.png"]

        this.debugTxt = null;
    }

    preload (){
        this.load.image('frameImg', frameImg)
        this.load.image('saveText', saveText )

        this.load.atlas({
            key: 'textureSet',
            textureURL: '../assets/texture.png',
            atlasURL: '../assets/texture.json'
        });
    }

    create (){
        this.cameras.main.setBackgroundColor('#31333E')
        this.matter.world.setBounds( 0, 0, window.innerWidth, window.innerHeight,  32, false, false, false, false )

        this.scale.on('resize', this.resize, this);

        // 1500 x2120
        this.scaleX = window.innerWidth /(1500+this.MARGIN.left+this.MARGIN.right);
        this.scaleY = window.innerHeight / (2120+this.MARGIN.left+this.MARGIN.right);
        this.initialScale = this.scaleX < this.scaleY ? this.scaleX : this.scaleY;

        this.scaleX2 = window.innerWidth/(Math.abs(this.FRAME_POSITION.left - this.FRAME_POSITION.right)+this.MARGIN.left+this.MARGIN.right);
        this.scaleY2 = window.innerHeight/(Math.abs(this.FRAME_POSITION.top - this.FRAME_POSITION.bottom)+this.MARGIN.top+this.MARGIN.bottom );

        this.zoomedScale = this.scaleX2 < this.scaleY2 ? this.scaleX2 : this.scaleY2;

        this.card = new Card(this, this.cameras.main.centerX , this.cameras.main.centerY );
        this.card.setScale( this.initialScale );

        const leafX = this.card.x + (this.LEAF_POSITION.x*this.initialScale)
        const leafY = this.card.y + (this.LEAF_POSITION.y*this.initialScale)


        this.leaf = new Leaf(this, leafX , leafY  )
        this.matter.add.gameObject( this.leaf )
        this.leaf.setBody({ type: 'rectangle',
            width: this.leaf.width * this.leafScaleModifier,
            height: this.leaf.height * this.leafScaleModifier,
    })
        this.leaf.setIgnoreGravity( true )


        this.leaf.setScale( this.initialScale * this.leafScaleModifier )
        // this.leaf.rotation = -.84
        this.leaf.angle = -60
        this.leaf.mass = .99
        this.leaf.on( 'pointerdown', this.dropLeaf.bind(this) );


        let pinch = this.rexGestures.add.pinch({});
        let camera = this.cameras.main;
        pinch.on('pinch', function (pinch) {
            let scaleFactor = pinch.scaleFactor;
            camera.zoom *= scaleFactor;
        }, this);


        this.ground = this.matter.add.rectangle(this.cameras.main.centerX, (this.cameras.main.centerY + ( this.FRAME_POSITION.bottom * this.zoomedScale))+100, window.innerWidth, 200, { ignoreGravity: true, isStatic: true, isSensor: false });
        this.ground.label = "ground"



        // this.debugTxt = this.add.text(440, 80, "SCORE: 0", {fontSize: '32px', fill: '#fff'});

        this.addListeners()
    }

    tweenSTDText(){
        let stdText = this.add.sprite(this.card.x , this.card.y + ((this.FRAME_POSITION.top+200)*this.zoomedScale), 'textureSet', 'STD.png')
        stdText.scale = this.zoomedScale;
        stdText.alpha = 0;
        this.tweens.add({
            targets: stdText,
            alpha:  1,
            ease : 'Sine.easeInOut',
            yoyo: true,
            duration: 2000,
            repeat: 0,
            onComplete: this.startSnow.bind(this)
        })
    }

    startSnow() {
        this.snowing = true;
    }

    startGame(){
      this.gameStarted = true;
      this.gameOver = false;
      this.tweenSTDText()
      this.score = 0;
      this.leaf.setVelocityY( 0 )
      this.rexDrag.add(this.leaf, {axis: 'horizontal'});
        //Add the scoreboard in
      this.scoreBoard = this.add.text(this.cameras.main.centerX + ( this.FRAME_POSITION.left*this.zoomedScale), this.cameras.main.centerY + (this.FRAME_POSITION.bottom*this.zoomedScale-50) , "0", {
          fontFamily:  'Garamond, Baskerville, "Baskerville Old Face", "Times New Roman",serif',
          fontSize: '32px', fill: '#fff'});

      this.leaf.on('drag', function(pointer, dragX, dragY){

          this.blowLeafUpward(pointer.distance)
      }.bind(this));
    }

    dropLeaf(){
        this.leaf.removeListener( 'pointerdown' )
        this.leaf.dropped = true
        this.leaf.body.ignoreGravity =  false
        this.animateLeaf = true;

        this.tweens.add({
            targets: this.card,
            scale:  this.zoomedScale,
            ease : 'Sine.easeOut',
            duration: 3000*this.zoomedScale

        })
    }

    dropDateChar(){
        let letterWindow = Math.sin( this.resources/Math.PI )
        if( letterWindow > .9 - Math.min(.2, (this.score/1000) ) ){
            if( Phaser.Math.RND.frac() > .8 - Math.min(.2, (this.score/500) ) ){

                const charToDrop = this.DATE_ARRAY[this.date_index]
                this.date_index ++
                if( charToDrop === ""){
                    return;
                }

                let frameStartX = this.cameras.main.centerX + ( this.FRAME_POSITION.left * this.zoomedScale)
                let charX = frameStartX  + Phaser.Math.RND.frac()*(Math.abs( ((this.FRAME_POSITION.left + 25) *this.zoomedScale) - ((this.FRAME_POSITION.right - 25)*this.zoomedScale)) )
                let charY =  (this.cameras.main.centerY + ( (this.FRAME_POSITION.top + 50) * this.zoomedScale))



                const fontSize = 88*this.zoomedScale
                let dateChar = this.add.text( charX, charY, charToDrop, {fontFamily:  'Garamond, Baskerville, "Baskerville Old Face", "Times New Roman",serif', fontSize: fontSize+'px' }  )
                dateChar.label = "dateChar"
                dateChar.alpha = 0;
                this.matter.add.gameObject( dateChar )
                dateChar.body.ignoreGravity = true;

                this.tweens.add({
                    targets: dateChar,
                    alpha: 1,
                    ease : 'linear',
                    duration: Math.max( 10, (3000 - (this.score*10 ))),
                    onComplete: () => {if( dateChar.body != null ) dateChar.body.ignoreGravity = false }
                })


                if( this.date_index > this.DATE_ARRAY.length ){
                    this.date_index = 0
                    console.log( this.score )
                }
            }

        }

    }

    resize (gameSize, baseSize, displaySize, resolution) {

        // 1500 x2120
        this.scaleX = window.innerWidth /1500;
        this.scaleY = window.innerHeight / 2120;
        this.initialScale = this.scaleX < this.scaleY ? this.scaleX : this.scaleY;



        this.scaleX2 = window.innerWidth/(Math.abs(this.FRAME_POSITION.left - this.FRAME_POSITION.right)+this.MARGIN.left+this.MARGIN.right);
        this.scaleY2 = window.innerHeight/(Math.abs(this.FRAME_POSITION.top - this.FRAME_POSITION.bottom)+this.MARGIN.top+this.MARGIN.bottom );

        this.zoomedScale = this.scaleX2 < this.scaleY2 ? this.scaleX2 : this.scaleY2;

        this.card.x = this.cameras.main.centerX;
        this.card.y = this.cameras.main.centerY;

        if( !this.gameStarted ){
            this.card.scale = this.initialScale
            this.leaf.scale = this.initialScale * this.leafScaleModifier
            this.leaf.x = this.cameras.main.centerX + (this.LEAF_POSITION.x*this.initialScale)
            this.leaf.y = this.cameras.main.centerY + (this.LEAF_POSITION.y*this.initialScale)
        }else{
            this.card.scale = this.zoomedScale;
        }

        this.matter.world.remove(this.ground )
        // this.ground.width = window.innerWidth
        // this.ground.x = this.cameras.main.centerX
        // this.ground.y = (this.cameras.main.centerY + ( this.FRAME_POSITION.bottom * this.zoomedScale))+100

        this.ground = this.matter.add.rectangle(this.cameras.main.centerX, (this.cameras.main.centerY + ( this.FRAME_POSITION.bottom * this.zoomedScale))+100, window.innerWidth, 200, { ignoreGravity: true, isStatic: true, isSensor: false });
        this.ground.label = "ground"

        this.matterCollision.removeAllCollideListeners()
        this.addListeners()
    }

    addListeners(){

        if( !this.gameStarted && !this.gameOver){
            this.matterCollision.addOnCollideStart({
                objectA: this.ground,
                objectB: this.leaf,
                callback: eventData => {
                    if( !this.gameStarted ){
                        this.animateLeaf = false
                        this.card.saveText.alpha = 0;
                        this.startGame();
                    }
                },
                context: this
            })

        }

        this.matterCollision.addOnCollideActive({
            objectA: this.ground,
            callback: eventData =>{
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;

                if( gameObjectB != undefined ){
                    if( gameObjectB.label === "leaf"){
                        gameObjectB.setVelocityY(0)
                    }else if( gameObjectB.label === "flake"){
                        this.matter.world.remove(bodyB);
                        gameObjectB.destroy()
                    }else if( gameObjectB.label === "dateChar"){
                        this.matter.world.remove(bodyB);
                        gameObjectB.destroy()
                        this.endGame()
                    }
                }
            },
            context: this
        });


        this.matterCollision.addOnCollideStart({
            objectA: this.leaf,
            callback: eventData =>{
                const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
                if( gameObjectB != undefined ){
                    if( gameObjectB.label === "flake"){
                        this.score ++;
                        this.scoreBoard.setText(this.score)
                        gameObjectB.destroy()
                        this.matter.world.remove(bodyB);
                    }
                    if( gameObjectB.label === 'dateChar'){
                        this.score += 10;
                        gameObjectB.destroy()
                        this.scoreBoard.setText( this.score)
                        this.matter.world.remove(bodyB);
                    }
                }
            },
            context: this
        })

    }

    updateLeafDrop(){
        let completion = this.getLeafCompletionRatio()
        let newAlpha = 1 - (completion)

        if( this.card.alpha > newAlpha ){
            this.card.saveText.alpha = newAlpha
        }
        const leafScaleD = ((this.zoomedScale * this.leafScaleModifier )- this.initialScale * this.leafScaleModifier  )/2
        this.leaf.scale = (this.initialScale * this.leafScaleModifier )+ (leafScaleD*completion)
        this.blowLeaf()
    }

    addSnow(){
        let flakeProb = Math.sin( this.resources/(2*Math.PI) )
        if( Phaser.Math.RND.frac()*1.05 > Math.abs(flakeProb) ){
            let frameStartX = this.cameras.main.centerX + ( this.FRAME_POSITION.left * this.zoomedScale)
            let flakeX = frameStartX  + Phaser.Math.RND.frac()*(Math.abs( (this.FRAME_POSITION.left *this.zoomedScale) - (this.FRAME_POSITION.right*this.zoomedScale)) )
            let flakeY =  (this.cameras.main.centerY + ( this.FRAME_POSITION.top * this.zoomedScale))

            let newFlake = this.matter.add.sprite( flakeX, flakeY, 'textureSet', ""+this.flakeKeys[Phaser.Math.Between(1, 5)-1])
            this.matter.add.gameObject( newFlake )
            newFlake.scale = this.zoomedScale
            newFlake.label = "flake"
            // newFlake.setMass(0.001 )
        }
    }

    getLeafCompletionRatio(){
        let topY = this.cameras.main.centerY + ( this.LEAF_POSITION.y * this.initialScale );
        let bottomY = this.cameras.main.centerY + (this.FRAME_POSITION.bottom*this.zoomedScale);

        let d1 = bottomY - topY;
        let d2 = bottomY - this.leaf.y;

        return 1-(d2/d1)
    }

    angleLeaf( windStrength ){
        let vLeafX = this.leaf.body.velocity.x
        let newAngle = vLeafX * 20
        let dAngle = this.leaf.angle - newAngle

        this.leaf.angle -= (dAngle/25)*((1+Math.abs(windStrength)*1.25))
    }

    blowLeafUpward( distance ){
        const vLeafY = this.leaf.body.velocity.y
        const frameScaleX =  1/this.scaleX2
        let scaledDistance = distance/frameScaleX
        if( scaledDistance  >  50*(frameScaleX) ) {
            let power = (scaledDistance / window.innerWidth);
            if (vLeafY >= -.5) {
                this.matter.setVelocityY(this.leaf, -.5 - power)
            } else {
                let newVelY = vLeafY - (power)
                newVelY = Math.min(newVelY, 2)
                this.matter.setVelocityY(this.leaf, newVelY)
            }
        }

        this.balanceLeaf()
    }

    endGame(){
        this.add.text(this.cameras.main.centerX - 100, this.cameras.main.centerY, "GAME OVER", {fontSize: '32px', fill: '#fff', fontFamily:  'Garamond, Baskerville, "Baskerville Old Face", "Times New Roman",serif'});
        this.scoreBoard.x = this.cameras.main.centerX + -30;
        this.scoreBoard.y = this.cameras.main.centerY + 40;
        this.gameOver = true;
        this.snowing = false;


    }

    blowLeaf(){
        const vLeaf = this.leaf.body.velocity
        const pLeaf = this.leaf.body.position

        const xScaleFactor =  1.02+(1/(1+this.scaleX2))
        const yScaleFactor = 1.02+(1/(1+this.scaleY2))

        const gustModifier = Phaser.Math.RND.frac()

        const windStrengthX = ((xScaleFactor)+(gustModifier/2))*Math.sin( this.resources/(2+(gustModifier)))
        const windStrengthY = ((yScaleFactor)+(gustModifier/2))*Math.sin( this.resources/(2+(gustModifier)))

        if( windStrengthY > 0 ) {
            let newVelY = vLeaf.y;
            newVelY -= windStrengthY
            this.matter.setVelocityY(this.leaf, newVelY)

            let newVelX = vLeaf.x;
            if (pLeaf.x > this.cameras.main.centerX) {
                newVelX -= windStrengthX
            } else {
                newVelX += windStrengthX
            }
            this.matter.setVelocityX(this.leaf, newVelX)
            this.angleLeaf(windStrengthX)
        }
    }

    update (time, delta) {
            this.timer += delta;
            while (this.timer > 100) {
                this.timer = 0;
                this.resources ++;
                if( !this.leaf.dropped ){
                    this.leaf.shimmer(this.resources)
                }
                if( this.animateLeaf ){
                    this.updateLeafDrop();
                }

                if( this.snowing  ) {
                    this.addSnow()
                }
                if( this.gameStarted && !this.gameOver ){
                    this.dropDateChar()
                }
            }
    }

    balanceLeaf(){


        const direction = (this.leaf.angle < 90 && this.leaf.angle > -90 ) ? 1 : -1;

        if(  (this.leaf.angle < 2 && direction < 0) || (this.leaf.angle > -2 && direction > 0) ){
            this.leaf.angle = 0;
            return;
        }else if( (this.leaf.angle > 178 && direction > 0 ) || (this.leaf.angle > -178 && direction < 0 )){
            this.leaf.angle = 180 ;
            return;
        }
        this.leaf.angle += direction * 2;
    }

}