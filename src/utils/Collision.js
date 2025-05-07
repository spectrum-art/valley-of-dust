export default class Collision {
    static checkSpriteCollision(a, b) {
      const dx = Math.abs(a.position.x - b.position.x);
      const dy = Math.abs(a.position.y - b.position.y);
      const combinedHalfWidth = (a.scale.x + b.scale.x) / 2;
      const combinedHalfHeight = (a.scale.y + b.scale.y) / 2;
      return dx < combinedHalfWidth && dy < combinedHalfHeight;
    }
  }
  