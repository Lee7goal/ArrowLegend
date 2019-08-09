import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import HeroArrowAI from "../ai/HeroArrowAI";
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
    setBullet(id:number):void
    {
        if(!this.sp3d)
        {
            this.setSp3d(Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/"+id+"/monster.lh")));
            // let trail:Laya.TrailSprite3D = <Laya.TrailSprite3D>this.sp3d.getChildAt(0).getChildAt(1);
            // trail.trailFilter.time = 0;
        }
    }

    static getBullet(id:number):HeroBullet
    {
        let bullet:HeroBullet = new HeroBullet();
        // bullet = Laya.Pool.getItemByClass(HeroBullet.TAG,HeroBullet);
        bullet.isDie = false;
        bullet.setBullet(id ? id : 20000);
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