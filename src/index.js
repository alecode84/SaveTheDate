import Phaser from 'phaser';
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';
import DragPlugin from 'phaser3-rex-plugins/plugins/drag-plugin.js';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin/dist/phaser-matter-collision-plugin.min';
import SaveTheDate from './scenes/SaveTheDate'
// const json = require('./assets/texture.json');

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'matter',
        matter: {
            gravity:{y: .5}
            // ,debug: true
            // enableSleeping: true
        }
    },
    plugins: {
        scene: [{
            key: 'rexGestures',
            plugin: GesturesPlugin,
            mapping: 'rexGestures'
        },{
            key: 'rexDrag',
            mapping: 'rexDrag',
            plugin: DragPlugin,
            start: true
        },{
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
        }]
    },
    scene: [SaveTheDate]
};

const game = new Phaser.Game(config);
