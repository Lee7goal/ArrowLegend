import WorldView from "./world/WorldView";
import ShopView from "./shop/ShopView";
import EquipView from "./equip/EquipView";
import SettingView from "./setting/SettingView";
import TalentView from "./talent/TalentView";
export default class MainView extends Laya.Sprite {
    private shopView: ShopView;
    private equipView: EquipView;
    private worldView: WorldView;
    private talentView:TalentView;
    private settingView: SettingView;
    constructor() { 
        super(); 
        this.initUI();
    }

    private initUI():void{
        this.shopView = new ShopView();
        this.addChild(this.shopView);

        this.equipView = new EquipView();
        this.addChild(this.equipView);
        this.equipView.x = this.shopView.x +this.shopView.width;

        this.worldView = new WorldView();
        this.addChild(this.worldView);
        this.worldView.x = this.equipView.x +this.equipView.width;

        this.talentView = new TalentView();
        this.addChild(this.talentView);
        this.talentView.x = this.equipView.x +this.equipView.width;

        this.settingView = new SettingView();
        this.addChild(this.settingView);
        this.settingView.x = this.talentView.x +this.talentView.width;
    }



}