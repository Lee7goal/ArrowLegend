import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import GameBG from "../GameBG";
import PlaneGameMove from "../move/PlaneGameMove";
import HeroAI from "../ai/HeroAI";
import { GameAI } from "../ai/GameAI";
import HitEffect from "../effect/HitEffect";
import PlayerData from "../data/PlayerData";

export default class Hero extends GamePro {
    
    public playerData:PlayerData = new PlayerData();
    constructor() {
        super(GameProType.Hero, 0);
        this.reset();
        this.unBlocking = true;
        this.setGameMove(new PlaneGameMove());
        this.setGameAi(new HeroAI());
    }

    addBlood(addValue:number):void
    {
        this.gamedata.hp = this.gamedata.hp + addValue;
        this.gamedata.hp = Math.min(this.gamedata.hp,this.gamedata.maxhp);
        this.initBlood(this.gamedata.hp);
        console.log("回复血量");
    }

    private updateAttackSpeed():void
    {
        console.log("修改攻速");
    }

    public reset():void
    {
        this.gamedata.hp = this.gamedata.maxhp = 2000;
    }

    init(): void  {
        this.isDie = false;
        this.setKeyNum(1);
        this.acstr = "";
        let sp: Laya.Sprite3D = Laya.loader.getRes("h5/hero/hero.lh");
        Game.layer3d.addChild(sp);
        sp.transform.localScale = new Laya.Vector3(1.2,1.2,1.2);
        this.setSp3d(sp as Laya.Sprite3D);

        this.play("Idle");
        
        // this.addWeapon();

        this.setXY2DBox(GameBG.ww * 6, (GameBG.arr0.length / 13 - 2) * GameBG.ww);//原先是减1

        this.initBlood(this.gamedata.hp);
        this.addFootCircle();

        Game.map0.Hharr.push(this.hbox);

        this.gamedata.rspeed = 0;
        this.rotation(90 / 180 * Math.PI);
        this.sp3d.transform.localPositionY = 15;
        Laya.Tween.to(this.sp3d.transform, { localPositionY: 0 }, 600, Laya.Ease.strongIn, new Laya.Handler(this, this.onJumpDown));

        if(Game.battleLoader.mapId % 1000 == 0)
        {
            setTimeout(() => {
                Game.openDoor();
            }, 3000);
        }

        Laya.stage.on(Game.Event_ADD_HP,this,this.addBlood);
        Laya.stage.on(Game.Event_UPDATE_ATTACK_SPEED,this,this.updateAttackSpeed);
    }

    public isNew:boolean = true;
    public initBlood(hp:number): void {
        super.initBlood(hp,this.gamedata.maxhp);
        this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
    }

    updateUI():void
    {
        super.updateUI();
        this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
    }

    private onJumpDown(): void {
        this.gamedata.rspeed = 20;
        // if (this.getGameAi()) {
        //     (this.getGameAi() as HeroAI).resetRun();
        // }
        this.startAi();
        Game.executor.start();
        
    }

    public hurt(hurt: number): void {
        super.hurt(hurt);
        HitEffect.addEffect(this);
    }

    die(): void {
        if(this.isDie)
        {
            return;
        }
        this.isDie = true;
        this.setKeyNum(1);
        this.once(Game.Event_KeyNum, this, this.onDie);
        this.play(GameAI.Die);
    }

    onDie(key):void{
        this.stopAi();
        Game.executor && Game.executor.stop_();//全部停止

        Laya.stage.event(Game.Event_MAIN_DIE);
    }

    private lastTime: number = 0;
    pos2To3d():void{
        super.pos2To3d();
        //脚下的烟雾
        if (Laya.Browser.now() - this.lastTime >= 300) {
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