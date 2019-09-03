import { ui } from "../../../../ui/layaMaxUI";
import TalentCell from "./TalentCell";
    export default class TalentView extends ui.test.talentUI {
    
    private cellList:TalentCell[] = [];
    constructor() { 
        super(); 
        for(let i = 0; i < 10;i++)
        {
            let cell:TalentCell = new TalentCell();
            let box:Laya.Box = this["b" + i] as Laya.Box;
            box.addChild(cell);
            this.cellList.push(cell);
        }
    }
}