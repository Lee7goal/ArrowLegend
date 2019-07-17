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
		
		public draw(g:Laya.Graphics,linecolor:string):void{
            g.drawLine(this.p0_.x,this.p0_.y,this.p1_.x,this.p1_.y,linecolor);
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

        public get xlen():number{
            return ( this.x0 - this.x1 );
        }

        public get ylen():number{
            return ( this.y0 - this.y1 );
        }

        public getlen():number{
            var xl = this.xlen;
            var yl = this.ylen;
            return Math.sqrt((xl*xl)+(yl*yl));
        }

        /**(x,y) = (-y,x)逆时针法线 但对于laya的-y轴来说，是顺时针*/
        public getF0():MaoLineData{
            var xl = this.xlen;
            var yl = this.ylen;
            return new MaoLineData(0,0,-1*yl,xl);
        }

        /**(x,y) = (y,-x)顺时针法线 但对于laya的-y轴来说，是逆时针*/
        public getF1():MaoLineData{
            var xl = this.xlen;
            var yl = this.ylen;
            return new MaoLineData(0,0,yl,-1*xl);
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
			var linev = this;
			var p = linev.lineTest(line0);//交点
			if(!p){				
				return null;
			}

			var v:MaoLineData = new MaoLineData(linev.x0,linev.y0,p.x,p.y);
			var f0l = line0.getlen();
			var n0x = line0.xlen / f0l;
			var n0y = line0.ylen / f0l;

			var nx = -(v.xlen*n0x+v.ylen*n0y)*n0x ; // n的x分量
			var ny = -(v.xlen*n0x+v.ylen*n0y)*n0y ; // n的y分量
	
			var Tx = v.xlen + nx ; // T的x分量
			var Ty = v.ylen + ny ; // T的y分量

			//F = 2*T - S			
			var Fx = 2*Tx - v.xlen ; // F的x分量
			var Fy = 2*Ty - v.ylen ; // F的y分量
			
			v.reset(p.x,p.y,p.x+Fx,p.y+Fy);
			return v;
		}
        
       
}