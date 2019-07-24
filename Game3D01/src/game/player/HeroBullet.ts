import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import HeroArrowAI from "../ai/HeroArrowAI";
import ArrowGameMove from "../move/ArrowGameMove";
export default class HeroBullet extends GamePro {
    static TAG:string = 'HeroBullet';
    constructor() {
        super(GameProType.HeroArrow);
        this.setGameMove(new ArrowGameMove());
        this.setGameAi(new HeroArrowAI(this));
    }

    /**修改子弹 */
    setBullet():void
    {
        if(!this.sp3d)
        {
            this.setSp3d(Laya.Sprite3D.instantiate(Game.a0.sp3d));
            // console.log("创建新的主角子弹");
        }
    }

    static getBullet():HeroBullet
    {
        let bullet:HeroBullet;
        bullet = Laya.Pool.getItemByClass(HeroBullet.TAG,HeroBullet);
        bullet.isDie = false;
        bullet.setBullet();
        return bullet;
    }

    die():void
    {
        if(this.isDie)
        {
            return;
        }
        this.isDie = true;
        this.stopAi();
        Laya.timer.frameOnce(20,this,()=>{
            this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
        })
        Laya.timer.once(1000,this,()=>{
            Laya.Pool.recover(HeroBullet.TAG,this);
        })
    }
}