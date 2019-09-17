import BaseHttp from "../core/net/BaseHttp";
import App from "../core/App";
import Session from "../main/Session";

/*
* name;
*/
export default class SenderHttp extends BaseHttp {
    constructor() {
        super(null);
    }

    static create(): SenderHttp {
        return new SenderHttp();
    }


    send(): void {
        let obj = Session.gameData;
        super.send(App.serverIP + "gamex3/save2","skey=" + Session.SKEY + "&type=0&num=0&gamedata=" + JSON.stringify(obj), "post", "text");
    }

    onSuccess(data): void {
        super.onSuccess(data);
        console.log("save success",data);
    }
}