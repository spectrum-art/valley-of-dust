// src/scenes/BootScene.js
import { TextureLoader } from 'three';
import StartScene        from './StartScene.js';
import Collision          from '../utils/Collision.js';

export default class BootScene {
  constructor(game) {
    this.game = game;
  }
  init() {
    const loader = new TextureLoader();
    const assets = {
      player_bunny:      '/assets/sprites/player_bunny.png',
      dust_collectible:  '/assets/sprites/dust_collectible.png',
      duster:            '/assets/sprites/duster.png',
      broom:             '/assets/sprites/broom.png',
      vacuum_small:      '/assets/sprites/vacuum_small.png',
      vacuum_large:      '/assets/sprites/vacuum_large.png',
      vacuum_industrial: '/assets/sprites/vacuum_industrial.png',
      furniture:         '/assets/sprites/furniture.png',
      start_bg:          '/assets/ui/start_background.png',
      title_card_bg:     '/assets/ui/title_card_bg.png',
      win_bg:            '/assets/ui/win_background.png'
    };

    // allow Collision to access textureMaps
    Collision.game = this.game;

    const entries = Object.entries(assets);
    let loaded = 0;

    entries.forEach(([key, url]) => {
      loader.load(url, texture => {
        texture.name = key;
        this.game.textures[key] = texture;

        // build an alpha-map for per-pixel collision
        const img = texture.image;
        const canvas = document.createElement('canvas');
        canvas.width  = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        this.game.textureMaps[key] = { data, width: img.width, height: img.height };

        if (++loaded === entries.length) {
          this.game.startScene(new StartScene(this.game));
        }
      });
    });
  }
  update() {}
  render() {}
  dispose() {}
}
