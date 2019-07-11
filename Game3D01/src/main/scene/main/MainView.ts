import WorldView from "./world/WorldView";
import ShopView from "./shop/ShopView";
import EquipView from "./equip/EquipView";
import SettingView from "./setting/SettingView";
import TalentView from "./talent/TalentView";
import GameConfig from "../../../GameConfig";
import GameBG from "../../../game/GameBG";
export default class MainView extends Laya.Box {

    private content: Laya.Box;
    private views: Laya.View[] = [];
    constructor() {
        super();
        // this.height = GameBG.height;

        this.initUI();
    }

    private initUI(): void {
        this.content = new Laya.Box();
        this.addChild(this.content);
        this.views = [new ShopView(), new EquipView(), new WorldView(), new TalentView(), new SettingView()];
    }

    private curIndex: number;
    public set selectIndex(index: number)  {
        let view: Laya.View = this.views[index];
        this.content.addChild(view);
        if (this.curIndex != null)  {
            var xx:number = index > this.curIndex ? GameConfig.width : -GameConfig.width;
            view.x = xx;
            Laya.Tween.clearTween(this.content);
            Laya.Tween.to(this.content, { x: -xx }, 500, null, new Laya.Handler(this, this.onCom, [view]));
        }
        this.curIndex = index;
    }

    private onCom(view: Laya.View): void {
        this.content.x = 0;
        view.x = 0;
    }
}