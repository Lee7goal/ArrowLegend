import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import HeroArrowAI from "../ai/HeroArrowAI";
import ArrowGameMove0 from "../move/ArrowGameMove0";
import SysSkill from "../../main/sys/SysSkill";
export default class HeroBullet extends GamePro {
    static TAG: string = 'HeroBullet';


    chuantouSkill: SysSkill;
    fantanSkill: SysSkill;
    tansheSkill: SysSkill;

    buffAry: number[] = [];

    /**反弹次数 */
    fcount: number = 0;
    constructor() {
        super(GameProType.HeroArrow);
        this.setGameMove(new ArrowGameMove0());
        this.setGameAi(new HeroArrowAI(this));
        // this.oninit();
    }

    private head: Laya.Sprite3D;
    /**修改子弹 */
    setBullet(id: number): void  {
        if (!this.sp3d)  {
            this.setSp3d(Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + id + "/monster.lh")));
            console.log("创建主角的子弹");
        }

        if (Game.skillManager.arrowHeadId > 0)  {
            if (!this.head)  {
                let ss: Laya.Sprite3D = Laya.loader.getRes("h5/bullets/skill/" + Game.skillManager.arrowHeadId + "/monster.lh");
                if (ss)  {
                    this.head = Laya.Sprite3D.instantiate(ss);
                    this.head.transform.localRotationEulerY = -180;
                    this.addSprite3DToChild("Gua",this.head);
                }
            }
        }
    }


    static getBullet(id: number): HeroBullet  {
        // let bullet:HeroBullet = new HeroBullet();
        let bullet: HeroBullet = Laya.Pool.getItemByClass(HeroBullet.TAG, HeroBullet);
        bullet.hit_blacklist = null;
        (bullet.getGameMove() as ArrowGameMove0).fv = null;
        (bullet.getGameMove() as ArrowGameMove0).ii = 1;
        bullet.chuantouSkill = null;
        bullet.fantanSkill = null;
        bullet.fcount = 0;
        bullet.tansheSkill = null;
        bullet.buffAry.length = 0;

        bullet.isDie = false;
        bullet.setBullet(id);
        bullet.chuantouSkill = Game.skillManager.isHas(1006);//穿透
        bullet.fantanSkill = Game.skillManager.isHas(1008);//反弹
        bullet.fcount = bullet.fantanSkill ? 2 : 0;
        bullet.tansheSkill = Game.skillManager.isHas(1009);//弹射

        let arr: number[] = [2001, 2002, 2003, 5001, 5002, 5003, 5004];//火焰
        for (let i = 0; i < arr.length; i++)  {
            if (Game.skillManager.isHas(arr[i]))  {
                bullet.buffAry.push(arr[i]);
            }
        }
        return bullet;
    }

    die(): void  {
        if (this.isDie)  {
            return;
        }
        this.isDie = true;
        this.stopAi();
        this.setSpeed(0);
        // Laya.timer.frameOnce(30,this,()=>{

        // })
        // Laya.timer.once(1000,this,()=>{

        // })
        // this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
        this.sp3d.transform.localPositionY = -500;
        this.sp3d.transform.localPositionZ = -500;
        Laya.Pool.recover(HeroBullet.TAG, this);
    }
}