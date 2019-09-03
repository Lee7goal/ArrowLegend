/*
* name;
*/
export default class SoundManager{
    public pre:string = "";
    constructor(){
    }

    public setMusicVolume(value:number):void
    {
        Laya.SoundManager.setMusicVolume(value);
        
    }

    public setSoundVolume(value:number):void
    {
        Laya.SoundManager.setSoundVolume(value);
    }

    
    public soundName:string;
    public isMusic:boolean;
    public play(soundName:string,isMusic:boolean = false):void
    {
        this.soundName = soundName;
        this.isMusic = isMusic;
        var url:string = this.pre + soundName;
        if(Laya.loader.getRes(url))
        {
            this.onLoadCom(url,isMusic);
        }
        else
        {
            Laya.loader.load(url,new Laya.Handler(this,this.onLoadCom,[url,isMusic]));
        }
    }

    private onLoadCom(url,isMusic):void
    {
        if(isMusic)
        {
            Laya.SoundManager.playMusic(url,0);
        }
        else
        {
            Laya.SoundManager.playSound(url,1);
        }
    }

}