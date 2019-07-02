import IGrid from "./IGrid";
import GridType from "./GridType";

export default class Grid2D extends Laya.Image implements IGrid{

    private _gridType:number;
    private _canWalk:boolean;
    private _rectangle:Laya.Rectangle = new Laya.Rectangle();
    constructor() {
        super(); 
    }

    setGridType(t:number){
        this._gridType = t;
        // this.setCanWalk(this._gridType == GridType.Thorn);
    }
    getGridType():number{
        return this._gridType;
    }
    setCanWalk(b:boolean){
        this._canWalk = b;
    }
    getCanWalk():boolean{
        return this._canWalk;
    }
    setRectangle(xx:number,yy:number,ww:number,hh:number){
        this._rectangle.x = xx;
        this._rectangle.y = yy;
        this._rectangle.width = ww;
        this._rectangle.height = hh;
    }
    getRectangle():Laya.Rectangle{
        return this._rectangle;
    }
}