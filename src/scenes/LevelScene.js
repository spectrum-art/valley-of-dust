// src/scenes/LevelScene.js
import * as THREE from 'three';
import Dust from '../entities/Dust.js';
import Cleaner from '../entities/Cleaner.js';
import Player from '../entities/Player.js';
import Collision from '../utils/Collision.js';
import WinScene from './WinScene.js';
import StartScene from './StartScene.js';

export default class LevelScene {
  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.dustCollected = 0;
    this.obstacles = [];
  }

  init() {
    this.scene = new THREE.Scene();

    // Title card & overlay
    this.title = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.game.textures.title_card_bg })
    );
    this.title.scale.set(this.game.width, this.game.height, 1);
    this.title.position.set(this.game.width/2, this.game.height/2, 0);
    this.scene.add(this.title);

    document.getElementById('overlay').innerHTML = `
      <div style="
        position:absolute;
        top:50%;
        width:100%;
        text-align:center;
        font-family:sans-serif;
        font-size:48px;
        color:white;
        text-shadow:0 0 5px black;">
        Level ${this.level}
      </div>`;

    this.timer = 0;
    this.playing = false;
  }

  setupLevel() {
    // clear overlay & remove title
    document.getElementById('overlay').innerHTML = '';
    this.scene.remove(this.title);

    // load config
    const cfg = this.game.assetsData.levels[this.level - 1];
    this.threshold = cfg.dustThreshold;

    // furniture obstacles
    this.obstacles = [];
    cfg.furniture.forEach(o => {
      const mat = new THREE.SpriteMaterial({ map: this.game.textures.furniture });
      const s = new THREE.Sprite(mat);
      s.scale.set(o.width, o.height, 1);
      s.position.set(o.x, o.y, 0);
      this.scene.add(s);
      this.obstacles.push(o);
    });

    // player
    this.player = new Player(this.game, this.game.width/2, this.game.height/2);

    // dusts
    this.dusts = [];
    for (let i = 0; i < this.threshold; i++) this.spawnDust();

    // cleaners
    this.cleaners = cfg.cleanerSpawns.map(sp =>
      new Cleaner(this.game, sp.x, sp.y, this.level)
    );

    this.playing = true;
  }

  spawnDust() {
    let x, y, safe;
    do {
      x = Math.random() * this.game.width;
      y = Math.random() * this.game.height;
      // ensure not on any obstacle
      safe = !this.obstacles.some(o =>
        Math.abs(x - o.x) < (16 + o.width/2) &&
        Math.abs(y - o.y) < (16 + o.height/2)
      );
    } while (!safe);
    this.dusts.push(new Dust(this.game, x, y));
  }

  update(delta) {
    if (!this.playing) {
      this.timer += delta;
      if (this.timer > 2) this.setupLevel();
      return;
    }

    this.player.update(delta);
    this.cleaners.forEach(c => c.update(delta, this.player));

    // player + dust collisions
    for (let i = 0; i < this.dusts.length; i++) {
      const d = this.dusts[i];
      if (Collision.checkSpriteCollision(this.player.sprite, d.sprite)) {
        this.scene.remove(d.sprite);
        this.dusts.splice(i, 1);
        this.player.grow();
        this.dustCollected++;
        this.spawnDust();

        if (this.dustCollected >= this.threshold) {
          if (this.level < 5) {
            this.game.startScene(new LevelScene(this.game, this.level + 1));
            return;  // **exit to avoid double-init bug**
          } else {
            this.game.startScene(new WinScene(this.game));
            return;
          }
        }
      }
    }

    // cleaner + player collision
    for (const c of this.cleaners) {
      if (Collision.checkSpriteCollision(c.sprite, this.player.sprite)) {
        this.game.startScene(new StartScene(this.game));
        return;
      }
    }

    // cleaner + dust
    this.cleaners.forEach(c => {
      for (let i = 0; i < this.dusts.length; i++) {
        const d = this.dusts[i];
        if (Collision.checkSpriteCollision(c.sprite, d.sprite)) {
          this.scene.remove(d.sprite);
          this.dusts.splice(i, 1);
          this.spawnDust();
          break;
        }
      }
    });
  }

  render() {
    this.game.renderer.render(this.scene, this.game.camera);
  }

  dispose() {}
}
