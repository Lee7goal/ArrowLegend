import CustomShaderff00 from "./CustomShaderff00";

export default class Line3d{
   
    getFF00():Laya.MeshSprite3D{
        // var rect = this.createRect(0.1,0.1);
        // if(rect){
            //var s:Laya.MeshSprite3D = new Laya.MeshSprite3D(rect);            
            //let customMaterial = CustomShaderff00.ff00;
            var s = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1,1,0));
            s.meshRenderer.sharedMaterial = CustomShaderff00.ff00;
            s.transform.localRotationEulerX = -30;
            return s;
        // }
        //return null;
    }

    createRect(Width:number,height:number):Laya.Mesh{
        var vertexDeclaration=Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");         
        var halfHeight=Width / 2;
        var halfWidth =height / 2;

        var vertices = new Float32Array([
           -halfWidth,  halfHeight, 0,  0,0,1,  0,0,            
            halfWidth, -halfHeight, 0,  0,0,1,  0,0,            
           -halfWidth, -halfHeight, 0,  0,0,1,  0,0,
            halfWidth,  halfHeight, 0,  0,0,1,  0,0
       ])

       var indices=new Uint16Array([
           0,1,2,0,3,1
       ]);

       var f = Laya.PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
       
       return f;
       //return null;
   }
}