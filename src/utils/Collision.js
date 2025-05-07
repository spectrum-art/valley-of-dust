export default class Collision {
    static checkSpriteCollision(a, b) {
      // center-only collision: 64×64 for entities, 32×32 for dust
      const isDustA = a.userData.type === 'dust';
      const isDustB = b.userData.type === 'dust';
      const halfW_A = isDustA ? 16 : 32;
      const halfH_A = isDustA ? 16 : 32;
      const halfW_B = isDustB ? 16 : 32;
      const halfH_B = isDustB ? 16 : 32;
  
      const dx = Math.abs(a.position.x - b.position.x);
      const dy = Math.abs(a.position.y - b.position.y);
      return dx < (halfW_A + halfW_B) && dy < (halfH_A + halfH_B);
    }
  }
  