'use strict';
import { Tile } from './tile';
import { Floor } from './floor';
import { Wall } from './wall';
import { Character } from '../characters/character';
export { Terrain };

class Terrain {
  level: number;
  floors: Floor[] = [];
  walls: Wall[] = [];
  freeFloors: Floor[];
  private initFloor: number[][] = [];
  private initWall: number[][] = [];
  constructor(level:number,hero : Character){
    let xhero: number = hero.getX()/70;
    let yhero: number = hero.getY()/70;
    for (let i: number = 0; i<27 ;i++){
      for (let j: number = 0; j<12; j++){
        let random : number = Math.floor(Math.random() * 11) + 1;
        if (random>9){
          if (xhero === i && yhero === j){
            this.initFloor.push([i,j]);
          } else {
            this.initWall.push([i,j]);
          }
        } 
        if (random<=9){
          this.initFloor.push([i,j]);
        }
      }
    }
    this.level = level;
    for (let i: number = 0; i < this.initFloor.length; i++) {
      this.floors.push(new Floor(this.initFloor[i][0], this.initFloor[i][1]));
    }
    for (let i: number = 0; i < this.initWall.length; i++) {
      this.walls.push(new Wall(this.initWall[i][0], this.initWall[i][1]));
    }
    this.freeFloors = this.floors;
    this.freeFloors = this.freeFloors.filter(element => element.getX() !== 0 && element.getY() !== 0 );
  }
  
  walkable(x: number , y: number ,monsters : Character[], hero: Character): boolean {
    let walkable = false;
    let counter = 0;
    for (let i: number = 0; i<this.floors.length; i++) {
      if (x === this.floors[i].getX() && y === this.floors[i].getY()) {
          walkable = true;
      }
    }
    for (let i: number = 0; i< monsters.length; i++){
      if (x === monsters[i].getX() && y === monsters[i].getY()){
        walkable = false;
      }
      if (x === hero.getX() && y === hero.getY()){
        walkable = false;
      }
      return walkable;
    }
  }


  randomFloor(x: number,y: number):Floor{
    let random: number = Math.floor(Math.random() * this.freeFloors.length);
    let returnvalue: Floor = this.freeFloors[random];
    this.freeFloors = this.freeFloors.filter(element => element.getX() !== x && element.getY() !== y );
    this.freeFloors = this.freeFloors.filter(element => element.getX() !== returnvalue.getX() && element.getY() !== returnvalue.getY() );
    return returnvalue;
  }
}