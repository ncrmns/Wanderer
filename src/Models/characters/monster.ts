'use strict';
import { Character } from './character';
import { d6 } from '../../GameLogic/d6';
export { Monster };


class Monster extends Character {
  type: string;
  x: number;
  y: number;
  constructor(
    x: number,
    y: number,
    LVL: number = 1,
    HP: number = 2 * LVL * d6(),
    DP: number = LVL / 2 * d6(),
    SP: number = LVL * d6()
  ) {
    super()
    this.type = 'Skeleton';
    this.x = x;
    this.y = y;
    this.LVL = LVL;
    this.HP = HP;
    this.DP = DP;
    this.SP = SP;
  }
}