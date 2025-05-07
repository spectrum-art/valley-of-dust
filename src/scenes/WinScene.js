import * as THREE from 'three';
import StartScene from './StartScene.js';

export default class WinScene {
  constructor(game) {
    this.game = game;
  }
  init() {
    this.scene = new THREE.Scene();
    const mat = new THREE.SpriteMaterial({ map: this.game.textures.win_bg });
    const bg = new THREE.Sprite(mat);
    bg.scale.set(this.game.width, this.game.height, 1);
    bg.position.set(this.game.width/2, this.game.height/2, 0);
    this.scene.add(bg);

    const overlay = document.getElementById('overlay');
    overlay.textContent = 'You Win! Press Space to Restart';

    this.onKey = e => {
      if (e.code === 'Space') {
        overlay.textContent = '';
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
