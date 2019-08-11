'use strict';
import { Tile } from './tile';
export { Wall };

class Wall extends Tile {
  name: string;
  x: number;
  y: number;
  walkable: boolean;

  constructor(x: number,y: number,scale: number = 70){
    super()
    this.name = x.toString() + y.toString();
    this.x = x*scale;
    this.y = y*scale;
    this.walkable = false;
  }

  getX():number{return this.x;}
  getY():number{return this.y;}

}