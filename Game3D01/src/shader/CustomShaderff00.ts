export default class CustomShaderff00 extends Laya.BaseMaterial {

    private static ff00_:CustomShaderff00;

    static get ff00():CustomShaderff00{
        if(!CustomShaderff00.ff00_){
            return new CustomShaderff00;
        }
        return CustomShaderff00.ff00_;
    }

    constructor(){
        super();
        if(!CustomShaderff00.ff00_){
            this.initShader();
            this.setShaderName("CustomShaderff00");
            CustomShaderff00.ff00_ = this;
        }else{        
            this.setShaderName("CustomShaderff00");
        }
    }

    initShader(){
        let attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0
        };
        let uniformMap = {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE
        };
        let vs = `
            attribute vec4 a_Position;
            uniform mat4 u_MvpMatrix;
            void main()
            {
            gl_Position = u_MvpMatrix * a_Position;
            }`;
        let ps = `
            #ifdef FSHIGHPRECISION
            precision highp float;
            #else
            precision mediump float;
            #endif            
            void main()
            {           
            gl_FragColor=vec4(1.0,0.0,0.0,1.0);
            }`;
        let CustomShaderff00 = Laya.Shader3D.add("CustomShaderff00");
		let subShader =new Laya.SubShader(attributeMap, uniformMap);
        CustomShaderff00.addSubShader(subShader);
		subShader.addShaderPass(vs, ps);
    }
}

//ES6可以定义静态属性，这些