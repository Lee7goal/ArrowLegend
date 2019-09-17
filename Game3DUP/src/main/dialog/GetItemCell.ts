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
        if( data.type == GoldType.BLUE_DIAMONG ){
            this.v1.blue.visible = true;
        }else if( data.type == GoldType.RED_DIAMONG ){
            this.v1.red.visible = true;
        }else if( data.type == GoldType.GOLD ){
            this.v1.gold.visible = true;
        }
        this.label.text = "+" + data.value;
    }
}