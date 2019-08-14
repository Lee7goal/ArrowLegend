import GameShaderObj from "../GameShaderObj";
import CustomMaterial from "../CustomMaterial";

export default class MonsterShader extends GameShaderObj{
    static map:any = {};

    private sp:Laya.Sprite3D;

    public spArr = [];
    public cpArr = [];

    constructor(sp:Laya.Sprite3D){
        super();
        this.sp = sp;
        for (let i = 0; i < 1; i++) {
            if( sp.getChildAt(i) instanceof Laya.Sprite3D ){
                var ssp = ( <Laya.Sprite3D>sp.getChildAt(i) );
                for (let j = 0; j < ssp._children.length; j++) {
                    if(ssp._children[j] instanceof Laya.SkinnedMeshSprite3D){
                        var sm = <Laya.SkinnedMeshSprite3D>ssp._children[j];
                        // console.log(sm.skinnedMeshRenderer.sharedMaterials);
                        //sm.skinnedMeshRenderer.sharedMaterials = [];
                        if(!this.spArr[i]){
                            this.spArr[i] = [];
                            this.cpArr[i] = [];
                        }
                        this.spArr[i][j] = sm.skinnedMeshRenderer.sharedMaterials;
                        this.cpArr[i][j] = sm.skinnedMeshRenderer.sharedMaterials;
                        this.initShander(i,j);
                        //sm.skinnedMeshRenderer.sharedMaterials = this.cpArr[i][j];
                        //this.spArr = this.cpArr;
                        //sm.skinnedMeshRenderer.sharedMaterials = [];
                    }
                }
            }
        }

        //this.setShader0(sp,1);
    }

    

    initShander(i: number,j: number): void{
        var sms:Laya.BaseMaterial[] = this.spArr[i][j];
        var cms:Laya.BaseMaterial[] = [];
        this.cpArr[i][j] = cms;

        //if(cms)return;
        for (let k = 0; k < sms.length; k++) {
            var bm = sms[k];
            let cm:CustomMaterial = new CustomMaterial();
            cms.push(cm);
            var bdata = bm._shaderValues.getData();
            var tx:Laya.Texture2D;

            for (let key in bdata) {
                var data = bdata[key];
                if(data instanceof Laya.Texture2D){
                    tx = data;
                    cm.diffuseTexture = tx;
                }
            }
            //cm.marginalColor = new Laya.Vector3(1, 0.7, 0);
            cm.marginalColor = new Laya.Vector3(1, 1, 1);
        }
    }

    clearShader():void
    {
        if(!this.sp)
        {
            return;
        }
        for (let i = 0; i < 1; i++) {
            if( this.sp.getChildAt(i) instanceof Laya.Sprite3D ){
                var ssp = ( <Laya.Sprite3D>this.sp.getChildAt(i) );
                for (let j = 0; j < ssp._children.length; j++) {
                    if(ssp._children[j] instanceof Laya.SkinnedMeshSprite3D){
                        var sm = <Laya.SkinnedMeshSprite3D>ssp._children[j];
                        var sms:Laya.BaseMaterial[] = sm.skinnedMeshRenderer.sharedMaterials
                        for (let k = 0; k < sms.length; k++) {
                            let cm:CustomMaterial = sms[k] as CustomMaterial;
                            var bdata = cm._shaderValues.getData();
                            for (let key in bdata) {
                                var data = bdata[key];
                                if(data instanceof Laya.Texture2D){
                                    data && data.destroy();
                                }
                            }
                        }
                    }
                }
            }
        }
        this.cpArr.length = this.spArr.length = 0;
    }

    setShader0(sp:Laya.Sprite3D,k:number){
        for (let i = 0; i < 1; i++) {
            if( sp.getChildAt(i) instanceof Laya.Sprite3D ){
                var ssp = ( <Laya.Sprite3D>sp.getChildAt(i) );
                for (let j = 0; j < ssp._children.length; j++) {
                    if(ssp._children[j] instanceof Laya.SkinnedMeshSprite3D){
                        var sm = <Laya.SkinnedMeshSprite3D>ssp._children[j];                        
                        if(k==0){
                            sm.skinnedMeshRenderer.sharedMaterials = this.spArr[i][j];
                        }else{
                            sm.skinnedMeshRenderer.sharedMaterials = this.cpArr[i][j];
                        }
                    }
                }
            }
        }
    }
}