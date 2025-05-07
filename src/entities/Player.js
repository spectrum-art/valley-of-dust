import * as THREE from 'three';

export default class Player {
  constructor(game, x, y) {
    this.game = game;
    this.speed = 100; // start smaller
    const tex = this.game.textures.player_bunny;
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    this.sprite.scale.set(32, 32, 1);
    this.sprite.position.set(x, y, 0);
    this.sprite.userData.type = 'entity';

    this.keys = {};
    window.addEventListener('keydown', e => (this.keys[e.code] = true));
    window.addEventListener('keyup', e => (this.keys[e.code] = false));

    game.currentScene.scene.add(this.sprite);
  }

  grow() {
    this.speed += 20;              // speed growth
    this.sprite.scale.x += 4;      // visual growth
    this.sprite.scale.y += 4;
  }

  update(delta) {
    const dir = new THREE.Vector2();
    if (this.keys['ArrowUp']) dir.y += 1;
    if (this.keys['ArrowDown']) dir.y -= 1;
    if (this.keys['ArrowLeft']) dir.x -= 1;
    if (this.keys['ArrowRight']) dir.x += 1;
    if (dir.length() > 0) dir.normalize();

    const moveX = dir.x * this.speed * delta;
    const moveY = dir.y * this.speed * delta;

    // axis‐aligned movement with obstacle blocking
    const scene = this.game.currentScene;
    // X
    const oldX = this.sprite.position.x;
    this.sprite.position.x += moveX;
    if (scene.obstacles.some(o =>
      Math.abs(this.sprite.position.x - o.x) < (this.sprite.scale.x/2 + o.width/2) &&
      Math.abs(this.sprite.position.y - o.y) < (this.sprite.scale.y/2 + o.height/2)
    )) {
      this.sprite.position.x = oldX;
    }
    // Y
    const oldY = this.sprite.position.y;
    this.sprite.position.y += moveY;
    if (scene.obstacles.some(o =>
      Math.abs(this.sprite.position.x - o.x) < (this.sprite.scale.x/2 + o.width/2) &&
      Math.abs(this.sprite.position.y - o.y) < (this.sprite.scale.y/2 + o.height/2)
    )) {
      this.sprite.position.y = oldY;
    }

    // clamp to bounds
    this.sprite.position.x = THREE.MathUtils.clamp(
      this.sprite.position.x, 0, this.game.width
    );
    this.sprite.position.y = THREE.MathUtils.clamp(
      this.sprite.position.y, 0, this.game.height
    );
  }
}
