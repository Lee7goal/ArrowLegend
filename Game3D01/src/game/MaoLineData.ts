export default class MaoLineData{
    constructor(x0:Number , y0:Number , x1:Number , y1:Number)
    {

    }
}
/*
package com.maoxiaolu.game.linetest
{
	import flash.display.Graphics;
	import flash.geom.Point;
	
	
	public class MaoLineData
	{
		public const p0:Point = new Point();
		public const p1:Point = new Point();
		
		public function MaoLineData(x0:int , y0:Number , x1:Number , y1:Number)
		{
			p0.x = x0;
			p0.y = y0;			
			p1.x = x1;
			p1.y = y1;
		}
		
		public function reset(x0:int , y0:Number , x1:Number , y1:Number):void{
			p0.x = x0;
			p0.y = y0;			
			p1.x = x1;
			p1.y = y1;
		}
		
		public function draw(g:Graphics):void{
			g.moveTo(p0.x , p0.y );
			g.lineTo(p1.x , p1.y );
		}
		
		public function set x0(value:int):void{
			this.p0.x = value;
		}
		
		public function get x0():int{
			return this.p0.x;
		}
		
		public function set y0(value:int):void{
			this.p0.y = value;
		}
		
		public function get y0():int{
			return this.p0.y;
		}
		
		public function set x1(value:int):void{
			this.p1.x = value;
		}
		
		public function get x1():int{
			return this.p1.x;
		}
		
		public function set y1(value:int):void{
			this.p1.y = value;
		}
		
		public function get y1():int{
			return this.p1.y;
		}
	}
}

*/