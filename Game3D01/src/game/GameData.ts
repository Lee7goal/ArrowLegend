export default class GameData{
    
    public hp:number    = 600;
    public maxhp:number = 600;

    /**反弹次数 */
    public bounce:number  = 0;
    /**单位类别 */
    private proType_:number = 0;
    /**伤害 */
    public damage:number = 10;
    /**攻击次数 -1为无限 */
    public  ammoClip:number = -1;
    /**攻击CD　1000毫秒 */
    public  attackCD:number = 1000;
    /**转身速度 （<=0 瞬间转身） */
    public  rspeed:number = 20;

    constructor(){}

    public initData():void{
        this.bounce = 0;
    }

    public set proType(pt:number){
        this.proType_ = pt;
        if(this.proType_<=800){
            this.rspeed = 0;
        }else{
            this.rspeed = 20;
        }
    }

    public get proType():number{
        return this.proType_;
    }
    
}