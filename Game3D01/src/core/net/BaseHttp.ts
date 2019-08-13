import Http from "./Http";

/*
* name;
*/
export default class BaseHttp{
    private _http:Http;
    protected handler:Laya.Handler;
    constructor(hand:Laya.Handler){
        this.handler = hand;
        this._http = Http.create().success(this.onSuccess,this).error(this.onErro,this);
    }

    onSuccess(data):void
    {
        this.handler && this.handler.runWith(data);
    }

     private onErro(e):void
    {
        console.error(e);
    }

    /**
     * 发送 HTTP 请求。xhr.send("http:xxx.xxx.com?a=xxxx&b=xxx","","get","text");      xhr.send("http:xxx.xxx.com","a=xxxx&b=xxx","post","text");
     * @param	url				请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
     * @param	data			(default = null)发送的数据。
     * @param	method			(default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
     * @param	responseType	(default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
     */
    send(url:string,data?:any, method?: string,responseType?:string):void
    {
        this._http.send(url,data,method,responseType);
    }
}