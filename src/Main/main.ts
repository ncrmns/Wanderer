'use strict';
import { Floor } from '../Models/map/floor';
import { Terrain } from '../Models/map/map';
import { Hero } from '../Models/characters/hero';
import { Monster } from '../Models/characters/monster';
import { Boss } from '../Models/characters/boss';
import { Character } from '../Models/characters/character';
import { Potion } from '../Models/map/potion';

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const canvashb = document.querySelector('.healthbar') as HTMLCanvasElement;
const ctxhb = canvashb.getContext('2d');
document.body.addEventListener('keydown', onKeyPress);
const floor = document.getElementById('floor') as HTMLImageElement;
const wall = document.getElementById('wall') as HTMLImageElement;
const heroDown = document.getElementById('hero-down') as HTMLImageElement;
const heroRight = document.getElementById('hero-right') as HTMLImageElement;
const heroLeft = document.getElementById('hero-left') as HTMLImageElement;
const heroUp = document.getElementById('hero-up') as HTMLImageElement;
const skeleton = document.getElementById('skeleton') as HTMLImageElement;
const bossImg = document.getElementById('boss') as HTMLImageElement;
const keyblack = document.getElementById('keyblack') as HTMLImageElement;
const keygold = document.getElementById('keygold') as HTMLImageElement;
const potionImg = document.getElementById('potion') as HTMLImageElement;
const potgrey = document.getElementById('potgrey') as HTMLImageElement;


const scale: number = 70;
let turn: boolean = false;
let level: number = 0;
let terrain: Terrain;
let hero: Hero = new Hero();
let monsterInit: Floor;
let monsters: Character[] = [];
let numberOfSkeletons: number;
let orientation: string = 'down';
let enemy: Character;
let potion: Potion  = new Potion();


newMap();

function newMap(): void {
  enemy = undefined;
  guiRefresh();
  monsters = [];
  level++;
  hero.newAreaHeal();
  hero.beatBoss = false;
  hero.hasKey = false;
  renderTerrain();
  renderHero();
  generateEnemies();
  randomPotion();
}

function randomPotion(){
  let potionInit = terrain.randomFloor(hero.getX(),hero.getY());
  potion.x = potionInit.getX();
  potion.y = potionInit.getY();
  ctx.drawImage(potionImg,potion.x, potion.y);
}

function potionCheck(hero: Hero){
  if (potion.x === hero.getX() && potion.y === hero.getY()){
    hero.hasPotion = true;
  }
}

function renderTerrain(): void {
  terrain = new Terrain(level,hero);
  for (let i: number = 0; i < terrain.floors.length; i++) {
    ctx.drawImage(floor, terrain.floors[i].getX(), terrain.floors[i].getY());
  }
  for (let i: number = 0; i < terrain.walls.length; i++) {
    ctx.drawImage(wall, terrain.walls[i].getX(), terrain.walls[i].getY());
  }
  
}

function renderHero(): void {
  ctx.drawImage(heroDown, hero.x, hero.y);
  console.log(`Hero: ${hero.getLVL()} --- HP: ${hero.getHP()} --- StrikePoint: ${hero.getSP()} --- DefensePoint: ${hero.getDP()}`);
}

function generateEnemies(): void {
  numberOfSkeletons = Math.floor(Math.random() * (6 - 2) + 2);
  monsterInit = terrain.randomFloor(hero.getX(), hero.getY());
  monsters.push(new Boss(monsterInit.getX(), monsterInit.getY(), levelOfMonster(level)));
  for (let i: number = 0; i < numberOfSkeletons; i++) {
    monsterInit = terrain.randomFloor(hero.getX(), hero.getY());
    monsters.push(new Monster(monsterInit.getX(), monsterInit.getY(), levelOfMonster(level)))
  }
  randomKey(monsters);
  for (let i: number = 0; i < monsters.length; i++) {
    ctx.drawImage(monsters[i].getType() === 'Skeleton' ? skeleton : bossImg, monsters[i].getX(), monsters[i].getY());
    console.log(`${monsters[i].getType()}: ${i}: Level: ${monsters[i].getLVL()} --- HP: ${monsters[i].getHP()} --- HasKey: ${monsters[i].hasKey}`);
  }
  function randomKey(monsters: Character[]): void {
    let randomKeyIndex: number = Math.floor(Math.random() * (monsters.length - 1 - 1) + 1);
    monsters[randomKeyIndex].hasKey = true;
  }
  function levelOfMonster(level: number): number {
    let chance: number = Math.floor(Math.random() * 11 + 1);
    if (chance > 9) {
      return level + 2;
    } else if (chance > 5) {
      return level + 1;
    } else {
      return level;
    }
  }
}

function enemyMove(): void {
  console.log(monsters.length);
  for (let i: number = 0; i < monsters.length; i++) {
    switch (Math.floor(Math.random() * 4 + 1)) {
      case 1://left
        if (checkIfWalkable(monsters[i].getX() - scale, monsters[i].getY())) {
          ctx.drawImage(floor, monsters[i].getX(), monsters[i].getY());
          monsters[i].x -= scale;
          ctx.drawImage((monsters[i].getType() === 'Boss' ? bossImg : skeleton), monsters[i].getX(), monsters[i].getY());
        }
        break;
      case 2://up
        if (checkIfWalkable(monsters[i].getX(), monsters[i].getY() - scale)) {
          ctx.drawImage(floor, monsters[i].getX(), monsters[i].getY());
          monsters[i].y -= scale;
          ctx.drawImage((monsters[i].getType() === 'Boss' ? bossImg : skeleton), monsters[i].getX(), monsters[i].getY());
        }
        break;
      case 3://right
        if (checkIfWalkable(monsters[i].getX() + scale, monsters[i].getY())) {
          ctx.drawImage(floor, monsters[i].getX(), monsters[i].getY());
          monsters[i].x += scale;
          ctx.drawImage((monsters[i].getType() === 'Boss' ? bossImg : skeleton), monsters[i].getX(), monsters[i].getY());
        }
        break;
      case 4://down
        if (checkIfWalkable(monsters[i].getX(), monsters[i].getY() + scale)) {
          ctx.drawImage(floor, monsters[i].getX(), monsters[i].getY());
          monsters[i].y += scale;
          ctx.drawImage((monsters[i].getType() === 'Boss' ? bossImg : skeleton), monsters[i].getX(), monsters[i].getY());
        }
        break;
    }
  }
}

function attackEnemy(x: number, y: number): void {
  if (orientation === 'right') { enemy = enemyChecker(x + scale, y); }
  else if (orientation === 'left') { enemy = enemyChecker(x - scale, y); }
  else if (orientation === 'down') { enemy = enemyChecker(x, y + scale); }
  else if (orientation === 'up') { enemy = enemyChecker(x, y - scale); }
  if (enemy !== undefined) {
    console.log('\n' + 'Fight');
    hero.strike(enemy);
    if (enemy.isAlive()) {
      enemy.strike(hero);
      console.log(`Hero: ${hero.getLVL()} --- HP: ${hero.getHP()} --- StrikePoint: ${hero.getSP()} --- DefensePoint: ${hero.getDP()} --- HasKey: ${hero.hasKey}`);
    } else {
      if (enemy.getType() === 'Boss') {
        if (hero.hasKey) {
          hero.lvlUp();
          newMap();
          return;
        }
        hero.beatBoss = true;
      }
      if (enemy.hasKey) {
        hero.getKey();
        if (hero.beatBoss) {
          newMap();
          hero.lvlUp();
          return;
        }
      }
      hero.lvlUp();
      console.log(`Hero: ${hero.getLVL()} --- HP: ${hero.getHP()} --- StrikePoint: ${hero.getSP()} --- DefensePoint: ${hero.getDP()} --- HasKey: ${hero.hasKey}`);
      ctx.drawImage(floor, enemy.getX(), enemy.getY());
      console.log('before' + monsters);
      monsters = monsters.filter(element => {
        return (element.getX() != enemy.getX() || element.getY() != enemy.getY())});
    }
    console.log('after' +monsters);
  }
  function enemyChecker(x: number, y: number): Character {
    let characterToReturn: Character;
    for (let i: number = 0; i < monsters.length; i++) {
      if (monsters[i].getX() === x && monsters[i].getY() === y) {
        characterToReturn = monsters[i];
      }
    }
    return characterToReturn;
  }
}


function checkIfWalkable(x: number, y: number): boolean {
  let returnvalue = terrain.walkable(x, y, monsters, hero);
  for (let i: number = 0; i < monsters.length; i++) {
    if (monsters[i].getX() == x && monsters[i].getY() == y) {
      returnvalue = false;
    }
  }
  return returnvalue;
}

function onKeyPress(event: any, ) {
  switch (event.keyCode) {
    case 37:
        if (checkIfWalkable(hero.x - scale, hero.y)) {
          ctx.drawImage(floor, hero.x, hero.y);
          hero.x -= scale;
          if (turn) {
            turn = false;
            enemyMove();
          } else {
            turn = true;
          }
        }

      ctx.drawImage(floor, hero.x, hero.y);
      orientation = 'left';
      ctx.drawImage(heroLeft, hero.x, hero.y);
      potionCheck(hero);
      guiRefresh();
      break;

    case 38:
        if (checkIfWalkable(hero.x, hero.y - scale)) {
          ctx.drawImage(floor, hero.x, hero.y);
          hero.y -= scale;
          if (turn) {
            turn = false;
            enemyMove();
          } else {
            turn = true;
          }
        }
      ctx.drawImage(floor, hero.x, hero.y);
      orientation = 'up';
      ctx.drawImage(heroUp, hero.x, hero.y);
      potionCheck(hero);
      guiRefresh();
      break;

    case 39:
        if (checkIfWalkable(hero.x + scale, hero.y)) {
          ctx.drawImage(floor, hero.x, hero.y);
          hero.x += scale;
          if (turn) {
            turn = false;
            enemyMove();
          } else {
            turn = true;
          }
        }
      ctx.drawImage(floor, hero.x, hero.y);
      orientation = 'right';
      ctx.drawImage(heroRight, hero.x, hero.y);
      potionCheck(hero);
      guiRefresh();
      break;

    case 40:
        if (checkIfWalkable(hero.x, hero.y + scale)) {
          ctx.drawImage(floor, hero.x, hero.y);
          hero.y += scale;
          if (turn) {
            turn = false;
            enemyMove();
          } else {
            turn = true;
          }
        }
      ctx.drawImage(floor, hero.x, hero.y);
      orientation = 'down';
      ctx.drawImage(heroDown, hero.x, hero.y);
      potionCheck(hero);
      guiRefresh();
      break;

    case 32:
      attackEnemy(hero.x, hero.y);
      guiRefresh();
      break;

    case 72:
      hero.heal();
      guiRefresh();
      break;
  }
}

function guiRefresh(): void {
  console.log(monsters);
  ctxhb.fillStyle = 'grey';
  ctxhb.fillRect(0, 0, 1890, 150);
  ctxhb.drawImage((hero.hasKey ? keygold : keyblack), 1000, 0);
  ctxhb.drawImage((hero.hasPotion ? potionImg : potgrey), 1400, 30);
  ctxhb.fillStyle = 'black';
  ctxhb.fillRect(200, 20, hero.getmaxHP() * 4, 10);
  ctxhb.fillStyle = 'green';
  ctxhb.fillRect(200, 20, hero.getHP() * 4, 10);
  ctxhb.fillStyle = 'yellow';
  ctxhb.fillRect(200, 60, hero.getSP() * 5, 10);
  ctxhb.fillStyle = 'blue';
  ctxhb.fillRect(200, 100, hero.getDP() * 5, 10);
  // if (enemy != undefined){
  //   ctxhb.fillStyle = 'green';
  //   ctxhb.fillRect(500, 8, enemy.getDP() * 8, 5);





  document.getElementById('heroHp').innerHTML = `HP:${Math.floor(hero.getHP())} / ${Math.floor(hero.getmaxHP())}`;
  document.getElementById('heroSp').innerHTML = `SP:${hero.getSP()}`;
  document.getElementById('heroDp').innerHTML = `DP:${hero.getDP()}`;
  document.getElementById('heroLevel').innerHTML = `LvL:${hero.getLVL()}`;
  document.getElementById('mapLevel').innerHTML = `Map level:${level}`;
  // document.getElementById('enemyHp').innerHTML = `${enemy.getType()}:${enemy.getHP()}`;
}
