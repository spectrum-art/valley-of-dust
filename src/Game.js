// src/Game.js
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import BootScene from './scenes/BootScene.js';
import assetsData from './assets.json';

export default class Game {
  constructor(width=800, height=600) {
    this.width = width;
    this.height = height;
    this.assetsData = assetsData;
    this.textures = {};
    this.textureMaps = {};
    this.currentScene = null;
    this.gui = new GUI();

    const canvas = document.getElementById('three-canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);

    this.camera = new THREE.OrthographicCamera(
      0, width, height, 0, -1000, 1000
    );
    this.camera.position.z = 1;

    window.addEventListener('resize', ()=>this.onResize());
  }

  onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    const scale = Math.min(w/this.width, h/this.height);
    const wrapper = document.getElementById('game-wrapper');
    wrapper.style.transform = `scale(${scale})`;
  }

  start() {
    this.onResize();
    this.startScene(new BootScene(this));
    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      if (this.currentScene) {
        this.currentScene.update(dt);
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
