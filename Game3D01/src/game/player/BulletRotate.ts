import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import ArrowRoateMove from "../move/ArrowRoateMove";
export default class BulletRotate extends GamePro {
    static TAG:string = 'HeroBullet';
    constructor() {
        super(GameProType.HeroArrow);
        this.setGameMove(new ArrowRoateMove());
    }

    static getBullet(id:number):BulletRotate
    {
        let bullet:BulletRotate = new BulletRotate();
        bullet.setSp3d(Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/"+id+"/monster.lh")));
        bullet.sp3d.transform.localPositionY = 1;
        bullet.sp3d.transform.localRotationEulerX = 45;
        return bullet;
    }
}