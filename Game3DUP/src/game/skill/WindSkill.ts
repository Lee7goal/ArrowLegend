import BaseSkill from "./BaseSkill";
import SysBullet from "../../main/sys/SysBullet";
import GamePro from "../GamePro";
import GameHitBox from "../GameHitBox";
import Game from "../Game";
import GameBG from "../GameBG";
import { GameAI } from "../ai/GameAI";
import Monster from "../player/Monster";

export default class WindSkill extends BaseSkill {
    constructor(sys: SysBullet) { 
        super(sys); 
        this.sysBullet.bulletCd = 4000;
    }

    exeSkill(now: number, pro: Monster): boolean  {
        if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) > GameBG.ww * 6)  {
            if (now >= this.cd)  {
                let a: number = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);//旋风斩
                pro.rotation(a);
                pro.play(GameAI.SkillStart);
                pro.curLen = 0;
                pro.moveLen = GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox);
                this.cd = now + this.sysBullet.bulletCd;
                return true;
            }
        }
        return false;
    }
}