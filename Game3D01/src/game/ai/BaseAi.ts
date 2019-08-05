import { GameAI } from "./GameAI";
import GamePro from "../GamePro";
import Monster from "../player/Monster";
import MonsterShader from "../player/MonsterShader";
import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GameBG from "../GameBG";
import SysBullet from "../../main/sys/SysBullet";
import SysEnemy from "../../main/sys/SysEnemy";
import App from "../../core/App";
import AttackType from "./AttackType";
import SplitSkill from "../skill/SplitSkill";
import GameScaleAnimator from "./GameScaleAnimator";
import CoinEffect from "../effect/CoinEffect";

/**不动不攻击的ai */
export default class BaseAI extends GameAI {
    protected normalSb: SysBullet;
    protected skillISbs: SysBullet[] = [];
    protected sysEnemy: SysEnemy;
    protected pro:Monster;
    protected now:number = 0;
    private shaders:number = 0;
    protected collisionCd:number = 0;

    private splitSkill:SplitSkill;
    private stiffTime:number;
    private stiff:number = 500;
    private g2:GameScaleAnimator;

    /**检测碰撞 */
    checkHeroCollision(): void {
        var now = Game.executor.getWorldNow();
        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww2) {
            if (now > this.collisionCd) {
                if (Game.hero.hbox.linkPro_) {
                    Game.hero.hbox.linkPro_.event(Game.Event_Hit, this.pro);
                    this.collisionCd = now + 2000;
                }
            }
        }
    }
    
    setShader():void
    {
        if (this.shaders > 0 && this.now >= this.shaders) {
            this.shaders = 0;
            var ms = this.pro;
            if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                var shader = <MonsterShader>MonsterShader.map[ms.sysEnemy.enemymode];
                shader.setShader0(this.pro.sp3d, 0);
            }
        }
    }
    
    exeAI(pro: GamePro): boolean {
        if(this.pro.gamedata.hp <= 0)
        {
            return;
        }
        if(!this.run_)return;

        this.now = Game.executor.getWorldNow();
        this.setShader();
        this.hitEffect();
        return false;
    }

    hitEffect():void
    {
        if(this.g2){
            this.g2.ai(<Monster>this.pro);
        }

        //  if(this.stiffTime!=0)
        //  { 
        //     if(this.now >= this.stiffTime + this.stiff){
        //         this.stiffTime = 0;
        //     }else{                
        //         return;
        //     }
        // }
    }

    starAi() {
        this.run_ = true;
        this.pro.play(GameAI.Idle);
    }
    stopAi() {
        this.run_ = false;
    }

    hit(pro: GamePro) {
        this.pro.hurt(this.pro.gamedata.maxhp / 2);
        if (this.pro.gamedata.hp <= 0) {
            this.die();
        }
        else{
            this.stiffTime = this.now;
            if( this.g2 && this.g2.isOk()){//击退
                var a: number = pro.face3d + Math.PI;
                this.pro.rotation(a);
                if(this.g2.starttime == 0 ){                        
                    this.g2.starttime = this.now;//受击变形 击退
                    this.g2.now = this.now;
                    this.g2.playtime = 150;
                }
            }

            var ms = this.pro;
            if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                var shader = <MonsterShader>MonsterShader.map[ms.sysEnemy.enemymode];
                shader.setShader0(this.pro.sp3d, 1);
                var now = Game.executor.getWorldNow();
                this.shaders = now + 250;
            }
        }
    }

    constructor(ms:Monster){
        super();
        this.pro = ms;
        this.sysEnemy = this.pro.sysEnemy;
        this.normalSb = null;
        if (this.sysEnemy.normalAttack > 0) {
            this.normalSb = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
        }

        this.skillISbs = [];
        if (this.sysEnemy.skillId != '0') {
            var arr: string[] = this.sysEnemy.skillId.split(',');
            for (var m = 0; m < arr.length; m++) {
                let id: number = Number(arr[m]);
                if (id > 0) {
                    let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                    this.skillISbs.push(sysBullet);

                    if(sysBullet.bulletType == AttackType.SPLIT)
                    {
                        this.splitSkill = new SplitSkill(sysBullet);
                    }
                }
            }
        }

        if(this.sysEnemy.enemyBlack > 0)
        {
            let HIT:any = Laya.ClassUtils.getClass("HIT_" + this.sysEnemy.enemyBlack);
            this.g2 = new HIT();
        }
    }

    die():void
    {
        let goldNum:number = this.sysEnemy.dropGold;
        if(goldNum > 0)
        {
            CoinEffect.addEffect(this.pro,goldNum);
        }
        this.splitSkill && this.splitSkill.exeSkill(this.now,this.pro);
        this.pro.die();
    }
}