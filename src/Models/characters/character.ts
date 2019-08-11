'use strict';
import { d6 } from '../../GameLogic/d6';
export { Character };

abstract class Character {
  abstract type: string;
  abstract x: number;
  abstract y: number;
  protected LVL: number = 1;
  protected maxHP: number = 100;
  protected HP: number = 100;
  protected DP: number = 2;
  protected SP: number = 2;
  protected alive: boolean = true;
  hasKey: boolean = false;

  getType(): string {return this.type;}
  getX(): number { return this.x; }
  getY(): number { return this.y; }
  getLVL(): number { return this.LVL; }
  getmaxHP(): number { return this.maxHP; }
  getHP(): number { return this.HP; }
  getDP(): number { return this.DP; }
  getSP(): number { return this.SP; }
  isAlive(): boolean { return this.alive; }



  damage(value: number) {
    console.log(`${this.type} hurts: ${value} damage`)
    this.HP -= value;
    if (this.HP < 0) {
      this.alive = false;
    }
  }

  getKey(){
    this.hasKey = true;
  }

  lvlUp() {
    this.LVL++;
    this.maxHP += d6();
    this.DP += d6();
    this.SP += d6();
  }

  attack(other: Character): void {
    this.strike(other);
    if (other.isAlive()) {
      other.strike(this);
    } else {
      this.lvlUp();
    }
  }

  strike(other: Character) {
    let SV: number = this.SP + 2 * d6();
    if (SV > other.getDP()) {
      other.damage(SV - other.getDP());
    }
  }
}
