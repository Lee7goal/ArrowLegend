import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import HeroArrowAI from "../ai/HeroArrowAI";
import ArrowGameMove from "../move/ArrowGameMove";
import ArrowGameMove0 from "../move/ArrowGameMove0";
export default class HeroBullet extends GamePro {
    static TAG:string = 'HeroBullet';
    constructor() {
        super(GameProType.HeroArrow);
        //this.setGameMove(new ArrowGameMove());
        //this.setGameAi(new HeroArrowAI(this));
        this.setGameMove(new ArrowGameMove0());
        this.setGameAi(new HeroArrowAI(this));
    }

    /**修改子弹 */
    setBullet():void
    {
        if(!this.sp3d)
        {
            this.setSp3d(Laya.Sprite3D.instantiate(Game.a0.sp3d));
            // this.sp3d.addChild(Laya.loader.getRes("h5/bulletsHead/1001/monster.lh"));
            // let trail:Laya.TrailSprite3D = <Laya.TrailSprite3D>this.sp3d.getChildAt(0).getChildAt(1);
            // trail.trailFilter.time = 0;
        }
    }

    static getBullet():HeroBullet
    {
        let bullet:HeroBullet = new HeroBullet();
        // bullet = Laya.Pool.getItemByClass(HeroBullet.TAG,HeroBullet);
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
        // Laya.timer.frameOnce(30,this,()=>{
            
        // })
        // Laya.timer.once(1000,this,()=>{
            
        // })
        this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
        // Laya.Pool.recover(HeroBullet.TAG,this);
    }
}