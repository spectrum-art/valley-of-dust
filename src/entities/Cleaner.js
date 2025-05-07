import * as THREE from 'three';

export default class Cleaner {
  constructor(game, x, y, level) {
    this.game = game;
    this.level = level;
    const types = [
      'duster', 'broom',
      'vacuum_small', 'vacuum_large', 'vacuum_industrial'
    ];
    this.key = types[(level - 1) % types.length];
    const tex = this.game.textures[this.key];
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    const size = (this.key.includes('large') || this.key.includes('industrial'))
      ? 256 : 128;
    this.sprite.scale.set(size, size, 1);
    this.sprite.position.set(x, y, 0);
    this.speed = this.game.currentScene?.player?.speed
      ? this.game.currentScene.player.speed * (0.7 + 0.1 * level)
      : 200 * (0.7 + 0.1 * level);
    game.currentScene.scene.add(this.sprite);
  }
  update(delta, player) {
    const dir = new THREE.Vector2(
      player.sprite.position.x - this.sprite.position.x,
      player.sprite.position.y - this.sprite.position.y
    );
    if (dir.length() > 0) dir.normalize();
    this.sprite.position.x += dir.x * this.speed * delta;
    this.sprite.position.y += dir.y * this.speed * delta;
  }
}
