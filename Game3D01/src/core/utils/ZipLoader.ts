import Handler = Laya.Handler;
import Loader = Laya.Loader;
export default class ZipLoader {
    constructor() {

    }

    public static instance: ZipLoader = new ZipLoader();


    public static load(fileName: String, handler: Handler): void {
        this.instance.loadFile(fileName, handler);
    }

    public handler: Handler = null;

    public loadFile(fileName: String, handler: Handler): void {
        this.handler = handler;
        Laya.loader.load(fileName, new Handler(this, this.zipFun), null, Loader.BUFFER);
    }

    public zipFun(ab: ArrayBuffer): void {
        Laya.Browser.window.JSZip.loadAsync(ab).then((jszip)=> {
            this.analysisFun(jszip);
        });
    }

    public currentJSZip: any;
    public fileNameArr: any[] = [];
    public resultArr: any[] = [];

    public analysisFun(jszip: any): void {
        this.currentJSZip = jszip;

        for (var fileName in jszip.files) {
            this.fileNameArr.push(fileName + "");
        }
        this.exeOne();
    }

    public exeOne(): void {
        this.currentJSZip.file(this.fileNameArr[0]).async('text').then((content)=> {
            this.over(content);
        });
    }

    public over(content): void  {
        var fileName: String = this.fileNameArr.shift();
        this.resultArr.push(fileName);
        this.resultArr.push(content);
        if (this.fileNameArr.length != 0) {
            this.exeOne();
        } else {
            this.handler.runWith([this.resultArr]);
        }
    }
}