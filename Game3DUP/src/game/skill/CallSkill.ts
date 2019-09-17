import BaseSkill from "./BaseSkill";
import SysBullet from "../../main/sys/SysBullet";
import GamePro from "../GamePro";
import { GameAI } from "../ai/GameAI";
import Game from "../Game";
import { ui } from "./../../ui/layaMaxUI";
import Monster from "../player/Monster";
import GameBG from "../GameBG";

export default class CallSkill extends BaseSkill {
    private callId:number = 0;
    private callCd:number = 0;
    constructor(sys: SysBullet) { 
        super(sys); 
        let arr:string[] = this.sysBullet.callInfo.split(',');
        this.callId = Number(arr[0]);
        this.callCd = Number(arr[2]);
        this.cd = Game.executor.getWorldNow() + this.callCd;
    }

    exeSkill(now: number, pro: GamePro): boolean  {
        if (now >= this.cd)  {
            //召唤
            pro.play(GameAI.NormalAttack);
            let monster: Monster = Monster.getMonster(this.callId, pro.hbox.x + GameBG.ww, pro.hbox.y - GameBG.ww);
            let zhaohuan: ui.test.zhaohuanUI = new ui.test.zhaohuanUI();
            Game.bloodLayer.addChild(zhaohuan);
            zhaohuan.pos(pro.hbox.cx, pro.hbox.cy);
            setTimeout(() => {
                zhaohuan.removeSelf();
            }, 1500);
            this.cd = now + this.callCd;
            return true;
        }
        return false;
    }
}