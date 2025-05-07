import * as THREE from 'three';
import LevelScene from './LevelScene.js';

export default class StartScene {
  constructor(game) {
    this.game = game;
  }
  init() {
    this.scene = new THREE.Scene();
    const mat = new THREE.SpriteMaterial({ map: this.game.textures.start_bg });
    const bg = new THREE.Sprite(mat);
    bg.scale.set(this.game.width, this.game.height, 1);
    bg.position.set(this.game.width / 2, this.game.height / 2, 0);
    this.scene.add(bg);

    const overlay = document.getElementById('overlay');
    overlay.textContent = 'Press Space to Start';

    this.onKey = e => {
      if (e.code === 'Space') {
        overlay.textContent = '';
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
