import HttpRequest = Laya.HttpRequest;
  export default class Http {
    private xhr:HttpRequest;
    public constructor() {
        this.xhr = new HttpRequest();
        this.xhr.http.timeout = 10000;//设置超时时间
	}

    static create(): Http {
        return new Http();
    }

    success(func:Function,thisObj:any): Http {
        this.xhr.once(Laya.Event.COMPLETE,thisObj,function(data:Object):void{
            Laya.Handler.create(thisObj,func).runWith(data);
        });
        return this;
    }


    error(func: Function, thisObj: any = null): Http {
        this.xhr.once(Laya.Event.ERROR,thisObj,function(data:Object):void{
            Laya.Handler.create(thisObj,func).runWith(data);
        });
        return this;
    }

    /**
     * 发送 HTTP 请求。xhr.send("http:xxx.xxx.com?a=xxxx&b=xxx","","get","text");      xhr.send("http:xxx.xxx.com","a=xxxx&b=xxx","post","text");
     * @param	url				请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
     * @param	data			(default = null)发送的数据。
     * @param	method			(default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
     * @param	responseType	(default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
     */
    send(url:string,data?:any, method?: string,responseType?:string)
    {
        this.xhr.send(url,data,method,responseType);
    }
}