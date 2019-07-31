import CustomMaterial from "./CustomMaterial";

//GameShaderObj
export default class GameShaderObj extends Laya.EventDispatcher {
    constructor(){
        super();
        this.initShader();
    }

    private s1:Laya.BaseMaterial[];
    private s2:Laya.BaseMaterial[];
    private ms:Laya.MeshSprite3D;

    public static sp:Laya.Sprite3D;

    public setShader0(sp3d:Laya.Sprite3D,type:number):void{
        if(type==8000 && !GameShaderObj.sp){
            GameShaderObj.sp = sp3d;
            console.log(sp3d);
            
        }
    }

    private initShader():void {
        var attributeMap:Object = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0, 
            'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0, 
            'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
        };
        var uniformMap:Object = {
            'u_Bones': Laya.Shader3D.PERIOD_CUSTOM, 
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA, 
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE, 
            'u_texture': Laya.Shader3D.PERIOD_MATERIAL, 
            'u_marginalColor': Laya.Shader3D.PERIOD_MATERIAL, 
            'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE, 
            'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE
        };
        var vs:string = `
        #include "Lighting.glsl";
        attribute vec4 a_Position;
        attribute vec2 a_Texcoord;
        attribute vec3 a_Normal;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        varying vec2 v_Texcoord;
        varying vec3 v_Normal;
        #ifdef BONE
        attribute vec4 a_BoneIndices;
        attribute vec4 a_BoneWeights;
        const int c_MaxBoneCount = 24;
        uniform mat4 u_Bones[c_MaxBoneCount];
        #endif
        #if defined(DIRECTIONLIGHT)
        varying vec3 v_PositionWorld;
        #endif
        void main()
        {
        #ifdef BONE
        mat4 skinTransform=mat4(0.0);
        skinTransform += u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
        vec4 position = skinTransform * a_Position;
        gl_Position=u_MvpMatrix * position;
        mat3 worldMat=mat3(u_WorldMat * skinTransform);
        #else
        gl_Position=u_MvpMatrix * a_Position;
        mat3 worldMat=mat3(u_WorldMat);
        #endif
        v_Texcoord=a_Texcoord;
        v_Normal=worldMat*a_Normal;
        #if defined(DIRECTIONLIGHT)
        #ifdef BONE
        v_PositionWorld=(u_WorldMat*position).xyz;
        #else
        v_PositionWorld=(u_WorldMat*a_Position).xyz;
        #endif
        #endif
        gl_Position=remapGLPositionZ(gl_Position); 
        }`;
        var ps:string = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        #include "Lighting.glsl";
        varying vec2 v_Texcoord;
        uniform sampler2D u_texture;
        uniform vec3 u_marginalColor;
        varying vec3 v_Normal;
        #if defined(DIRECTIONLIGHT)
        uniform vec3 u_CameraPos;
        varying vec3 v_PositionWorld;
        uniform DirectionLight u_DirectionLight;
        #endif
        void main()
        {
        gl_FragColor=texture2D(u_texture,v_Texcoord);
        vec3 normal=normalize(v_Normal);
        vec3 toEyeDir = normalize(u_CameraPos-v_PositionWorld);
        float Rim = 1.0 - max(0.0,dot(toEyeDir, normal));
        vec3 Emissive = 15.0 * u_DirectionLight.Color * u_marginalColor * pow(Rim,3.0); 
        gl_FragColor = texture2D(u_texture, v_Texcoord) + vec4(Emissive,1.0);
        }`;

        
        //创建自定义Shader
        var customShader:Laya.Shader3D = Laya.Shader3D.add("CustomShader");
        //为Shader添加SubShader
		var subShader:Laya.SubShader = new Laya.SubShader(attributeMap, uniformMap, Laya.SkinnedMeshSprite3D.shaderDefines);
        customShader.addSubShader(subShader);
        //为SubShader添加ShaderPass
        subShader.addShaderPass(vs,ps);
    }
}