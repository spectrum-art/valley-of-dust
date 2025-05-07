// src/utils/Collision.js
export default class Collision {
    static game = null;
  
    static checkSpriteCollision(a, b) {
      // AABB overlap
      const ax0 = a.position.x - a.scale.x/2, ay0 = a.position.y - a.scale.y/2;
      const ax1 = a.position.x + a.scale.x/2, ay1 = a.position.y + a.scale.y/2;
      const bx0 = b.position.x - b.scale.x/2, by0 = b.position.y - b.scale.y/2;
      const bx1 = b.position.x + b.scale.x/2, by1 = b.position.y + b.scale.y/2;
      if (ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0) return false;
  
      // midpoint of overlap
      const ox = (Math.max(ax0, bx0) + Math.min(ax1, bx1)) / 2;
      const oy = (Math.max(ay0, by0) + Math.min(ay1, by1)) / 2;
  
      // sample alpha
      const sample = sprite => {
        const key = sprite.material.map.name;
        const tm  = Collision.game.textureMaps[key];
        if (!tm) return 255;
        const localX = (ox - (sprite.position.x - sprite.scale.x/2)) / sprite.scale.x;
        const localY = 1 - (oy - (sprite.position.y - sprite.scale.y/2)) / sprite.scale.y;
        const px = Math.floor(localX * tm.width);
        const py = Math.floor(localY * tm.height);
        if (px<0||py<0||px>=tm.width||py>=tm.height) return 0;
        return tm.data[(py*tm.width+px)*4+3];
      };
  
      return sample(a) > 128 && sample(b) > 128;
    }
  }
  