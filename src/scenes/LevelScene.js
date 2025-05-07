// src/scenes/LevelScene.js
import * as THREE from 'three';
import Dust         from '../entities/Dust.js';
import Cleaner      from '../entities/Cleaner.js';
import Player       from '../entities/Player.js';
import Collision    from '../utils/Collision.js';
import WinScene     from './WinScene.js';
import StartScene   from './StartScene.js';
import GameOverScene from './GameOverScene.js';

export default class LevelScene {
  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.dustCollected = 0;
    this.obstacles = [];
  }

  init() {
    this.scene = new THREE.Scene();

    // title card
    this.titleSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.game.textures.title_card_bg })
    );
    this.titleSprite.scale.set(this.game.width, this.game.height, 1);
    this.titleSprite.position.set(this.game.width/2, this.game.height/2, 0);
    this.scene.add(this.titleSprite);

    const overlay = document.getElementById('overlay');
    overlay.innerHTML = `
      <div style="
        position:absolute; top:40%; width:100%;
        text-align:center; font-size:48px;
        color:white; text-shadow:0 0 5px black;
        font-family:sans-serif;">
        Level ${this.level}
      </div>`;
    
    this.timer = 0;
    this.playing = false;
  }

  setupLevel() {
    // clear overlay & title
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = '';
    this.scene.remove(this.titleSprite);

    // load config
    const cfg = this.game.assetsData.levels[this.level - 1];
    this.threshold = cfg.dustThreshold;

    // obstacles
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

    // dust
    this.dusts = [];
    for (let i = 0; i < this.threshold; i++) this.spawnDust();

    // dust counter UI
    overlay.innerHTML = `<div id="dust-counter" style="
      position:absolute; top:5%; left:5%;
      font-family:sans-serif; font-size:24px;
      color:white; text-shadow:0 0 5px black;">
      0/${this.threshold}
    </div>`;

    // cleaners spawn at perimeter
    this.cleaners = [];
    const count = cfg.cleanerSpawns.length;
    for (let i = 0; i < count; i++) {
      let x, y;
      const side = Math.floor(Math.random() * 4);
      if (side === 0)      { x = 0;                   y = Math.random() * this.game.height; }
      else if (side === 1) { x = this.game.width;     y = Math.random() * this.game.height; }
      else if (side === 2) { y = 0;                   x = Math.random() * this.game.width; }
      else                 { y = this.game.height;    x = Math.random() * this.game.width; }
      this.cleaners.push(new Cleaner(this.game, x, y, this.level));
    }

    this.playing = true;
  }

  spawnDust() {
    let x, y, safe;
    do {
      x = Math.random() * this.game.width;
      y = Math.random() * this.game.height;
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

    // player + dust
    for (let i = 0; i < this.dusts.length; i++) {
      const d = this.dusts[i];
      if (Collision.checkSpriteCollision(this.player.sprite, d.sprite)) {
        this.scene.remove(d.sprite);
        this.dusts.splice(i, 1);
        this.player.grow();
        this.dustCollected++;
        document.getElementById('dust-counter').textContent =
          `${this.dustCollected}/${this.threshold}`;
        this.spawnDust();

        if (this.dustCollected >= this.threshold) {
          if (this.level < 5) {
            this.game.startScene(new LevelScene(this.game, this.level+1));
          } else {
            this.game.startScene(new WinScene(this.game));
          }
          return;
        }
      }
    }

    // cleaner + player → GameOver
    for (const c of this.cleaners) {
      if (Collision.checkSpriteCollision(c.sprite, this.player.sprite)) {
        this.game.startScene(new GameOverScene(this.game));
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
