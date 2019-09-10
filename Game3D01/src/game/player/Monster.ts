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
import MonsterBoomEffect from "../effect/MonsterBoomEffect";
import ArcherAI from "../ai/ArcherAI";
import SysSkill from "../../main/sys/SysSkill";
import SysBuff from "../../main/sys/SysBuff";
import BaseAI from "../ai/BaseAi";
import GameBG from "../GameBG";
import MemoryManager from "../../main/scene/battle/MemoryManager";
import GameEvent from "../../main/GameEvent";

export default class Monster extends GamePro {
    static TAG: string = "Monster_";

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

    onCie():void
    {
        if(!this.isIce)
        {
            this.isIce = true;
            this.animator.speed = 0;
        }
    }

    offCie():void
    {
        if(this.isIce)
        {
            this.isIce = false;
            this.animator.speed = 1;
        }
    }

    public startAi(): void {
        super.startAi();
    }

    public stopAi(): void {
        super.stopAi();
    }

    public setShadowSize(ww: number): void {
        super.setShadowSize(ww);
        Game.footLayer.addChild(this._bulletShadow);
    }

    updateUI():void
    {
        super.updateUI();
        this._bulletShadow && this._bulletShadow.pos(this.hbox.cx - (this._bulletShadow.img.width - GameBG.mw) * 0.5, this.hbox.cy - (this._bulletShadow.img.height - GameBG.mw) * 0.5);
    }

    init(): void {
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

    show():void
    {
        Game.layer3d.addChild(this.sp3d);
        Game.bloodLayer.addChild(this._bloodUI);
        Game.footLayer.addChild(this._bulletShadow);
    }

    hide():void
    {
        this.sp3d && this.sp3d.removeSelf();
        this._bloodUI && this._bloodUI.removeSelf();
        this._bulletShadow && this._bulletShadow.removeSelf();
    }

    public initBlood(hp: number): void {
        super.initBlood(hp, hp);
        this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 90);
    }

    public hurt(hurt: number, isCrit: boolean,isBuff:boolean = false): void {
        super.hurt(hurt, isCrit);
        if(this.sysEnemy.isBoss)
        {
            Laya.stage.event(GameEvent.BOOS_BLOOD_UPDATE,hurt);
        }
        if(isBuff)
        {
            return;
        }
        HitEffect.addEffect(this);
        MonsterBoomEffect.addEffect(this,this.tScale);
    }

    die(): void {
        this.setKeyNum(1);
        this.once(Game.Event_KeyNum, this, this.onDie);
        this.play(GameAI.Die);

        if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
            Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
        }

        if(Game.hero.playerData.level <= 10)
        {
            if (this.sysEnemy.dropExp > 0)  {
                let skill3001: SysSkill = Game.skillManager.isHas(3001);//聪明
                let addNum: number = 0;
                if (skill3001)  {
                    console.log(skill3001.skillName);
                    let buff3001: SysBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, skill3001.skillEffect1);
                    addNum = Math.ceil(this.sysEnemy.dropExp * buff3001.addExp / 1000);
                }
                Game.hero.playerData.exp += this.sysEnemy.dropExp + addNum;
            }
        }

        let skill4001: SysSkill = Game.skillManager.isHas(4001);//嗜血
        if (skill4001)  {
            let buff4001: SysBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, skill4001.skillEffect1);
            Game.hero.addBlood(Math.floor(Game.hero.gamedata.maxhp * buff4001.addHp / 1000));
            console.log(skill4001.skillName);
        }

    }

    onDie(key): void {
        Game.selectHead.removeSelf();
        Game.selectFoot.removeSelf();
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(Monster.TAG + this.sysEnemy.enemymode,this);
        DieEffect.addEffect(this);
        MemoryManager.ins.app(this.sp3d.url);
    }

    clear():void
    {
        Game.selectHead.removeSelf();
        Game.selectFoot.removeSelf();
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(Monster.TAG + this.sysEnemy.enemymode,this);
        MemoryManager.ins.app(this.sp3d.url);
    }

    static getMonster(enemyId: number, xx: number, yy: number, mScale?: number, hp?: number): Monster {
        console.log("当前的怪", enemyId);
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, enemyId);
        let now = Game.executor.getWorldNow();
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
        var gpro:Monster = Laya.Pool.getItemByClass(Monster.TAG + sysEnemy.enemymode,Monster);
        // var gpro: Monster = new Monster();
        gpro.curLen = gpro.moveLen = 0;
        gpro.sysEnemy = sysEnemy;
        gpro.init();
        if(!gpro.sp3d)
        {
            var sp: Laya.Sprite3D = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
            MemoryManager.ins.add(sp.url);
            gpro.setSp3d(sp,GameBG.ww * 0.8);
            console.log("克隆一个怪");
        }
        
        gpro.hurtValue = sysEnemy.enemyAttack;


        if (sysEnemy.moveType > 0) {
            var MOVE: any = Laya.ClassUtils.getClass(MoveType.TAG + sysEnemy.moveType);
            gpro.setGameMove(new MOVE());
        }
        let tScale: number = sysEnemy.zoomMode / 100;
        tScale = mScale ? mScale : tScale;
        gpro.tScale = tScale;
        gpro.sp3d.transform.scale = new Laya.Vector3(tScale, tScale, tScale);
        Game.map0.Eharr.push(gpro.hbox);//加入敌人组
        Game.map0.Fharr.push(gpro.hbox);//加入碰撞伤害组
        //Game.map0.addChild(gpro.sp2d);
        
        gpro.setShadowSize(sysEnemy.zoomShadow);

        gpro.setXY2DBox(xx, yy);
        gpro.initBlood(hp);

        var MonAI: any = Laya.ClassUtils.getClass(AttackType.TAG + sysEnemy.enemyAi);
        console.log("当前怪的AI", sysEnemy.id, sysEnemy.txt, sysEnemy.enemyAi, MonAI);
        if (MonAI == null) {
            console.log('没有这个怪的AI', sysEnemy.id);
        }

        gpro.setGameAi(new MonAI(gpro));

        // gpro.setGameAi(new ArcherAI(gpro));
        
        // let gp:GamePro = new GamePro(0,0);
        // gpro.getGameAi().hit(gp);
        // gpro._bulletShadow.visible = false;
        // gpro.bloodUI.visible = false;
        // setTimeout(() => {
            gpro.startAi();
            Game.layer3d.addChild(gpro.sp3d);
        //     gpro._bulletShadow.visible = true;
        //     gpro.bloodUI.visible = true;
        // }, 1100);
        console.log("ai的长度",Game.AiArr.length);
        return gpro;
    }
}

