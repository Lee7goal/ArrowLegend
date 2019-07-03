import GamePro from "./GamePro";
import Game from "./Game";
import { ArrowGameMove } from "./GameMove";
import GameHitBox from "./GameHitBox";
import GameProType from "./GameProType";

export abstract class GameAI {
    static JumpAttack:string = "JumpAttack";
    static ArrowAttack:string = "ArrowAttack";
    static Idle:string = "Idle";
    static Die:string = "Die";
    static Run:string = "Run";
    static SpinAttack:string = "SpinAttack";
    static TakeDamage:string = "TakeDamage";
    abstract exeAI(pro:GamePro):boolean;
    abstract starAi();
    abstract stopAi();
    abstract hit(pro:GamePro);
}
//巡逻&攻击
export class MonsterAI1 extends GameAI {
    private pro:GamePro;
    private shooting:Shooting = new Shooting();

    private aicd = 0;
    private aist = 0;

    constructor(pro:GamePro){
        super();
        this.pro = pro;
        this.pro.play(GameAI.Idle);
        this.shooting.attackCd = 1500;
        this.shooting.at = 0.4;
        this.pro.on(Game.Event_Short,this,this.shootAc);

        this.aicd = this.shooting.attackCd + 100;
        this.aist = Laya.Browser.now();
        this.pro.setSpeed(2);
    }

    shootAc(proType_:number):void{
        this.shooting.short_arrow(10,this.pro.face3d,this.pro,proType_);
        this.shooting.short_arrow(10,this.pro.face3d + Math.PI/6,this.pro,proType_);
        this.shooting.short_arrow(10,this.pro.face3d - Math.PI/6,this.pro,proType_);
    }

    hit(pro: GamePro) {
        if(this.pro.acstr == GameAI.Idle){
            this.pro.play(GameAI.TakeDamage);
        }
    }

    private aiCount:number = Math.floor(Math.random()*5);

    exeAI(pro: GamePro): boolean {
        var now = Laya.Browser.now();
        if(now>=this.aist){
            Laya.stage.timer.clear(this,this.go);
            this.aiCount++;
            if( this.aiCount % 5 != 0 ){
                this.shooting.now = now;
                if(this.shooting.attaclCD()){
                    var a:number = GameHitBox.faceTo3D(this.pro.hbox ,Game.hero.hbox);
                    this.pro.rotation(a);
                    this.shooting.starAttack(this.pro,GameAI.SpinAttack);
                    //return true;
                    this.aist = now + this.aicd;
                }
            }else{
                var a:number = GameHitBox.faceTo3D(this.pro.hbox ,Game.hero.hbox);
                this.pro.rotation(a);
                Laya.stage.frameLoop(1,this,this.go);
                this.aist = now + 2000 + (1000*Math.random());
            }

            
        }
        return false;
    }

    private go():void{
        this.pro.move2D(this.pro.face2d);
    }

    starAi() {
        this.shooting.now = Laya.Browser.now();
        this.shooting.st  = this.shooting.now + this.shooting.attackCd;
    }
    stopAi() {
        this.shooting.cancelAttack();        
    }
}

export class HeroArrowAI extends GameAI {
    hit(pro: GamePro) {
        //throw new Error("Method not implemented.");
    }
    i:number = 0;
    exeAI(pro: GamePro): boolean {

        if( this.i==0 && !pro.move2D(pro.face2d)){
            this.i=1;                   
            return false;
        }

        if(this.i>0){
            this.i++;
            if(this.i>30){
                pro.stopAi();
                if(pro.sp3d.parent){
                    Game.layer3d.removeChild(pro.sp3d);                
                    Game.HeroArrows.push(pro);
                } 
            }
        }

    }
    starAi() {
        this.i = 0;
    }
    stopAi() {
        this.i = 0;
    }
}


export class HeroAI extends GameAI {

    private shootin:Shooting = new Shooting();

    hit(pro: GamePro) {
        //throw new Error("Method not implemented.");
        pro.gamedata.hp--;
        console.log("pro.gamedata.hp " , pro.gamedata.hp);
        
    }

    public starAi(){
        Game.hero.on(Game.Event_Short,this,this.short);
        this.shootin.at = 0.35;
        this.shootin.now = Laya.Browser.now();
    }

    public short():void{        
        this.shootin.short_arrow(40,Game.hero.face3d,Game.hero,GameProType.HeroArrow);
        //this.short_arrow(40,Game.hero.face3d);        
        // this.short_arrow(40,Game.hero.face3d + Math.PI/6);
        // this.short_arrow(40,Game.hero.face3d - Math.PI/6);
        // this.short_arrow(40,Game.hero.face3d - Math.PI/2);
        // this.short_arrow(40,Game.hero.face3d + Math.PI/2);
        // this.short_arrow(40,Game.hero.face3d + Math.PI);
    }

    public stopAi(){
        this.shootin.cancelAttack();
        Game.hero.off(Game.Event_Short,this,this.short);
       
    }

    public exeAI(pro:GamePro):boolean{
        return this.shootin.starAttack(Game.hero,GameAI.ArrowAttack);
    }
}

/**射击器*/
export class Shooting {
    /**单次出手次数*/
    public scd:number = 0;
    /**攻击CD*/
    public attackCd:number = 1200;
    /**下次攻击时间*/
    public st:number = 0;
    /**当前时间*/
    public now:number = 0;
    /**攻击前摇时间*/
    public at:number = 0;
    //private static bulletCount:number = 0;

    private pro:GamePro;

    private getBullet(proType_:number):GamePro{        
        var gp:GamePro;
        if(Game.HeroArrows.length<=0){
            gp = new GamePro(proType_);
            var bullet:Laya.Sprite3D;
            bullet = (Laya.Sprite3D.instantiate(Game.a0.sp3d)) as Laya.Sprite3D;
            gp.setSp3d(bullet);
            //Shooting.bulletCount++;
            //console.log("Shooting.bulletCount " , Shooting.bulletCount);
        }else{
            gp = Game.HeroArrows.shift();
            gp.gamedata.proType = proType_;
        }
        return gp;
    }

    public short_arrow(speed_:number,r_:number,pro: GamePro,proType_:number){
        var bo = this.getBullet(proType_);
        bo.sp3d.transform.localPositionY = 0.8;
        bo.setXY2D(pro.pos2.x,pro.pos2.z);
        bo.setSpeed(speed_);
        bo.rotation(r_);
        bo.setGameMove(new ArrowGameMove());
        bo.setGameAi(new HeroArrowAI());        
        bo.gamedata.bounce = pro.gamedata.bounce;
        Game.layer3d.addChild(bo.sp3d);
        bo.startAi();
    }

    public attaclCD():boolean{
        return this.now >= this.st ;
    }

    public starAttack(pro: GamePro,acstr:string): boolean {
        this.pro = pro;
        this.now = Laya.Browser.now();
        if(this.attaclCD() ){
            this.st  = this.now + this.attackCd;
            this.scd = 0;
            pro.play(acstr);
            if(this.at>0){
                Laya.stage.timer.frameLoop(this.at,this,this.ac0);
            }else{
                this.ac0();
            }
            return true;            
        }
        return false;
    }

    public cancelAttack():void{
        Laya.stage.timer.clear(this,this.ac0);
        this.scd = 0;
    }

    private ac0():void{
        //this.pro;
        if(this.pro.normalizedTime>=this.at){
            if(this.pro.normalizedTime >=1){
                Laya.stage.timer.clear(this,this.ac0);
                this.pro.play(GameAI.Idle);                
            }
            if(this.scd==0){
                this.scd = 1;
                this.pro.event(Game.Event_Short,null);
            }
        }        
    }
}