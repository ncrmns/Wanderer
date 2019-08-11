'use strict';
export { Tile };

abstract class Tile {
  abstract name: string;
  abstract x: number;
  abstract y: number;
  abstract walkable: boolean;
  abstract getX():number;
  abstract getY():number;
  isWalkable():boolean{return this.walkable;}
}