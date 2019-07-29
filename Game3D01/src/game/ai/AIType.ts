export default class AIType{

    /**不动 0*/
    static NOTHAS:number = 0;
    /**飞行冲撞的  1*/
    static FLYHIT:number = 1;
    /**任意子弹 2*/
    static BULLET:number = 2;
    /**石头人ai 召唤 和 旋风斩 3*/
    static STONE:number = 3;
    /**树跳的 5*/
    static TREE:number = 5;
    /**随机移动 6*/
    static RANDOM_MOVE:number = 6;
    /**随机移动会反弹 7*/
    static BOUNCE_RANDOM_MOVE:number = 7;
    /**移动冲撞的 8*/
    static MOVEHIT:number = 8;
    /**追人的 9*/
    static FOLLOW:number = 9;
    /**跳着追人的 10*/
    static JUMP_FOLLOW:number = 10;
}