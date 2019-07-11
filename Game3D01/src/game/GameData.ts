export default class GameData{
    
    public hp:number    = 600;
    public maxhp:number = 600;

    /**反弹次数 */
    public bounce:number  = 0;
    /**单位类别 */
    public proType:number = 0;
    /**伤害 */
    public damage:number = 10;
    /**攻击次数 -1为无限 */
    public  ammoClip:number = -1;
    /**攻击CD　1000毫秒 */
    public  attackCD:number = 1000;

    constructor(){}

    public initData():void{
        this.bounce = 0;
    }
    
}