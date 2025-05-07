import { TextureLoader } from 'three';
import StartScene from './StartScene.js';

export default class BootScene {
  constructor(game) {
    this.game = game;
  }
  init() {
    const loader = new TextureLoader();
    const assetsToLoad = {
      player_bunny: '/assets/sprites/player_bunny.png',
      dust_collectible: '/assets/sprites/dust_collectible.png',
      duster: '/assets/sprites/duster.png',
      broom: '/assets/sprites/broom.png',
      vacuum_small: '/assets/sprites/vacuum_small.png',
      vacuum_large: '/assets/sprites/vacuum_large.png',
      vacuum_industrial: '/assets/sprites/vacuum_industrial.png',
      furniture: '/assets/sprites/furniture.png',
      start_bg: '/assets/ui/start_background.png',
      title_card_bg: '/assets/ui/title_card_bg.png',
      win_bg: '/assets/ui/win_background.png'
    };
    const entries = Object.entries(assetsToLoad);
    let loaded = 0;
    entries.forEach(([key, url]) => {
      loader.load(url, texture => {
        this.game.textures[key] = texture;
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
