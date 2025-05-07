import * as THREE from 'three';

export default class Dust {
  constructor(game, x, y) {
    this.game = game;
    const tex = this.game.textures.dust_collectible;
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    this.sprite.scale.set(32, 32, 1);
    this.sprite.position.set(x, y, 0);
    game.currentScene.scene.add(this.sprite);
  }
}
