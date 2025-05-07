// src/utils/Collision.js
export default class Collision {
    static checkSpriteCollision(a, b) {
      // dynamic center‐only boxes based on each sprite’s current scale
      const halfW_A = a.scale.x / 2;
      const halfH_A = a.scale.y / 2;
      const halfW_B = b.scale.x / 2;
      const halfH_B = b.scale.y / 2;
  
      const dx = Math.abs(a.position.x - b.position.x);
      const dy = Math.abs(a.position.y - b.position.y);
      return dx < (halfW_A + halfW_B) && dy < (halfH_A + halfH_B);
    }
  }
  