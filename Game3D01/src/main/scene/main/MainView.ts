import WorldView from "./world/WorldView";
import ShopView from "./shop/ShopView";
import EquipView from "./equip/EquipView";
import SettingView from "./setting/SettingView";
import TalentView from "./talent/TalentView";
import GameConfig from "../../../GameConfig";
export default class MainView extends Laya.Sprite {

    private content: Laya.Sprite;
    private views: Laya.Sprite[] = [];
    constructor() {
        super();
        this.initUI();
    }

    private initUI(): void {
        this.content = new Laya.Sprite();
        this.addChild(this.content);
        this.views = [new ShopView(), new EquipView(), new WorldView(), new TalentView(), new SettingView()];
    }

    private curIndex: number;
    public set selectIndex(index: number)  {
        let view: Laya.Sprite = this.views[index];
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