// src/scenes/StartScene.js
import * as THREE from 'three';
import LevelScene from './LevelScene.js';

export default class StartScene {
  constructor(game) {
    this.game = game;
  }
  init() {
    this.scene = new THREE.Scene();
    const bgMat = new THREE.SpriteMaterial({ map: this.game.textures.start_bg });
    const bg = new THREE.Sprite(bgMat);
    bg.scale.set(this.game.width, this.game.height, 1);
    bg.position.set(this.game.width/2, this.game.height/2, 0);
    this.scene.add(bg);

    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
      <div style="
        position:absolute; top:20%; width:100%;
        text-align:center; font-size:48px;
        color:white; text-shadow:0 0 5px black;
        font-family:sans-serif;">
        Valley of Dust
      </div>
      <div style="
        position:absolute; top:60%; width:100%;
        text-align:center; font-size:24px;
        color:white; text-shadow:0 0 5px black;
        font-family:sans-serif;">
        Press Space or Touch to Start
      </div>`;

    this.onInput = e => {
      if (e.code === 'Space' || e.type === 'pointerdown') {
        overlay.innerHTML = '';
        this.game.startScene(new LevelScene(this.game, 1));
      }
    };
    window.addEventListener('keydown', this.onInput);
    window.addEventListener('pointerdown', this.onInput);
  }
  update() {}
  render() {
    this.game.renderer.render(this.scene, this.game.camera);
  }
  dispose() {
    window.removeEventListener('keydown', this.onInput);
    window.removeEventListener('pointerdown', this.onInput);
  }
}
