import { ui } from "./../../../../ui/layaMaxUI";
import GameBG from "../../../../game/GameBG";
import GameHitBox from "../../../../game/GameHitBox";
import Game from "../../../../game/Game";
import GamePro from "../../../../game/GamePro";
import { LineData } from "./Saw";
export default class SawHeng extends ui.test.SawHengUI {
    public line:LineData = new LineData();
    constructor(xx:number,yy:number,vv:number) {
        super();
        this.bg.width = vv;
        this.pos(xx,yy);

        this.line.startX = xx;
        this.line.startY = yy;
        this.line.endX = xx + vv;
        this.line.endY = yy;
    }
}

export class HengJu extends ui.test.HengjuUI
{
    public hbox:GameHitBox = new GameHitBox(56,56);
    private ww:number;
    private startX:number;
    private cd:number = 0;
    constructor(xx:number,yy:number,vv:number){
        super();
        this.ww = vv;
        this.ww -= GameBG.ww;
        this.pos(xx + GameBG.ww2 + 5,yy + GameBG.ww2);
        this.startX = this.x;
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
        this.on(Laya.Event.DISPLAY,this,this.onDis);

        this.box.scrollRect = new Laya.Rectangle(0,0,58,35);
    }

    private onUnDis():void
    {
        this.clearTimer(this, this.onLoop);
        this.huoxing.stop();
    }

    private onDis(): void {
        this.frameLoop(1,this,this.onLoop);
        this.huoxing.play();
    }

    private status: number = 0;
    private onLoop(): void {
        this.dianju.rotation += 20;
        if (this.status == 0)  {
            this.x += 4;
        }
        else  {
            this.x -= 4;
        }

        if (this.x >= this.startX + this.ww)  {
            this.status = 1;
            this.scaleX = -1;
        }
        else if (this.x <= this.startX)  {
            this.status = 0;
            this.scaleX = 1;
        }
        this.hbox.setXY(this.x,this.y);

        this.checkHero();
    }

    checkHero():void
    {
        if(Game.executor.getWorldNow() >= this.cd)
        {
            if (GameHitBox.faceToLenth(this.hbox, Game.hero.hbox) < GameBG.ww2) {
                if (Game.hero.hbox.linkPro_) {
                    Game.hero.hbox.linkPro_.event(Game.Event_Hit,Game.bg.saw.pro);
                    this.cd = Game.executor.getWorldNow() + 1000;
                }
            }
        }
    }
}