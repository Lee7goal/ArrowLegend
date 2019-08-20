import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import HeroArrowAI from "../ai/HeroArrowAI";
import ArrowGameMove0 from "../move/ArrowGameMove0";
import SysSkill from "../../main/sys/SysSkill";
export default class HeroBullet extends GamePro {
    static TAG:string = 'HeroBullet';

    
    chuantouSkill:SysSkill;
    fantanSkill:SysSkill;
    tansheSkill:SysSkill;

    buffAry:number[] = [];

    /**反弹次数 */
    fcount: number = 0;
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
        // let bullet:HeroBullet  = Laya.Pool.getItemByClass(HeroBullet.TAG,HeroBullet);
        bullet.isDie = false;
        bullet.setBullet(id);
        bullet.chuantouSkill = Game.skillManager.isHas(1006);//穿透
        bullet.fantanSkill =  Game.skillManager.isHas(1008);//反弹
        bullet.fcount = bullet.fantanSkill ? 2 : 0;
        bullet.tansheSkill = Game.skillManager.isHas(1009);//弹射

        let arr:number[] = [2001,2002,2003,5001,5002,5003];//火焰
        for(let i = 0; i < arr.length; i++)
        {
            if(Game.skillManager.isHas(arr[i]))
            {
                bullet.buffAry.push(arr[i]);
            }
        }
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