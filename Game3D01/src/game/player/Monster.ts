import GamePro from "../GamePro";
import GameProType from "../GameProType";
import SysEnemy from "../../main/sys/SysEnemy";
import Game from "../Game";
import SplitSkill from "../skill/SplitSkill";
import { GameAI } from "../ai/GameAI";
import { ui } from "./../../ui/layaMaxUI";
import SkillType from "../skill/SkillType";
import MoveType from "../move/MoveType";
import AttackType from "../ai/AttackType";
import App from "../../core/App";
import SysSkill from "../../main/sys/SysSkill";

export default class Monster extends GamePro {
    static TAG:string = "Monster";

    public splitTimes: number;
    public sysEnemy: SysEnemy;
    constructor() {
        super(GameProType.RockGolem_Blue, 0);
        this._bulletShadow = new ui.test.BulletShadowUI();
        Game.footLayer.addChild(this._bulletShadow);
    }
    die(): void {
        Game.hero.setKeyNum(1);
        Game.hero.once(Game.Event_KeyNum, this, this.onDie);
        this.play(GameAI.Die);
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        if (this.getSkill() && this.getSkill() instanceof SplitSkill) {
            this.getSkill().exeSkill(this);
            this.setSkill(null);

        }
        if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
            Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
        }
    }

    onDie(key): void {
        this.sp3d.removeSelf();
        let dieEff: Laya.Sprite3D = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/monsterDie/monster.lh"));
        Game.layer3d.addChild(dieEff);
        dieEff.transform.localPosition = this.sp3d.transform.localPosition;
        setTimeout(() => {
            dieEff.removeSelf();
        }, 1000);
        Laya.Pool.recover(Monster.TAG,this);
    }

    static getMonster(enemyId: number, xx: number, yy: number, mScale?: number, hp?: number): Monster {
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, enemyId);
        let sysSkill: SysSkill;
        var sp = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
        if (!hp)  {
            hp = sysEnemy.enemyHp;
            if (sysEnemy.skillId > 0)  {
                sysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME, sysEnemy.skillId);
                if (sysSkill.effectType == SkillType.SPLIT)  {
                    hp = sysEnemy.enemyHp / sysSkill.effect1;
                }
            }
        }
        var gpro:Monster = Laya.Pool.getItemByClass(Monster.TAG,Monster);
        gpro.sysEnemy = sysEnemy;
        gpro.setSp3d(sp);

        if(sysEnemy.attackType > 0)
        {
            var ATT: any = Laya.ClassUtils.getClass(AttackType.TAG + sysEnemy.attackType);
            gpro.setGameAi(new ATT(gpro));
        }
        if(sysEnemy.moveType > 0)
        {
            var MONS: any = Laya.ClassUtils.getClass(MoveType.TAG + sysEnemy.moveType);
            gpro.setGameMove(new MONS());
        }
        if (sysSkill)  {
            var SKILL: any = Laya.ClassUtils.getClass(SkillType.TAG + sysSkill.effectType);
            gpro.setSkill(new SKILL());
        }

        let tScale: number = sysEnemy.zoomMode / 100;
        tScale = mScale ? mScale : tScale;
        gpro.sp3d.transform.scale = new Laya.Vector3(tScale, tScale, tScale);
        Game.map0.Eharr.push(gpro.hbox);//加入敌人组
        Game.map0.Fharr.push(gpro.hbox);//加入碰撞伤害组
        Game.map0.addChild(gpro.sp2d);
        Game.layer3d.addChild(sp);
        gpro.setShadowSize(sysEnemy.zoomShadow);

        gpro.setXY2DBox(xx, yy);
        gpro.startAi();
        gpro.initBlood(hp);
        return gpro;
    }
}

