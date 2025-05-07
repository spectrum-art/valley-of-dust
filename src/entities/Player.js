// src/entities/Player.js
import * as THREE from 'three';
import nipplejs from 'nipplejs';

export default class Player {
  constructor(game, x, y) {
    this.game = game;
    this.speed = 100;
    const tex = this.game.textures.player_bunny;
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    this.sprite.scale.set(32, 32, 1);
    this.sprite.position.set(x, y, 0);
    this.sprite.userData.type = 'entity';

    this.keys = {};
    window.addEventListener('keydown', e => this.keys[e.code] = true);
    window.addEventListener('keyup',   e => this.keys[e.code] = false);

    // nipplejs joystick
    const zone = document.getElementById('joystick-container');
    this.joystick = nipplejs.create({
      zone,
      mode: 'static',
      position: { left: '60px', bottom: '60px' },
      color: 'white',
      size: 120
    });
    this.joystickDir = { x: 0, y: 0 };
    this.joystick.on('move', (evt, data) => {
      const r = data.angle.radian;
      this.joystickDir.x = Math.cos(r);
      this.joystickDir.y = Math.sin(r);
    });
    this.joystick.on('end', () => {
      this.joystickDir.x = 0;
      this.joystickDir.y = 0;
    });

    game.currentScene.scene.add(this.sprite);
  }

  grow() {
    this.speed += 20;
    this.sprite.scale.x += 4;
    this.sprite.scale.y += 4;
  }

  update(delta) {
    // choose joystick over keyboard if active
    const dir = new THREE.Vector2();
    if (this.joystickDir.x || this.joystickDir.y) {
      dir.x = this.joystickDir.x;
      dir.y = this.joystickDir.y;
    } else {
      if (this.keys['ArrowUp'])    dir.y += 1;
      if (this.keys['ArrowDown'])  dir.y -= 1;
      if (this.keys['ArrowLeft'])  dir.x -= 1;
      if (this.keys['ArrowRight']) dir.x += 1;
    }
    if (dir.length() > 0) dir.normalize();

    const moveX = dir.x * this.speed * delta;
    const moveY = dir.y * this.speed * delta;

    // X-axis movement + obstacle collision
    const scene = this.game.currentScene;
    const oldX = this.sprite.position.x;
    this.sprite.position.x += moveX;
    if (scene.obstacles.some(o =>
      Math.abs(this.sprite.position.x - o.x) < (this.sprite.scale.x/2 + o.width/2) &&
      Math.abs(this.sprite.position.y - o.y) < (this.sprite.scale.y/2 + o.height/2)
    )) this.sprite.position.x = oldX;

    // Y-axis
    const oldY = this.sprite.position.y;
    this.sprite.position.y += moveY;
    if (scene.obstacles.some(o =>
      Math.abs(this.sprite.position.x - o.x) < (this.sprite.scale.x/2 + o.width/2) &&
      Math.abs(this.sprite.position.y - o.y) < (this.sprite.scale.y/2 + o.height/2)
    )) this.sprite.position.y = oldY;

    // clamp to bounds
    this.sprite.position.x = THREE.MathUtils.clamp(
      this.sprite.position.x, 0, this.game.width
    );
    this.sprite.position.y = THREE.MathUtils.clamp(
      this.sprite.position.y, 0, this.game.height
    );
  }
}
