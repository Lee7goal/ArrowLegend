import Point = Laya.Point;
import MaoLineData from "./MaoLineData";

/**
 * 2D线段检测类
 * 返回两线的交点 （x,y） null 无交点 */
export default class MaoLineTest{

    private static intersectionP(u1:Point , u2:Point , v1:Point , v2:Point ):Point{
        var  ret:Point = new Point(u1.x , u1.y);			
        var t:number =((u1.x-v1.x)*(v1.y-v2.y)-(u1.y-v1.y)*(v1.x-v2.x))/((u1.x-u2.x)*(v1.y-v2.y)-(u1.y-u2.y)*(v1.x-v2.x));
        ret.x+=(u2.x-u1.x)*t;
        ret.y+=(u2.y-u1.y)*t;
        return ret;
    }

    private static intersectionMao(u:MaoLineData , v:MaoLineData):Point{			
        return MaoLineTest.intersectionP(u.p0,u.p1,v.p0,v.p1);
    }

    private static simpleLineTestXY(l1p1x:number,l1p1y:number,l1p2x:number,l1p2y:number,l2p1x:number,l2p1y:number,l2p2x:number,l2p2y:number , u:MaoLineData , v:MaoLineData):Point {
        //这个函数是核心，它检测两条线是否相交，每条线有四项数据（开始点的两个坐标，结束点的两个坐标），所以两条线总共需要8个参数
        var line1p1:number;
        line1p1=(l1p2x-l1p1x)*(l2p1y-l1p1y)-(l2p1x-l1p1x)*(l1p2y-l1p1y);
        //第一条线段的向量和（第一条线段的开始点与第二条线段的开始点组成的向量）的向量积
        
        var line1p2:number;
        line1p2=(l1p2x-l1p1x)*(l2p2y-l1p1y)-(l2p2x-l1p1x)*(l1p2y-l1p1y);
        //第一条线段的向量和（第一条线段的开始点与第二条线段的结束点组成的向量）的向量积
        
        var line2p1:number;
        line2p1=(l2p2x-l2p1x)*(l1p1y-l2p1y)-(l1p1x-l2p1x)*(l2p2y-l2p1y);
        //第二条线段的向量和（第二条线段的开始点与第一条线段的开始点组成的向量）的向量积
        
        var line2p2:number;		
        line2p2=(l2p2x-l2p1x)*(l1p2y-l2p1y)-(l1p2x-l2p1x)*(l2p2y-l2p1y);
        //第二条线段的向量和（第二条线段的开始点与第一条线段的结束点组成的向量）的向量积
        
        if ((line1p1*line1p2<=0)&&(line2p1*line2p2<=0)) {//判断方法在先前讲过
            //return true;//相交
            return MaoLineTest.intersectionMao(u,v);
        } else {
            return null;
            //return false;//否则不相交
        }
    }

    /**返回两线的交点 （x,y） null 无交点 */
    public static simpleLineTestMao(u:MaoLineData , v:MaoLineData):Point {
        return MaoLineTest.simpleLineTestXY(u.p0.x , u.p0.y , u.p1.x , u.p1.y , v.p0.x , v.p0.y , v.p1.x , v.p1.y , u , v );
    }
}

/*
参考资料
根据向量内积的性质以及正交向量之间的关系，有：
设a=(xa,ya),b=(xb,yb)
a.b = 0
=> xa*xb + ya*yb = 0
=> xa*xb = -ya*yb
=> xa/-ya = yb/xb
=> xb = -ya , yb = xa 或 xb = ya , yb = -xa
则向量(xa,ya)的正交向量为(xb,yb)=(-ya,xa)
比如上图中，向量(2,3)的逆时针旋转90度的正交向量是(-3,2)，顺时针旋转90度的正交向量为(3,-2)。
这样，任给一个非零向量(x,y)，则它相对坐标轴逆时针转90度的正交向量为(-y,x),顺时针转90度的正交向量为(y,-x)。
a.b = 0
(x,y) = (-y,x)//逆时针
(x,y) = (y,-x)//顺时针
a.b = 
|a|*|b|*cosA = 
|a|*|b|*cos(2*PI-A)
在游戏循环中
移动的物体简化为质点,位置是x=0.0f,y=0.0f
质点速度向量的分量是Svx=4.0f,Svy=2.0f
障碍向量是bx=14.0f-6.0f=8.0f,by=4.0f-12.0f=-8.0f
则障碍向量的垂直向量是Nx=-8.0f,Ny=-8.0f
这里可以加入碰撞检测
现在假设已经碰撞完毕，开始反弹计算！
// 计算N的长度
float lengthN = sqrt( Nx*Nx + Ny*Ny ) ;
// 归一化N为n'
float n0x = Nx / lengthN ; // n0x就是n'的x分量
float n0y = Ny / lengthN ; // n0y就是n'的y分量
// 计算n，就是S在N方向上的投影向量
// 根据b'= (-b.a1').a1'，有n = (-S.n').n'
float nx = -(Svx*n0x+Svy*n0y)*n0x ; // n的x分量
float ny = -(Svx*n0x+Svy*n0y)*n0y ; // n的y分量
// 计算T
// T = S + n
float Tx = Svx + nx ; // T的x分量
float Ty = Svy + ny ; // T的y分量
// 有了T，有了F = 2*T - S，好了，你现在拥有一切了
// 计算F
float Fx = 2*Tx - Svx ; // F的x分量
float Fy = 2*Ty - Svy ; // F的y分量
// 现在已经计算出了反弹后的速度向量了
// 更新速度向量
Svx = Fx ;
Svy = Fy ;
// 质点移动
x+=Svx ;
y+=Svy ;
// 现在你就可以看到质点被无情的反弹回去了
// 而且是按照物理法则在理想环境下模拟
--------------------- 
作者：Twinsen 
来源：CSDN 
原文：https://blog.csdn.net/popy007/article/details/376937 
版权声明：本文为博主原创文章，转载请附上博文链接！
*/