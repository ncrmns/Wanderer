'use strict';
import { Character } from './character';
import { d6 } from "../../GameLogic/d6";
export { Hero };

class Hero extends Character {
  type: string;
  x: number;
  y: number;
  beatBoss: boolean;
  hasPotion : boolean = false;
  constructor(
    x: number = 0,
    y: number = 0,
    LVL: number = 1,
    HP: number = 20 + d6() + d6() + d6(),
    DP: number = d6() + d6(),
    SP: number = 5 + d6()
  ) {
    super()
    this.maxHP = HP;
    this.beatBoss = false;
    this.type = 'Hero';
    this.x = x;
    this.y = y;
    this.LVL = LVL;
    this.HP = HP;
    this.DP = DP;
    this.SP = SP;
  }

  heal(){
    if (this.hasPotion){
      this.HP += this.maxHP/4;
      if (this.HP>this.maxHP){
        this.HP = this.maxHP;
      }
      this.hasPotion = false;
    }
  }

  newAreaHeal() {
    let random: number = Math.floor(Math.random() * 10);
    if (random == 9) {
      this.HP += this.maxHP / 2;
    } else if (random > 6) {
      this.HP += this.maxHP / 3;
    } else {
      this.HP += this.maxHP / 10;
    }
    if (this.HP > this.maxHP) {
      this.HP = this.maxHP;
    }
  }
}