export default interface IGrid {
    
    setGridType(t:number);
    getGridType():number;
    setCanWalk(b:boolean);
    getCanWalk():boolean;
    setRectangle(xx:number,yy:number,ww:number,hh:number);
    getRectangle():Laya.Rectangle;
}