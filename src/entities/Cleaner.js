// src/entities/Cleaner.js
import * as THREE from 'three';

export default class Cleaner {
  constructor(game, x, y, level) {
    this.game = game;

    const types = [
      'duster', 'broom',
      'vacuum_small', 'vacuum_large', 'vacuum_industrial'
    ];
    this.key = types[(level - 1) % types.length];
    const tex = this.game.textures[this.key];

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    const size = (this.key.includes('large') || this.key.includes('industrial')) ? 256 : 128;
    this.sprite.scale.set(size, size, 1);
    this.sprite.position.set(x, y, 0);

    // persistent velocity
    this.velocity = new THREE.Vector2(Math.random(), Math.random()).normalize();

    const baseSpeed = this.game.currentScene?.player?.speed || 100;
    this.speed = baseSpeed * (0.8 + 0.1 * (level - 1));

    game.currentScene.scene.add(this.sprite);
  }

  update(delta, player) {
    // direction to player
    const toP = new THREE.Vector2(
      player.sprite.position.x - this.sprite.position.x,
      player.sprite.position.y - this.sprite.position.y
    ).normalize();

    // gentler wander
    const wander = new THREE.Vector2(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    );

    // 70% gravity toward player + 30% wander
    const desired = toP.multiplyScalar(0.7)
      .add(wander.multiplyScalar(0.3))
      .normalize();

    // slower steering for natural curve
    this.velocity.lerp(desired, 0.05).normalize();

    const moveX = this.velocity.x * this.speed * delta;
    const moveY = this.velocity.y * this.speed * delta;

    // obstacle collision (same as Player)
    const obs = this.game.currentScene.obstacles;
    // X axis
    const oldX = this.sprite.position.x;
    this.sprite.position.x += moveX;
    if (obs.some(o =>
      Math.abs(this.sprite.position.x - o.x) < (this.sprite.scale.x/2 + o.width/2) &&
      Math.abs(this.sprite.position.y - o.y) < (this.sprite.scale.y/2 + o.height/2)
    )) {
      this.sprite.position.x = oldX;
      this.velocity.x *= -1;
    }
    // Y axis
    const oldY = this.sprite.position.y;
    this.sprite.position.y += moveY;
    if (obs.some(o =>
      Math.abs(this.sprite.position.x - o.x) < (this.sprite.scale.x/2 + o.width/2) &&
      Math.abs(this.sprite.position.y - o.y) < (this.sprite.scale.y/2 + o.height/2)
    )) {
      this.sprite.position.y = oldY;
      this.velocity.y *= -1;
    }
  }
}
