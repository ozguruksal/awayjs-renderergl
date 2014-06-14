﻿///<reference path="../../_definitions.ts"/>

module away.materials
{
	import LineSubGeometry							= away.base.LineSubGeometry;
	import StageGL									= away.base.StageGL;
	import Camera									= away.entities.Camera;
	import Matrix3D									= away.geom.Matrix3D;
	import RenderableBase							= away.pool.RenderableBase;
	import ContextGLProgramType						= away.stagegl.ContextGLProgramType;
	import IContext									= away.stagegl.IContext;

	/**
	 * SegmentPass is a material pass that draws wireframe segments.
	 */
	export class SegmentPass extends MaterialPassBase
	{
		public static pONE_VECTOR:Array<number> = Array<number>(1, 1, 1, 1);
		public static pFRONT_VECTOR:Array<number> = Array<number>(0, 0, -1, 0);

		private _constants:Array<number> = new Array<number>(0, 0, 0, 0);
		private _calcMatrix:Matrix3D;
		private _thickness:number;

		/**
		 * Creates a new SegmentPass object.
		 *
		 * @param thickness the thickness of the segments to be drawn.
		 */
		constructor(thickness:number)
		{
			super();

			this._calcMatrix = new Matrix3D();

			this._thickness = thickness;
			this._constants[1] = 1/255;
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			return "m44 vt0, va0, vc8			\n" + // transform Q0 to eye space
				"m44 vt1, va1, vc8			\n" + // transform Q1 to eye space
				"sub vt2, vt1, vt0 			\n" + // L = Q1 - Q0

				// test if behind camera near plane
				// if 0 - Q0.z < Camera.near then the point needs to be clipped
				//"neg vt5.x, vt0.z				\n" + // 0 - Q0.z
				"slt vt5.x, vt0.z, vc7.z			\n" + // behind = ( 0 - Q0.z < -Camera.near ) ? 1 : 0
				"sub vt5.y, vc5.x, vt5.x			\n" + // !behind = 1 - behind

				// p = point on the plane (0,0,-near)
				// n = plane normal (0,0,-1)
				// D = Q1 - Q0
				// t = ( dot( n, ( p - Q0 ) ) / ( dot( n, d )

				// solve for t where line crosses Camera.near
				"add vt4.x, vt0.z, vc7.z			\n" + // Q0.z + ( -Camera.near )
				"sub vt4.y, vt0.z, vt1.z			\n" + // Q0.z - Q1.z

				// fix divide by zero for horizontal lines	
				"seq vt4.z, vt4.y vc6.x			\n" + // offset = (Q0.z - Q1.z)==0 ? 1 : 0
				"add vt4.y, vt4.y, vt4.z			\n" + // ( Q0.z - Q1.z ) + offset

				"div vt4.z, vt4.x, vt4.y			\n" + // t = ( Q0.z - near ) / ( Q0.z - Q1.z )

				"mul vt4.xyz, vt4.zzz, vt2.xyz	\n" + // t(L)
				"add vt3.xyz, vt0.xyz, vt4.xyz	\n" + // Qclipped = Q0 + t(L)
				"mov vt3.w, vc5.x			\n" + // Qclipped.w = 1

				// If necessary, replace Q0 with new Qclipped
				"mul vt0, vt0, vt5.yyyy			\n" + // !behind * Q0
				"mul vt3, vt3, vt5.xxxx			\n" + // behind * Qclipped
				"add vt0, vt0, vt3				\n" + // newQ0 = Q0 + Qclipped

				// calculate side vector for line
				"sub vt2, vt1, vt0 			\n" + // L = Q1 - Q0
				"nrm vt2.xyz, vt2.xyz			\n" + // normalize( L )
				"nrm vt5.xyz, vt0.xyz			\n" + // D = normalize( Q1 )
				"mov vt5.w, vc5.x				\n" + // D.w = 1
				"crs vt3.xyz, vt2, vt5			\n" + // S = L x D
				"nrm vt3.xyz, vt3.xyz			\n" + // normalize( S )

				// face the side vector properly for the given point
				"mul vt3.xyz, vt3.xyz, va2.xxx	\n" + // S *= weight
				"mov vt3.w, vc5.x			\n" + // S.w = 1

				// calculate the amount required to move at the point's distance to correspond to the line's pixel width
				// scale the side vector by that amount
				"dp3 vt4.x, vt0, vc6			\n" + // distance = dot( view )
				"mul vt4.x, vt4.x, vc7.x			\n" + // distance *= vpsod
				"mul vt3.xyz, vt3.xyz, vt4.xxx	\n" + // S.xyz *= pixelScaleFactor

				// add scaled side vector to Q0 and transform to clip space
				"add vt0.xyz, vt0.xyz, vt3.xyz	\n" + // Q0 + S

				"m44 op, vt0, vc0			\n" + // transform Q0 to clip space

				// interpolate color
				"mov v0, va3				\n";
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(animationCode:string):string
		{
			return "mov oc, v0\n";
		}

		/**
		 * @inheritDoc
		 * todo: keep maps in dictionary per renderable
		 */
		public iRender(renderable:RenderableBase, stageGL:StageGL, camera:Camera, viewProjection:Matrix3D)
		{
			var context:IContext = stageGL.contextGL;
			this._calcMatrix.copyFrom(renderable.sourceEntity.sceneTransform);
			this._calcMatrix.append(camera.inverseSceneTransform);

			context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 8, this._calcMatrix, true);

			stageGL.activateBuffer(0, renderable.getVertexData(LineSubGeometry.START_POSITION_DATA), renderable.getVertexOffset(LineSubGeometry.START_POSITION_DATA), LineSubGeometry.POSITION_FORMAT);
			stageGL.activateBuffer(1, renderable.getVertexData(LineSubGeometry.END_POSITION_DATA), renderable.getVertexOffset(LineSubGeometry.END_POSITION_DATA), LineSubGeometry.POSITION_FORMAT);
			stageGL.activateBuffer(2, renderable.getVertexData(LineSubGeometry.THICKNESS_DATA), renderable.getVertexOffset(LineSubGeometry.THICKNESS_DATA), LineSubGeometry.THICKNESS_FORMAT);
			stageGL.activateBuffer(3, renderable.getVertexData(LineSubGeometry.COLOR_DATA), renderable.getVertexOffset(LineSubGeometry.COLOR_DATA), LineSubGeometry.COLOR_FORMAT);

			context.drawTriangles(stageGL.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stageGL:StageGL, camera:Camera)
		{
			var context:IContext = stageGL.contextGL;
			super.iActivate(stageGL, camera);

			this._constants[0] = this._thickness/((stageGL.scissorRect)? Math.min(stageGL.scissorRect.width, stageGL.scissorRect.height) : Math.min(stageGL.width, stageGL.height));

			// value to convert distance from camera to model length per pixel width
			this._constants[2] = camera.projection.near;

			context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 5, SegmentPass.pONE_VECTOR, 1);
			context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 6, SegmentPass.pFRONT_VECTOR, 1);
			context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 7, this._constants, 1);

			// projection matrix
			context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, camera.projection.matrix, true);
		}

		/**
		 * @inheritDoc
		 */
		public pDeactivate(stageGL:StageGL)
		{
			var context:IContext = stageGL.contextGL;
			context.setVertexBufferAt(0, null);
			context.setVertexBufferAt(1, null);
			context.setVertexBufferAt(2, null);
			context.setVertexBufferAt(3, null);
		}
	}
}
