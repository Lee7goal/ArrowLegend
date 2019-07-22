import App from "../../core/App";

export default class SysEnemy {
    static NAME:string = 'sys_enemy.txt';
    constructor() { }

    public id:number = 0;
    public moveType:number = 0;
    public attackType:number = 0;
    public zoomMode:number = 0;
    public enemyLevel:number = 0;
    public enemyHp:number = 0;
    public enemyAttack:number = 0;
    public enemymode:number = 0;
    public enemyBlack:number = 0;
    public bulletId:number = 0;
    public enemySpeed:number = 0;
    public bulletNum:number = 0;
    public bulletAngle:number = 0;
    public skillId:number = 0;
    public isBoss:number = 0;
    public enemyType:number = 0;
    public txt:string = '';
    public zoomShadow:number = 0;
}