import IGrid from "./IGrid";
import Game from "../Game"
import GridType from "./GridType";
import GameBG from "../GameBG";

export default class Grid3D implements IGrid {
    private _gridType: number;
    private _canWalk: boolean;
    private _rectangle: Laya.Rectangle = new Laya.Rectangle();
    public box: Laya.Sprite3D;
    constructor(i,j) {
        // super();
        this.box = Laya.Sprite3D.instantiate(Game.box);
        let v3 = GameBG.get3D(i, j);
        this.box.transform.translate(v3);
    }

    setGridType(t: number) {
        this._gridType = t;
        // this.setCanWalk(this._gridType == GridType.Thorn);
    }
    getGridType(): number {
        return this._gridType;
    }
    setCanWalk(b: boolean) {
        this._canWalk = b;
    }
    getCanWalk(): boolean {
        return this._canWalk;
    }
    setRectangle(xx: number, yy: number, ww: number, hh: number) {
        this._rectangle.x = xx;
        this._rectangle.y = yy;
        this._rectangle.width = ww;
        this._rectangle.height = hh;
    }
    getRectangle(): Laya.Rectangle {
        return this._rectangle;
    }
}