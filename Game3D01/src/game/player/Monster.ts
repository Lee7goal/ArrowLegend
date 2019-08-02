import GamePro from "../GamePro";
import GameProType from "../GameProType";
import SysEnemy from "../../main/sys/SysEnemy";
import Game from "../Game";
import { GameAI } from "../ai/GameAI";
import { ui } from "./../../ui/layaMaxUI";
import MoveType from "../move/MoveType";
import AttackType from "../ai/AttackType";
import App from "../../core/App";
import JumpMove from "../move/JumpMove";
import FlyGameMove from "../move/FlyGameMove";
import SysBullet from "../../main/sys/SysBullet";
import MonsterShader from "./MonsterShader";
import DieEffect from "../effect/DieEffect";
import HitEffect from "../effect/HitEffect";
// import MonsterAI from "../ai/MonsterAI";
// import BaseAI from "../ai/BaseAi";
// import FlyAndHitAi from "../ai/FlyAndHitAi";
// import FlowerAI from "../ai/FlowerAI";
// import StoneAI from "../ai/StoneAI";
// import TreeAI from "../ai/TreeAI";
// import RandMoveAI from "../ai/RandMoveAI";
// import JumpFollowAI from "../ai/JumpFollowAI";
// import PlaneGameMove from "../move/PlaneGameMove";
// import BackMove from "../move/BackMove";

export default class Monster extends GamePro {
    static TAG: string = "Monster";

    public splitTimes: number;
    public sysEnemy: SysEnemy;
    public sysBullet: SysBullet;

    public curLen: number;
    public moveLen: number;
    public aiType: number;

    constructor() {
        super(GameProType.RockGolem_Blue, 0);
        this._bulletShadow = new ui.test.BulletShadowUI();
        Game.footLayer.addChild(this._bulletShadow);
    }

    public setShadowSize(ww: number): void  {
        super.setShadowSize(ww);
        Game.footLayer.addChild(this._bulletShadow);
    }

    init(): void  {
        let sysBullet: SysBullet;
        if (this.sysEnemy.normalAttack > 0) {
            sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
            this.aiType = sysBullet.bulletType;
        }

        if (this.sysEnemy.skillId != '0') {
            var arr: string[] = this.sysEnemy.skillId.split(',');
            for (var m = 0; m < arr.length; m++) {
                let id: number = Number(arr[m]);
                if (id > 0) {
                    sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                    this.aiType = sysBullet.bulletType;
                }
            }
        }
    }

    public initBlood(hp: number): void {
        super.initBlood(hp);
        this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 90);
    }

    public hurt(hurt: number): void {
        // hurt = 1;
        super.hurt(hurt);
        HitEffect.addEffect(this);
    }

    die(): void {
        this.setKeyNum(1);
        this.once(Game.Event_KeyNum, this, this.onDie);
        this.play(GameAI.Die);

        if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
            Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
        }
    }

    onDie(key): void {
        Game.selectHead.removeSelf();
        Game.selectFoot.removeSelf();
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        this.sp3d.removeSelf();
        // Laya.Pool.recover(Monster.TAG,this);
        DieEffect.addEffect(this);
    }

    static getMonster(enemyId: number, xx: number, yy: number, mScale?: number, hp?: number): Monster {
        console.log("当前的怪", enemyId);
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, enemyId);
        var sp: Laya.Sprite3D = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
        Game.monsterResClones.push(sp);

        // console.log(sysEnemy.enemymode);
        // console.log(sp);
        //sp._children.length
        if (!MonsterShader.map[sysEnemy.enemymode]) {
            //console.log(sysEnemy.enemymode ,"+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");
            MonsterShader.map[sysEnemy.enemymode] = new MonsterShader(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
        }


        if (!hp) {
            hp = sysEnemy.enemyHp;
            if (sysEnemy.skillId != '0') {
                var arr: string[] = sysEnemy.skillId.split(',');
                for (var m = 0; m < arr.length; m++) {
                    let id: number = Number(arr[m]);
                    if (id > 0) {
                        let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                        if (sysBullet.bulletType == AttackType.SPLIT) {
                            hp = sysEnemy.enemyHp / sysBullet.splitNum;
                        }
                    }
                }
            }
        }
        // var gpro:Monster = Laya.Pool.getItemByClass(Monster.TAG,Monster);
        var gpro: Monster = new Monster();
        gpro.curLen = gpro.moveLen = 0;
        gpro.sysEnemy = sysEnemy;
        gpro.init();
        gpro.setSp3d(sp);

        if (sysEnemy.moveType > 0)  {
            var MOVE: any = Laya.ClassUtils.getClass(MoveType.TAG + sysEnemy.moveType);
            gpro.setGameMove(new MOVE());
            //gpro.setGameMove(new PlaneGameMove());
            // gpro.setGameMove(new BackMove());
        }

        let tScale: number = sysEnemy.zoomMode / 100;
        tScale = mScale ? mScale : tScale;
        gpro.sp3d.transform.scale = new Laya.Vector3(tScale, tScale, tScale);
        Game.map0.Eharr.push(gpro.hbox);//加入敌人组
        Game.map0.Fharr.push(gpro.hbox);//加入碰撞伤害组
        //Game.map0.addChild(gpro.sp2d);
        Game.layer3d.addChild(sp);
        gpro.setShadowSize(sysEnemy.zoomShadow);

        gpro.setXY2DBox(xx, yy);
        gpro.initBlood(hp);

        var MonAI: any = Laya.ClassUtils.getClass(AttackType.TAG + sysEnemy.enemyAi);
        console.log("当前怪的AI", sysEnemy.id, sysEnemy.txt, sysEnemy.enemyAi, MonAI);
        if (MonAI == null)  {
            console.log('没有这个怪的AI', sysEnemy.id);
        }
        gpro.setGameAi(new MonAI(gpro));
        //gpro.setGameAi(new BaseAI(<Monster>gpro));
        // gpro.setGameAi(new FlyAndHitAi(gpro));
        // gpro.setGameAi(new FlowerAI(gpro));
        //gpro.setGameAi(new SplitAI(gpro));
        // gpro.setGameAi(new StoneAI(gpro));
        // gpro.setGameAi(new TreeAI(gpro));

        // gpro.setGameAi(new RandMoveAI(gpro));
        // gpro.setGameAi(new BounceRandomMoveAI(gpro));
        // gpro.setGameAi(new FollowAI(gpro));
        // gpro.setGameAi(new JumpFollowAI(gpro));

        gpro.startAi();
        return gpro;
    }
}

