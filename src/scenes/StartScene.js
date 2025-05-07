import * as THREE from 'three';
import LevelScene from './LevelScene.js';

export default class StartScene {
  constructor(game) {
    this.game = game;
  }
  init() {
    this.scene = new THREE.Scene();

    // background
    const bm = new THREE.SpriteMaterial({ map: this.game.textures.start_bg });
    const bg = new THREE.Sprite(bm);
    bg.scale.set(this.game.width, this.game.height, 1);
    bg.position.set(this.game.width / 2, this.game.height / 2, 0);
    this.scene.add(bg);

    // title + prompt
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
      <div style="
        position:absolute;
        top:20%;
        width:100%;
        text-align:center;
        font-family:sans-serif;
        font-size:48px;
        color:white;
        text-shadow:0 0 5px black;">
        Valley of Dust
      </div>
      <div style="
        position:absolute;
        top:60%;
        width:100%;
        text-align:center;
        font-family:sans-serif;
        font-size:24px;
        color:white;
        text-shadow:0 0 5px black;">
        Press Space to Start
      </div>`;

    this.onKey = e => {
      if (e.code === 'Space') {
        overlay.innerHTML = '';
        this.game.startScene(new LevelScene(this.game, 1));
      }
    };
    window.addEventListener('keydown', this.onKey);
  }
  update() {}
  render() {
    this.game.renderer.render(this.scene, this.game.camera);
  }
  dispose() {
    window.removeEventListener('keydown', this.onKey);
  }
}
