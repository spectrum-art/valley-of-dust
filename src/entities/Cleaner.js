import * as THREE from 'three';

export default class Cleaner {
  constructor(game, x, y, level) {
    this.game = game;
    const types = [
      'duster','broom',
      'vacuum_small','vacuum_large','vacuum_industrial'
    ];
    this.key = types[(level-1) % types.length];
    const tex = this.game.textures[this.key];
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    const size = (this.key.includes('large')||this.key.includes('industrial'))?256:128;
    this.sprite.scale.set(size, size, 1);
    this.sprite.position.set(x, y, 0);
    this.sprite.userData.type = 'entity';

    // speed relative to player
    const base = this.game.currentScene?.player?.speed || 100;
    this.speed = base * (0.8 + 0.1 * (level - 1));

    game.currentScene.scene.add(this.sprite);
  }

  update(delta, player) {
    // semi-random pursuit
    const toP = new THREE.Vector2(
      player.sprite.position.x - this.sprite.position.x,
      player.sprite.position.y - this.sprite.position.y
    ).normalize();
    const wander = new THREE.Vector2(
      Math.random()-0.5,
      Math.random()-0.5
    ).normalize();
    const dir = toP.lerp(wander, 0.6).normalize();

    const moveX = dir.x * this.speed * delta;
    const moveY = dir.y * this.speed * delta;

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
  }
}
