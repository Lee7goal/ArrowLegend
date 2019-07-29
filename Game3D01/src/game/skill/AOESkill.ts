import BaseSkill from "./BaseSkill";
import SysBullet from "../../main/sys/SysBullet";
import BoomEffect from "../effect/BoomEffect";
import GameHitBox from "../GameHitBox";
import Game from "../Game";
import GameBG from "../GameBG";
import Monster from "../player/Monster";

export default class AOESkill extends BaseSkill {
    
    constructor(sys: SysBullet) { 
        super(sys); 
        this.sysBullet.bulletCd = 3000;
    }

    exeSkill(now: number, pro: Monster): boolean  {
        if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) > GameBG.ww * 6)
        {
            if (now >= this.cd)  {
                pro.sp3d.transform.localPositionY = 0;
                pro.curLen = 0;
                pro.moveLen = GameHitBox.faceToLenth(pro.hbox,Game.hero.hbox);
                pro.setSpeed(Math.ceil(pro.moveLen / GameBG.ww));
    
                let a: number = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
                pro.rotation(a);
    
                this.cd = now + this.sysBullet.bulletCd;
                return true;
            }
        }
        return false;
    }

    showEff(pro: Monster):void
    {
        pro.curLen = pro.moveLen = 0;
        BoomEffect.getEffect(pro, this.sysBullet.boomEffect);
        if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) <= this.sysBullet.attackAngle) {
            Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
        }
    }

}