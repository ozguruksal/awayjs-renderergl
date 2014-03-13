///<reference path="../_definitions.ts"/>

module away.primitives
{
	//TODO - convert to geometry primitive

	/**
	 * Generates a wireframd cylinder primitive.
	 */
	export class WireframeCylinder extends away.primitives.WireframePrimitiveBase
	{
		private static TWO_PI:number = 2*Math.PI;

		private _bottomRadius:number;
		private _cylinderHeight:number;
		private _segmentsH:number;
		private _segmentsW:number;
		private _topRadius:number;

		/**
		 * Bottom radius of the cylinder. Defaults to 50.
		 */
		public get bottomRadius():number
		{
			return this._bottomRadius;
		}

		public set bottomRadius(value:number)
		{
			if (this._bottomRadius == value)
				return;

			this._bottomRadius = value;

			this.pInvalidateGeometry();
		}

		/**
		 * The size of the cylinder along its Y-axis. Defaults to 100.
		 */
		public get cylinderHeight():number
		{
			return this._cylinderHeight;
		}

		public set cylinderHeight(value:number)
		{
			if (this._cylinderHeight == value)
				return;

			this._cylinderHeight == value

			this.pInvalidateGeometry();
		}

		/**
		 * Defines the number of vertical segments that make up the cylinder. Defaults to 1.
		 */
		public get segmentsH():number
		{
			return this._segmentsH;
		}

		public set segmentsH(value:number)
		{
			if (this._segmentsH == value)
				return;

			this._segmentsH = value;

			this.pInvalidateGeometry();
		}

		/**
		 * Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
		 */
		public get segmentsW():number
		{
			return this._segmentsW;
		}

		public set segmentsW(value:number)
		{
			if (this._segmentsW == value)
				return;

			this._segmentsW = value;

			this.pInvalidateGeometry();
		}

		/**
		 * Top radius of the cylinder. Defaults to 50.
		 */
		public get topRadius():number
		{
			return this._topRadius;
		}

		public set topRadius(value:number)
		{
			if (this._topRadius == value)
				return;

			this._topRadius = value;

			this.pInvalidateGeometry();
		}

		/**
		 * Creates a new WireframeCylinder instance
		 *
		 * @param topRadius Top radius of the cylinder. Defaults to 50.
		 * @param bottomRadius Bottom radius of the cylinder. Defaults to 50.
		 * @param cylinderHeight The height of the cylinder. Defaults to 100.
		 * @param segmentsW Number of radial segments. Defaults to 16.
		 * @param segmentsH Number of vertical segments. Defaults to 1.
		 * @param color The color of the wireframe lines. Defaults to <code>0xFFFFFF</code>.
		 * @param thickness The thickness of the wireframe lines. Defaults to 1.
		 */
		constructor(topRadius:number = 50, bottomRadius:number = 50, cylinderHeight:number = 100, segmentsW:number = 16, segmentsH:number = 1, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);
			this._topRadius = topRadius;
			this._bottomRadius = bottomRadius;
			this._segmentsW = segmentsW;
			this._segmentsH = segmentsH;

			this._cylinderHeight = cylinderHeight;
		}

		public pBuildGeometry()
		{

			var i:number, j:number;
			var radius:number = this._topRadius;
			var revolutionAngle:number;
			var revolutionAngleDelta:number = WireframeCylinder.TWO_PI/this._segmentsW;
			var nextVertexIndex:number = 0;
			var x:number, y:number, z:number;

			var lastLayer:away.geom.Vector3D[][] = new Array<Array<away.geom.Vector3D>>(this._segmentsH + 1);

			for (j = 0; j <= this._segmentsH; ++j) {
				lastLayer[j] = new Array<away.geom.Vector3D>(this._segmentsW + 1);

				radius = this._topRadius - ((j/this._segmentsH)*(this._topRadius - this._bottomRadius));
				z = this._cylinderHeight*(j/this._segmentsH - 0.5);

				var previousV:away.geom.Vector3D = null;

				for (i = 0; i <= this._segmentsW; ++i) {
					// revolution vertex
					revolutionAngle = i*revolutionAngleDelta;
					x = radius*Math.cos(revolutionAngle);
					y = radius*Math.sin(revolutionAngle);
					var vertex:away.geom.Vector3D;
					if (previousV) {
						vertex = new away.geom.Vector3D(x, -z, y);
						this.pUpdateOrAddSegment(nextVertexIndex++, vertex, previousV);
						previousV = vertex;
					} else
						previousV = new away.geom.Vector3D(x, -z, y);

					if (j > 0) {
						this.pUpdateOrAddSegment(nextVertexIndex++, vertex, lastLayer[j - 1][i]);
					}
					lastLayer[j][i] = previousV;
				}
			}
		}
	}
}
