import SysSkill from "../../../main/sys/SysSkill";
import SysBuff from "../../../main/sys/SysBuff";
import Game from "../../Game";
import App from "../../../core/App";
import GamePro from "../../GamePro";

export default class PlayerBuff {
    protected skill: SysSkill;
    protected buff: SysBuff;

    protected skillCD: number = 0;
    public chixuCD: number = 0;

 
 
    bullet:GamePro;
    to:GamePro;
    hurtValue:number = 0;
    nextTime:number  = 0;
    startTime:number = 0;
    curTimes:number = 0;

    constructor() { }

    exe(now:number): void  {
        
    }
}