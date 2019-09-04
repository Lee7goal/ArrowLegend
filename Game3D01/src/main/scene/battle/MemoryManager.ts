export default class MemoryManager{
    static ins:MemoryManager = new MemoryManager();

    res:any = {};

    add(url:string):void
    {
        let data:ResourceData = this.res[url];
        if(data == null)
        {
            data = new ResourceData();
            data.url = url;
            data.time = Date.now();
            this.res[data.url] = data;
        }
        data.count++;
    }

    app(url:string):void
    {
        let data:ResourceData = this.res[url];
        if(data)
        {
            data.count--;
        }
    }

    release():void
    {
        for(let key in this.res)
        {
            let data:ResourceData = this.res[key];
            if(data.count <= 0)
            {
                let sp: Laya.Sprite3D = Laya.loader.getRes(key);
                sp && sp.destroy(true);
                console.log("释放资源",key);
            }
        }
    }
}

export class ResourceData
{
    url:string = '';
    time:number = 0;
    count:number = 0;
}