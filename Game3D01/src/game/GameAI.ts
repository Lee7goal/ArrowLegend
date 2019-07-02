import GamePro from "./GamePro";
import Game from "./Game";
import { ArrowGameMove } from "./GameMove";

export interface GameAI {
    exeAI(pro:GamePro):boolean;
    starAi();
    stopAi();
}

export class HeroArrowAI implements GameAI {
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
                    //Game.HeroArrows.push(pro);
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

export class HeroAI implements GameAI {

    //private ac:String;

    static JumpAttack:string = "JumpAttack";
    static ArrowAttack:string = "ArrowAttack";
    static Idle:string = "Idle";
    static Die:string = "Die";
    static Run:string = "Run";

    public scd:number = 0;

    public attackCd:number = 1200;
    public st:number = 0;
    public now:number = 0;

    public starAi(){
        Game.hero.on(Game.Event_Short,this,this.short);
        this.now = Laya.Browser.now();
        //this.st = this.now;
    }

    getBullet():GamePro{        
        var gp:GamePro;
        if(Game.HeroArrows.length<=0){
            gp = new GamePro();
            var bullet:Laya.Sprite3D;
            bullet = (Laya.Sprite3D.instantiate(Game.a0.sp3d)) as Laya.Sprite3D;
            gp.setSp3d(bullet);
        }else{
            gp = Game.HeroArrows.shift();
        }
        return gp;
    }

    public short_arrow(speed_:number,r_:number){
        var bo = this.getBullet();
        bo.sp3d.transform.localPositionY = 0.8;
        bo.setXY2D(Game.hero.pos2.x,Game.hero.pos2.z);
        bo.setSpeed(speed_);
        bo.rotation(r_);
        bo.setGameMove(new ArrowGameMove());
        bo.setGameAi(new HeroArrowAI());        
        bo.gamedata.bounce = Game.hero.gamedata.bounce;
        Game.layer3d.addChild(bo.sp3d);
        bo.startAi();
    }

    public short():void{
        this.short_arrow(40,Game.hero.face3d);
        // this.short_arrow(40,Game.hero.face3d + Math.PI/6);
        // this.short_arrow(40,Game.hero.face3d - Math.PI/6);
        // this.short_arrow(40,Game.hero.face3d - Math.PI/2);
        // this.short_arrow(40,Game.hero.face3d + Math.PI/2);
        // this.short_arrow(40,Game.hero.face3d + Math.PI);
    }

    public stopAi(){
        Game.hero.off(Game.Event_Short,this,this.short);
        Laya.stage.timer.clear(this,this.ac0);        
    }

    public exeAI(pro:GamePro):boolean{
        var hero = Game.hero;
        if( hero.acstr!=HeroAI.ArrowAttack ){
            this.now = Laya.Browser.now();
            if(this.now >= this.st){
                pro.play(HeroAI.ArrowAttack);
                Laya.stage.frameLoop(1,this,this.ac0);
                this.st = this.now + this.attackCd;
                this.scd = 0;
            }
        }
        return true;
    }

    private ac0():void{
        var hero = Game.hero;
        if(hero.normalizedTime>=0.35){
            if(hero.normalizedTime >=1){
                hero.play(HeroAI.Idle);
                Laya.stage.timer.clear(this,this.ac0);
            }
            if(this.scd==0){
                this.scd = 1;
                Game.hero.event(Game.Event_Short,null);
            }
        }
    }
}
    
