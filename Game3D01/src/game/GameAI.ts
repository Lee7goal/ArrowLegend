import GamePro from "./GamePro";
import Game from "./Game";

export interface GameAI {
    exeAI(pro:GamePro):boolean;
    starAi();
    stopAi();
}

export class HeroArrowAI implements GameAI {
    i:number = 0;
    exeAI(pro: GamePro): boolean {
        if( !pro.move2D(pro.face2d) ){
            pro.stopAi();
            if(pro.sp3d.parent){
                Game.layer3d.removeChild(pro.sp3d);                
                //Game.HeroArrows.push(pro);
            }        
            return false;
        }
    }
    starAi() {
        
    }
    stopAi() {
        
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
        this.now = Laya.Browser.now();
        //this.st = this.now;
    }

    public stopAi(){
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
        if(hero.normalizedTime>=0.2){
            if(hero.normalizedTime >=1){
                hero.play(HeroAI.Idle);
                Laya.stage.timer.clear(this,this.ac0);
            }
            if(this.scd==0){
                this.scd = 1;
                Game.hero.event(Game.Short,null);
            }
        }
    }
}
    
