// src/scenes/GameOverScene.js
import * as THREE from 'three';
import StartScene from './StartScene.js';

export default class GameOverScene {
  constructor(game) {
    this.game = game;
  }
  init() {
    this.scene = new THREE.Scene();
    const mat = new THREE.SpriteMaterial({ map: this.game.textures.gameover_bg });
    const bg = new THREE.Sprite(mat);
    bg.scale.set(this.game.width, this.game.height, 1);
    bg.position.set(this.game.width/2, this.game.height/2, 0);
    this.scene.add(bg);

    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
      <div style="
        position:absolute; top:40%; width:100%;
        text-align:center; font-family:sans-serif;
        font-size:48px; color:white;
        text-shadow:0 0 5px black;">
        Game Over
      </div>
      <div style="
        position:absolute; top:60%; width:100%;
        text-align:center; font-family:sans-serif;
        font-size:24px; color:white;
        text-shadow:0 0 5px black;">
        Press Space to Restart
      </div>`;

    this.onKey = e => {
      if (e.code === 'Space') {
        overlay.innerHTML = '';
        this.game.startScene(new StartScene(this.game));
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
