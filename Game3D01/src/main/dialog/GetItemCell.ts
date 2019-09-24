import { ui } from "../../ui/layaMaxUI";
import RotationEffect from "../../core/utils/RotationEffect";
import { GoldType } from "../../game/data/HomeData";

export default class GetItemCell extends ui.test.GetItemCellUI{
    constructor(){
        super();
        RotationEffect.play(this.light);
        this.anchorX = this.anchorY = 0.5;
    }

    public setData( data:any ):void{
        this.v1.vs.selectedIndex = data.type;
        this.label.text = "+" + data.value;
    }
}