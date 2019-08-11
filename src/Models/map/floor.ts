import { Tile } from './tile';
export { Floor };

class Floor extends Tile {
  name: string;
  x: number;
  y: number;
  walkable: boolean;

  constructor(x: number,y: number,scale: number = 70){
    super()
    this.name = x.toString() + y.toString();
    this.x = x*scale;
    this.y = y*scale;
    this.walkable = true;
  }

  getX():number{return this.x;}
  getY():number{return this.y;}
}