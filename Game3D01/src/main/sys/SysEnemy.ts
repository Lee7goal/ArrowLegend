import App from "../../core/App";

export default class SysEnemy {
    static NAME:string = 'sys_enemy.txt';
    constructor() { }

    public id:number = 0;
    public enemyType:number = 0;
    public enemyLevel:number = 0;
    public enemyHp:number = 0;
    public enemyAttack:number = 0;
    public enemymode:number = 0;
    public skillId:string = '';
}