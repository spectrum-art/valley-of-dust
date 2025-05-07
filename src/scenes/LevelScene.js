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
  }

  init() {
    this.scene = new THREE.Scene();
    // Title card
    this.title = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.game.textures.title_card_bg })
    );
    this.title.scale.set(this.game.width, this.game.height, 1);
    this.title.position.set(this.game.width/2, this.game.height/2, 0);
    this.scene.add(this.title);
    this.timer = 0;
    this.playing = false;
  }

  setupLevel() {
    const cfg = this.game.assetsData.levels[this.level - 1];
    this.threshold = cfg.dustThreshold;

    // furniture (decorative)
    cfg.furniture.forEach(o => {
      const mat = new THREE.SpriteMaterial({ map: this.game.textures.furniture });
      const s = new THREE.Sprite(mat);
      s.scale.set(o.width, o.height, 1);
      s.position.set(o.x, o.y, 0);
      this.scene.add(s);
    });

    this.player = new Player(this.game, this.game.width/2, this.game.height/2);

    this.dusts = [];
    for (let i = 0; i < this.threshold; i++) this.spawnDust();

    this.cleaners = cfg.cleanerSpawns.map(sp =>
      new Cleaner(this.game, sp.x, sp.y, this.level)
    );

    this.playing = true;
  }

  spawnDust() {
    const x = Math.random() * this.game.width;
    const y = Math.random() * this.game.height;
    this.dusts.push(new Dust(this.game, x, y));
  }

  update(delta) {
    if (!this.playing) {
      if ((this.timer += delta) > 2) {
        this.scene.remove(this.title);
        this.setupLevel();
      }
      return;
    }

    this.player.update(delta);
    this.cleaners.forEach(c => c.update(delta, this.player));

    // player + dust
    this.dusts.forEach((d, i) => {
      if (Collision.checkSpriteCollision(this.player.sprite, d.sprite)) {
        this.scene.remove(d.sprite);
        this.dusts.splice(i, 1);
        this.dustCollected++;
        this.spawnDust();
        if (this.dustCollected >= this.threshold) {
          if (this.level < 5) {
            this.game.startScene(new LevelScene(this.game, this.level + 1));
          } else {
            this.game.startScene(new WinScene(this.game));
          }
        }
      }
    });

    // cleaner + player
    this.cleaners.forEach(c => {
      if (Collision.checkSpriteCollision(c.sprite, this.player.sprite)) {
        this.game.startScene(new StartScene(this.game));
      }
    });

    // cleaner + dust
    this.cleaners.forEach(c =>
      this.dusts.forEach((d, i) => {
        if (Collision.checkSpriteCollision(c.sprite, d.sprite)) {
          this.scene.remove(d.sprite);
          this.dusts.splice(i, 1);
          this.spawnDust();
        }
      })
    );
  }

  render() {
    this.game.renderer.render(this.scene, this.game.camera);
  }

  dispose() {}
}
