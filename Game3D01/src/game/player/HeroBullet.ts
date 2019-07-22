import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import HeroArrowAI from "../ai/HeroArrowAI";
import ArrowGameMove from "../move/ArrowGameMove";
export default class HeroBullet extends GamePro {
    static TAG:string = 'HeroBullet';
    constructor() {
        super(GameProType.HeroArrow);
        this.setSp3d(Laya.Sprite3D.instantiate(Game.a0.sp3d));
        this.setGameMove(new ArrowGameMove());
        this.setGameAi(new HeroArrowAI(this));
    }

    static getBullet():HeroBullet
    {
        let bullet:HeroBullet;
        // bullet = Laya.Pool.getItemByClass(HeroBullet.TAG,HeroBullet);
        bullet = new HeroBullet();
        return bullet;
    }

    die():void
    {
        this.stopAi();
        Laya.timer.frameOnce(20,this,()=>{
            this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
        })
        Laya.Pool.recover(HeroBullet.TAG,this);
    }
}