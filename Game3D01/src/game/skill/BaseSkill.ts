import SysBullet from "../../main/sys/SysBullet";
import GamePro from "../GamePro";

export default class BaseSkill{
    public cd:number = 0;
    protected sysBullet:SysBullet;

    constructor(sys:SysBullet){
        this.sysBullet = sys;
    }

    exeSkill(now:number,pro:GamePro):boolean
    {
        return false;
    }
}