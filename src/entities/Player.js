import * as THREE from 'three';

export default class Player {
  constructor(game, x, y) {
    this.game = game;
    this.speed = 200; // px/sec
    const tex = this.game.textures.player_bunny;
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    this.sprite.scale.set(64, 64, 1);
    this.sprite.position.set(x, y, 0);
    this.keys = {};
    window.addEventListener('keydown', e => (this.keys[e.code] = true));
    window.addEventListener('keyup', e => (this.keys[e.code] = false));
    game.currentScene.scene.add(this.sprite);
  }
  update(delta) {
    const dir = new THREE.Vector2();
    if (this.keys['ArrowUp']) dir.y += 1;
    if (this.keys['ArrowDown']) dir.y -= 1;
    if (this.keys['ArrowLeft']) dir.x -= 1;
    if (this.keys['ArrowRight']) dir.x += 1;
    if (dir.length() > 0) dir.normalize();
    this.sprite.position.x += dir.x * this.speed * delta;
    this.sprite.position.y += dir.y * this.speed * delta;
    // clamp
    this.sprite.position.x = THREE.MathUtils.clamp(
      this.sprite.position.x, 0, this.game.width
    );
    this.sprite.position.y = THREE.MathUtils.clamp(
      this.sprite.position.y, 0, this.game.height
    );
  }
}
