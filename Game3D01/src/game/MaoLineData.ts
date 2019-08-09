import Point = Laya.Point;
import MaoLineTest from "./MaoLineTest";

/** 线数据类 */
export default class MaoLineData{
        private p0_:Point = new Point();
		private p1_:Point = new Point();
		
		constructor(x0:number , y0:number , x1:number , y1:number)
		{
			this.p0_.x = x0;
			this.p0_.y = y0;			
			this.p1_.x = x1;
			this.p1_.y = y1;
		}
		
		public reset(x0:number , y0:number , x1:number , y1:number):void{
			this.p0_.x = x0;
			this.p0_.y = y0;			
			this.p1_.x = x1;
			this.p1_.y = y1;
		}

		public reset00(x0:number , y0:number):void{
			var l = this.getlen();
			var rad = this.atan2();
			this.p0_.x = x0;
			this.p0_.y = y0;
			
			this.p1_.x = x0 + Math.cos(rad)*l;
			this.p1_.y = y0 + Math.sin(rad)*l;
		}

		public resetlen(len:number):void{
			var l = len;
			var rad = this.atan2();			
			this.p1_.x = this.p0_.x + Math.cos(rad)*l;
			this.p1_.y = this.p0_.y + Math.sin(rad)*l;
		}
		
		public draw(g:Laya.Graphics,linecolor:string,lw:number=1):void{
            g.drawLine(this.p0_.x,this.p0_.y,this.p1_.x,this.p1_.y,linecolor,lw);
        }
        
        public get p0():Point{
			return this.p0_;
        }
        
        public get p1():Point{
			return this.p1_;
		}
		
		public set x0(value:number){
			this.p0_.x = value;
		}
		
		public get x0():number{
			return this.p0_.x;
		}
		
		public set y0(value:number){
			this.p0_.y = value;
		}
		
		public get y0():number{
			return this.p0_.y;
		}
		
		public set x1(value:number){
			this.p1_.x = value;
		}
		
		public get x1():number{
			return this.p1_.x;
		}
		
		public set y1(value:number){
			this.p1_.y = value;
		}
		
		public get y1():number{
			return this.p1_.y;
        }

        public get x_len():number{
            return ( this.x1 - this.x0 );
        }

        public get y_len():number{
            return ( this.y1 - this.y0 );
        }

        public getlen():number{
            var xl = this.x_len;
            var yl = this.y_len;
            return Math.sqrt((xl*xl)+(yl*yl));
        }

        /**(x,y) = (-y,x)逆时针法线 但对于laya的-y轴来说，是顺时针*/
        public getF0():MaoLineData{
            var xl = this.x_len;
            var yl = this.y_len;
            return new MaoLineData(this.x0,this.y0,this.x0 - yl, this.y0 + xl);
        }

        /**(x,y) = (y,-x)顺时针法线 但对于laya的-y轴来说，是逆时针*/
        public getF1():MaoLineData{
            var xl = this.x_len;
            var yl = this.y_len;
			return new MaoLineData(this.x0,this.y0,this.x0 + yl, this.y0 - xl);
		}
		
		/**
		 * other 另一条线
		 * 返回两线的交点 （x,y） null 无交点 */
        public lineTest(other:MaoLineData):Point{
            return MaoLineTest.simpleLineTestMao(this,other);
		}
		
		/**返回线的角度 */
		public atan2():number{
			return Math.atan2( (this.y1 - this.y0) , (this.x1 - this.x0));
		}

		/**设置线的角度 */
		public rad(rad:number):number{
			var len = this.getlen();
			this.p1.x = this.p0.x + (len * Math.cos(rad));
			this.p1.y = this.p0.y + (len * Math.sin(rad));			
			return rad;
		}

		/**得到反弹线 */
		public rebound(line0:MaoLineData):MaoLineData{
			//var g = Laya.stage.graphics
			//g.clear();
			var line0:MaoLineData = line0;
			var linev:MaoLineData = this;
			// line0.draw(g,"0xff0000");
			// linev.draw(g,"0x00ff00");
			// g.drawCircle(line0.x0,line0.y0,5,null,"0xff0000");
			// g.drawCircle(linev.x0,linev.y0,5,null,"0x00ff00");

			var p = linev.lineTest(line0);
			if(!p){
				return null;
			}
			//g.drawCircle(p.x,p.y,5,null,"0x00ff00");

			var f0 = line0.getF0();
			//f0.reset00(p.x,p.y);
			//f0.draw(g,"0xffffff");
			//var f1 = line0.getF1();
			//f1.reset00(p.x,p.y);
			//f1.draw(g,"0xffff00");

			// 计算N的长度
			var f = f0;
			var lengthN = Math.sqrt( f.x_len*f.x_len + f.y_len*f.y_len ) ;
			// 归一化N为n'
			var n0x = f.x_len / lengthN ; // n0x就是n'的x分量
			var n0y = f.y_len / lengthN ; // n0y就是n'的y分量
			// 计算n，就是S在N方向上的投影向量
			// 根据b'= (-b.a1').a1'，有n = (-S.n').n'
			var nx = -(linev.x_len*n0x+linev.y_len*n0y)*n0x ; // n的x分量
			var ny = -(linev.x_len*n0x+linev.y_len*n0y)*n0y ; // n的y分量
			// 计算T
			// T = S + n
			var Tx = linev.x_len + nx ; // T的x分量
			var Ty = linev.y_len + ny ; // T的y分量
			// 有了T，有了F = 2*T - S，好了，你现在拥有一切了
			// 计算F
			var Fx = 2*Tx - linev.x_len ; // F的x分量
			var Fy = 2*Ty - linev.y_len ; // F的y分量
			// 现在已经计算出了反弹后的速度向量了
			// 更新速度向量
			var nv = new MaoLineData(p.x,p.y,p.x+Fx,p.y+Fy);
			return nv;
			//nv.draw(g,"0x00ffff");
		}

		/**得到反弹线 错误的 */
		private rebound_error(line0:MaoLineData):MaoLineData{			
			var linev = this;
			var p = linev.lineTest(line0);//交点
			if(!p){				
				return null;
			}

			var v:MaoLineData = new MaoLineData(linev.x0,linev.y0,p.x,p.y);
			var f0l = line0.getlen();
			var n0x = line0.x_len / f0l;
			var n0y = line0.y_len / f0l;

			var nx = -(v.x_len*n0x+v.y_len*n0y)*n0x ; // n的x分量
			var ny = -(v.x_len*n0x+v.y_len*n0y)*n0y ; // n的y分量
	
			var Tx = v.x_len + nx ; // T的x分量
			var Ty = v.y_len + ny ; // T的y分量

			//F = 2*T - S			
			var Fx = 2*Tx - v.x_len ; // F的x分量
			var Fy = 2*Ty - v.y_len ; // F的y分量
			
			v.reset(p.x,p.y,p.x+Fx,p.y+Fy);
			return v;
		}

		static len(x0:number,y0:number,x1:number,y1:number):number{
			var xx = x1 - x0;
			var yy = y1 - y0;
			return Math.sqrt(xx*xx+yy*yy);
		}
        
       
}