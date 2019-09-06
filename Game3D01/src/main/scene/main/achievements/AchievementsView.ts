import { ui } from "../../../../ui/layaMaxUI";
import AcheievementCell from "./AcheievementCell";
export default class AchievementsView extends ui.test.chengjiuUI {
    private list:Laya.List;
    
    constructor() { 
        super(); 
        this.list = new Laya.List();
        this.list.pos(this.listBox.x,this.listBox.y);
        this.addChild(this.list);
        this.list.itemRender = AcheievementCell;
        this.list.repeatX = 1;
        this.list.repeatY = 4;
        this.list.vScrollBarSkin = "";
        // this.list.selectEnable = true;
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void{
        this.list.array = [,,,,,,,,,];
        this.refresh();
        this.effect();
    }

    private refresh():void{
        
    }

    private effect():void{
        this.list.mouseEnabled = false;
        let len = this.list.cells.length;
        for( let i :number = 0; i < len; i++ ){
            this.tw( this.list.cells[i] , i * 100 );
        }
        Laya.timer.once( len * 100 + 800 , this, this.mouseFun );
    }

    private mouseFun():void {
        this.list.mouseEnabled = true;
    }

    private tw( cell:Laya.Sprite , delay:number ):void{
        let t = new Laya.Tween();
        t.from( cell , { y: cell.y + this.list.height - cell.height }, 800 + delay , Laya.Ease.backIn,  null  );
    }

    private updateItem():void{

    }
}