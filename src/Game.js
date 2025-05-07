import * as THREE from 'three';
import { GUI } from 'dat.gui';
import BootScene from './scenes/BootScene.js';
import assetsData from './assets.json';

export default class Game {
  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.OrthographicCamera(
      0, width, height, 0, -1000, 1000
    );
    this.camera.position.z = 1;

    this.assetsData = assetsData;
    this.textures = {};
    this.currentScene = null;
    this.gui = new GUI();
  }

  start() {
    this.startScene(new BootScene(this));
    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;
      if (this.currentScene) {
        this.currentScene.update(delta);
        this.currentScene.render();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  startScene(scene) {
    if (this.currentScene?.dispose) this.currentScene.dispose();
    this.currentScene = scene;
    this.currentScene.init();
  }
}
