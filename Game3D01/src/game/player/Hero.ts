import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import GameBG from "../GameBG";
import PlaneGameMove from "../move/PlaneGameMove";
import HeroAI from "../ai/HeroAI";
import { GameAI } from "../ai/GameAI";
import HitEffect from "../effect/HitEffect";
import PlayerData from "../data/PlayerData";
import SysSkill from "../../main/sys/SysSkill";
import SysBuff from "../../main/sys/SysBuff";
import App from "../../core/App";
import WudiRotateScript from "../controllerScript/WudiRotateScript";
import BloodEffect from "../effect/BloodEffect";

export default class Hero extends GamePro {

    static bornX:number;
    static bornY:number;

    public playerData: PlayerData = new PlayerData();
    constructor() {
        super(GameProType.Hero, 0);
        this.reset();
        this.unBlocking = true;
        this.setGameMove(new PlaneGameMove());
        this.setGameAi(new HeroAI());
        // this.busi = true;
    }

    addBuff(buffId:number):void
    {
        if(this.buffAry.indexOf(buffId) == -1)
        {
            Game.buffM.addBuff(buffId,this);
            this.buffAry.push(buffId);
        }
    }

    lossBlood():number
    {
        return (this.gamedata.maxhp - this.gamedata.hp) / this.gamedata.maxhp;
    }

    changeBlood(sys:SysSkill):boolean
    {
        let buff:SysBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys.skillEffect1);
        if(buff)
        {
            if(sys.id == 4002 || sys.id == 4004)//加血的
            {
                this.addBlood(Math.floor(Game.hero.gamedata.maxhp * buff.addHp / 1000));
                return true;
            }
            else if(sys.id == 4003)
            {
                this.changeMaxBlood(buff.hpLimit / 1000);
                return true;
            }
        }
        return false;
    }

    changeMaxBlood(changeValue:number):void
    {
        if(changeValue > 0)
        {
            this.gamedata.hp = this.gamedata.hp + Math.floor(this.gamedata.maxhp * changeValue);
        }
        this.gamedata.maxhp = Math.floor(this.gamedata.maxhp * (1 + changeValue));
        if(this.gamedata.hp >= this.gamedata.maxhp)
        {
            this.gamedata.hp = this.gamedata.maxhp;
        }
        this.initBlood(this.gamedata.hp);
    }

    addBlood(addValue: number): void {
        this.gamedata.hp = this.gamedata.hp + addValue;
        this.gamedata.hp = Math.min(this.gamedata.hp, this.gamedata.maxhp);
        this.initBlood(this.gamedata.hp);

        BloodEffect.add("+" + addValue,this._bloodUI,false,"main/greenFont.png");
    }

    private updateAttackSpeed(): void {
        console.log("修改攻速");
    }

    public reset(): void {
        this.gamedata.hp = this.gamedata.maxhp = 600;
        this.buffAry.length = 0;
    }

    resetAI():void
    {
        (this.getGameAi() as HeroAI).run = false;
    }

    private wudi:Laya.Sprite3D;
    public isWudi:boolean = false;
    setWudi(bool:boolean):void
    {
        if(this.isWudi == bool)
        {
            return;
        }
        this.isWudi = bool;
        if(bool)
        {
            if(!this.wudi)
            {
                let sp:Laya.Sprite3D = Laya.loader.getRes("h5/bullets/skill/5009/monster.lh");
                if(sp)
                {
                    this.wudi = sp;
                    this.wudi.transform.localPositionY = -0.5;
                    this.wudi.addComponent(WudiRotateScript);
                }
            }
            this.sp3d.addChild(this.wudi);
        }
        else
        {
            this.wudi && this.wudi.removeSelf();
        }
    }

    init(): void {

        if (Game.battleLoader.continueRes)  {
            Game.hero.gamedata.hp = Game.battleLoader.continueRes.curhp;
            Game.hero.gamedata.maxhp = Game.battleLoader.continueRes.maxhp;
            let skills:string = Game.battleLoader.continueRes.skills;
            if(skills.length > 0)
            {
                let arr:string [] = skills.split(",");
                for(let i = 0; i < arr.length; i++)
                {
                    let info:string[] = arr[i].split("_");
                    if(info.length == 2)
                    {
                        let sysSkill:SysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME,Number(info[0]));
                        sysSkill.curTimes = Number(info[1]);
                        Game.skillManager.addSkill(sysSkill);
                    }
                }
            }
        }
        
        this.isDie = false;
        this.setKeyNum(1);
        this.acstr = "";
        let sp: Laya.Sprite3D = Laya.loader.getRes("h5/hero/hero.lh");
        Game.layer3d.addChild(sp);
        //var scale = 1.2;
        var scale = 1.4;
        sp.transform.localScale = new Laya.Vector3(scale, scale, scale);
        this.setSp3d(sp as Laya.Sprite3D);

        this.play("Idle");

        // this.addWeapon();

        // this.setXY2DBox(GameBG.MAP_COL * GameBG.ww * 0.5, GameBG.MAP_ROW * GameBG.ww * 0.5);
        this.pos2.x = this.pos2.z = 0;
        this.sp3d.transform.localPositionX = 0;
        this.sp3d.transform.localPositionY = 0;
        console.log("出生位置",Hero.bornX,Hero.bornY)
        this.setXY2DBox(Hero.bornX, Hero.bornY);

        // this.setXY2DBox(GameBG.MAP_COL * GameBG.ww * 0.5, GameBG.MAP_ROW * GameBG.ww * 0.5);

        this.initBlood(this.gamedata.hp);
        this.addFootCircle();

        Game.map0.Hharr.push(this.hbox);

        this.gamedata.rspeed = 0;
        this.rotation(90 / 180 * Math.PI);
        // this.sp3d.transform.localPositionY = 15;
        // Laya.Tween.to(this.sp3d.transform, { localPositionY: 0 }, 600, Laya.Ease.strongIn, new Laya.Handler(this, this.onJumpDown));
        this.onJumpDown();

        // if (Game.battleLoader.mapId % 1000 == 0) {
        //     setTimeout(() => {
        //         Game.openDoor();
        //     }, 3000);
        // }

        Laya.stage.on(Game.Event_ADD_HP, this, this.addBlood);
        Laya.stage.on(Game.Event_UPDATE_ATTACK_SPEED, this, this.updateAttackSpeed);

        this.updateUI();
    }

    public isNew: boolean = true;
    public initBlood(hp: number): void {
        super.initBlood(hp, this.gamedata.maxhp);
        this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
    }

    updateUI(): void {
        super.updateUI();
        this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
        this._footCircle && this._footCircle.pos(this.hbox.cx, this.hbox.cy);
        if(this._footCircle)
        {
            this._footCircle.dir.rotation = this.face2d * 180 / Math.PI + 90;
        }
    }

    private onJumpDown(): void {
        this.gamedata.rspeed = 20;
        // if (this.getGameAi()) {
        //     (this.getGameAi() as HeroAI).resetRun();
        // }
        this.startAi();
        Game.executor.start();
        // setTimeout(() => {
        
        console.log("主角调下来",Game.AiArr.length);
        // }, 1150);
    }

    busi:boolean = false;

    public hurt(hurt: number, isCrit: boolean): void {
        if(this.busi)
        {
            return;
        }
        let isMiss:boolean = false;
        let missSkill:SysSkill = Game.skillManager.isHas(5006)//闪避
        if(missSkill)
        {
            let missBuff:SysBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME,missSkill.skillEffect1);
            if (missBuff)  {
                let missRate: number = missBuff.addMiss / 1000;
                if ((1 - Math.random()) > missRate) {
                    isMiss = true;
                    console.log(missSkill.skillName);
                }
            }
        }
        if(!isMiss)
        {
            super.hurt(hurt, isCrit);
            HitEffect.addEffect(this);
        }

        //愤怒
        let angerSkill:SysSkill = Game.skillManager.isHas(3008);
        if(angerSkill)
        {
            let rate:number = (this.gamedata.maxhp - this.gamedata.hp) / this.gamedata.maxhp;
            this.playerData.baseAttackPower = Math.floor(Game.skillManager.addAttack() * (1 + rate));
        }
    }

    die(): void {
        if (this.isDie) {
            return;
        }
        this.isDie = true;
        this.setKeyNum(1);
        this.once(Game.Event_KeyNum, this, this.onDie);
        setTimeout(() => {
            this.play(GameAI.Die); 
        }, 300);
    }

    rebornTime:number;
    reborn():void
    {

        Game.rebornTimes--;
        Game.skillManager.removeSkill(4005);
        this.isDie = false;
        this.setKeyNum(1);
        this.acstr = "";
        Game.hero.reset();
        Game.hero.initBlood(Game.hero.gamedata.hp);
        this.play("Idle");
        this.startAi();
        Game.executor &&Game.executor.start();

        this.setWudi(true);
        setTimeout(() => {
            this.setWudi(false);
        }, 2000);
    }

    onDie(key): void {
        let skill4005: SysSkill = Game.skillManager.isHas(4005);//复活
        if (skill4005) {
            setTimeout(() => {
                this.reborn();
            }, 800);
            console.log(skill4005.skillName);
        }
        else {
            this.stopAi();
            Game.executor && Game.executor.stop_();//全部停止
            console.log("全部暂停");
            Laya.stage.event(Game.Event_MAIN_DIE);
        }
    }

    private lastTime: number = 0;
    pos2To3d(): void {
        super.pos2To3d();
        //脚下的烟雾
        if (Laya.Browser.now() - this.lastTime >= 300) {
            // App.soundManager.play("fx_move.wav");
            var runSmog: RunSmog = RunSmog.create(this.hbox.cx, this.hbox.cy);
            Laya.Tween.to(runSmog, { scaleX: 0, scaleY: 0, alpha: 0 }, 600, null, new Laya.Handler(this, this.onClear, [runSmog]));
            this.lastTime = Laya.Browser.now();
        }
    }

    private onClear(runSmog: RunSmog): void {
        RunSmog.recover(runSmog);
    }

}

export class RunSmog extends Laya.Image {
    static flag: string = "RunSmog"
    constructor() {
        super();
        this.skin = "bg/renyan.png";
        this.size(64, 64);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }

    static create(xx: number, yy: number): RunSmog {
        var smog: RunSmog = Laya.Pool.getItemByClass(RunSmog.flag, RunSmog);
        smog.pos(xx, yy);
        Game.footLayer.addChild(smog);
        return smog;
    }

    static recover(smog: RunSmog): void {
        smog.removeSelf();
        smog.alpha = 1;
        smog.scale(1, 1);
        Laya.Pool.recover(RunSmog.flag, smog);
    }
}