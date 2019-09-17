import SawHeng, { HengJu } from "./SawHeng";
import SawZong, { ZongJu } from "./SawZong";
import GameBG from "../../../../game/GameBG";
import GamePro from "../../../../game/GamePro";

export default class Saw extends Laya.Sprite {

    static TAG: string = "SAW";

    private hengAry: SawHeng[] = [];
    private zongAry: SawZong[] = [];

    private hengJuAry: HengJu[] = [];
    private zongJuAry: ZongJu[] = [];

    public pro: GamePro = new GamePro(0);

    constructor() {
        super();
        this.pro.hurtValue = 150;
    }

    addBg(xx: number, yy: number, vv: number, type: number): void {
        if (type == 1) {
            let heng: SawHeng = new SawHeng(xx, yy, vv);
            this.addChild(heng);
            this.hengAry.push(heng);

            let hengju: HengJu = new HengJu(xx, yy, vv);
            this.hengJuAry.push(hengju);
        }
        else if (type == 2) {
            let zong: SawZong = new SawZong(xx, yy, vv);
            this.addChild(zong);
            this.zongAry.push(zong);

            let zongju: ZongJu = new ZongJu(xx, yy, vv);
            this.zongJuAry.push(zongju);
        }
    }

    updateSaw(): void {

        for(var i = 0; i < this.hengAry.length; i++)
        {
            for(var j = 0; j < this.zongAry.length; j++)
            {
                if(this.zongAry[j].line.startX > this.hengAry[i].line.startX && this.zongAry[j].line.startX < this.hengAry[i].line.endX && this.zongAry[j].line.startY < this.hengAry[i].line.startY && this.zongAry[j].line.endY > this.hengAry[i].line.startY)
                {
                    let xx:number = this.zongAry[j].line.startX;
                    let yy:number = this.hengAry[i].line.startY;
                    let img:Laya.Image = new Laya.Image();
                    img.skin = 'bg/503.png';
                    this.addChild(img);
                    img.pos(xx,yy + 1);
                }
            }
        }


        for (var i = 0; i < this.hengJuAry.length; i++) {
            this.addChild(this.hengJuAry[i]);
        }

        for (var i = 0; i < this.zongJuAry.length; i++) {
            this.addChild(this.zongJuAry[i]);
        }
    }

    clear(): void {
        this.removeChildren();
        this.hengAry.length = this.zongAry.length = this.hengJuAry.length = this.zongJuAry.length = 0;
    }
}

export class LineData
{
    public startX:number;
    public startY:number;
    public endX:number;
    public endY:number;
}