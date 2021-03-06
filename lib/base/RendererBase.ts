import BitmapData					= require("awayjs-core/lib/data/BitmapData");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Plane3D						= require("awayjs-core/lib/geom/Plane3D");
import Point						= require("awayjs-core/lib/geom/Point");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");
import TextureBase					= require("awayjs-core/lib/textures/TextureBase");
import ByteArray					= require("awayjs-core/lib/utils/ByteArray");

import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import EntityListItem				= require("awayjs-display/lib/pool/EntityListItem");
import IEntitySorter				= require("awayjs-display/lib/sort/IEntitySorter");
import RenderableMergeSort			= require("awayjs-display/lib/sort/RenderableMergeSort");
import IRenderer					= require("awayjs-display/lib/render/IRenderer");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import Camera						= require("awayjs-display/lib/entities/Camera");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import RendererEvent				= require("awayjs-display/lib/events/RendererEvent");
import StageEvent					= require("awayjs-stagegl/lib/events/StageEvent");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");
import CollectorBase				= require("awayjs-display/lib/traverse/CollectorBase");
import ShadowCasterCollector		= require("awayjs-display/lib/traverse/ShadowCasterCollector");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");

import AGALMiniAssembler			= require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import StageManager					= require("awayjs-stagegl/lib/managers/StageManager");
import ProgramData					= require("awayjs-stagegl/lib/pool/ProgramData");

import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRendererPoolClass			= require("awayjs-renderergl/lib/pool/IRendererPoolClass");
import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");
import RendererPoolBase				= require("awayjs-renderergl/lib/pool/RendererPoolBase");


/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
class RendererBase extends EventDispatcher
{
	private _numUsedStreams:number = 0;
	private _numUsedTextures:number = 0;

	private _rendererPool:RendererPoolBase;

	public _pRendererPoolClass:IRendererPoolClass;
	public _pContext:IContextGL;
	public _pStage:Stage;

	public _pCamera:Camera;
	public _iEntryPoint:Vector3D;
	public _pCameraForward:Vector3D;

	public _pRttBufferManager:RTTBufferManager;
	private _viewPort:Rectangle = new Rectangle();
	private _viewportDirty:boolean;
	private _scissorDirty:boolean;

	public _pBackBufferInvalid:boolean = true;
	public _pDepthTextureInvalid:boolean = true;
	public _depthPrepass:boolean = false;
	private _backgroundR:number = 0;
	private _backgroundG:number = 0;
	private _backgroundB:number = 0;
	private _backgroundAlpha:number = 1;
	public _shareContext:boolean = false;

	// only used by renderers that need to render geometry to textures
	public _width:number;
	public _height:number;

	public textureRatioX:number = 1;
	public textureRatioY:number = 1;

	private _snapshotBitmapData:BitmapData;
	private _snapshotRequired:boolean;

	public _pRttViewProjectionMatrix:Matrix3D = new Matrix3D();

	private _localPos:Point = new Point();
	private _globalPos:Point = new Point();
	public _pScissorRect:Rectangle = new Rectangle();

	private _scissorUpdated:RendererEvent;
	private _viewPortUpdated:RendererEvent;

	private _onContextUpdateDelegate:Function;
	private _onViewportUpdatedDelegate;

	public _pNumTriangles:number = 0;

	public _pOpaqueRenderableHead:RenderableBase;
	public _pBlendedRenderableHead:RenderableBase;
	public _disableColor:boolean = false;
	public _renderBlended:boolean = true;


	public get renderBlended():boolean
	{
		return this._renderBlended;
	}

	public set renderBlended(value:boolean)
	{
		this._renderBlended = value;
	}


	public get disableColor():boolean
	{
		return this._disableColor;
	}

	public set disableColor(value:boolean)
	{
		this._disableColor = value;
	}

	/**
	 *
	 */
	public get numTriangles():number
	{
		return this._pNumTriangles;
	}

	/**
	 *
	 */
	public renderableSorter:IEntitySorter;


	/**
	 * A viewPort rectangle equivalent of the Stage size and position.
	 */
	public get viewPort():Rectangle
	{
		return this._viewPort;
	}

	/**
	 * A scissor rectangle equivalent of the view size and position.
	 */
	public get scissorRect():Rectangle
	{
		return this._pScissorRect;
	}

	/**
	 *
	 */
	public get x():number
	{
		return this._localPos.x;
	}

	public set x(value:number)
	{
		if (this.x == value)
			return;

		this._globalPos.x = this._localPos.x = value;

		this.updateGlobalPos();
	}

	/**
	 *
	 */
	public get y():number
	{
		return this._localPos.y;
	}

	public set y(value:number)
	{
		if (this.y == value)
			return;

		this._globalPos.y = this._localPos.y = value;

		this.updateGlobalPos();
	}

	/**
	 *
	 */
	public get width():number
	{
		return this._width;
	}

	public set width(value:number)
	{
		if (this._width == value)
			return;

		this._width = value;
		this._pScissorRect.width = value;

		if (this._pRttBufferManager)
			this._pRttBufferManager.viewWidth = value;

		this._pBackBufferInvalid = true;
		this._pDepthTextureInvalid = true;

		this.notifyScissorUpdate();
	}

	/**
	 *
	 */
	public get height():number
	{
		return this._height;
	}

	public set height(value:number)
	{
		if (this._height == value)
			return;

		this._height = value;
		this._pScissorRect.height = value;

		if (this._pRttBufferManager)
			this._pRttBufferManager.viewHeight = value;

		this._pBackBufferInvalid = true;
		this._pDepthTextureInvalid = true;

		this.notifyScissorUpdate();
	}

	/**
	 * Creates a new RendererBase object.
	 */
	constructor(rendererPoolClass:IRendererPoolClass = null, stage:Stage = null)
	{
		super();

		this._pRendererPoolClass = rendererPoolClass;

		this._onViewportUpdatedDelegate = (event:StageEvent) => this.onViewportUpdated(event)
		this._onContextUpdateDelegate = (event:Event) => this.onContextUpdate(event);

		//default sorting algorithm
		this.renderableSorter = new RenderableMergeSort();

		this._rendererPool = (rendererPoolClass)? new this._pRendererPoolClass(this) : new RendererPoolBase(this);

		this.stage = stage || StageManager.getInstance().getFreeStage();
	}

	public activatePass(renderable:RenderableBase, pass:RenderPassBase, camera:Camera)
	{
		//clear unused vertex streams
		for (var i = pass.shader.numUsedStreams; i < this._numUsedStreams; i++)
			this._pContext.setVertexBufferAt(i, null);

		//clear unused texture streams
		for (var i = pass.shader.numUsedTextures; i < this._numUsedTextures; i++)
			this._pContext.setTextureAt(i, null);

		//check program data is uploaded
		var programData:ProgramData = pass.shader.programData;

		if (!programData.program) {
			programData.program = this._pContext.createProgram();
			var vertexByteCode:ByteArray = (new AGALMiniAssembler().assemble("part vertex 1\n" + programData.vertexString + "endpart"))['vertex'].data;
			var fragmentByteCode:ByteArray = (new AGALMiniAssembler().assemble("part fragment 1\n" + programData.fragmentString + "endpart"))['fragment'].data;
			programData.program.upload(vertexByteCode, fragmentByteCode);
		}

		//set program data
		this._pContext.setProgram(programData.program);

		//activate shader object through renderable
		renderable._iActivate(pass, camera);
	}

	public deactivatePass(renderable:RenderableBase, pass:RenderPassBase)
	{
		//deactivate shader object
		renderable._iDeactivate(pass);

		this._numUsedStreams = pass.shader.numUsedStreams;
		this._numUsedTextures = pass.shader.numUsedTextures;
	}

	public _iCreateEntityCollector():CollectorBase
	{
		return new EntityCollector();
	}

	/**
	 * The background color's red component, used when clearing.
	 *
	 * @private
	 */
	public get _iBackgroundR():number
	{
		return this._backgroundR;
	}

	public set _iBackgroundR(value:number)
	{
		if (this._backgroundR == value)
			return;

		this._backgroundR = value;

		this._pBackBufferInvalid = true;
	}

	/**
	 * The background color's green component, used when clearing.
	 *
	 * @private
	 */
	public get _iBackgroundG():number
	{
		return this._backgroundG;
	}

	public set _iBackgroundG(value:number)
	{
		if (this._backgroundG == value)
			return;

		this._backgroundG = value;

		this._pBackBufferInvalid = true;
	}

	/**
	 * The background color's blue component, used when clearing.
	 *
	 * @private
	 */
	public get _iBackgroundB():number
	{
		return this._backgroundB;
	}

	public set _iBackgroundB(value:number)
	{
		if (this._backgroundB == value)
			return;

		this._backgroundB = value;

		this._pBackBufferInvalid = true;
	}

	public get context():IContextGL
	{
		return this._pContext;
	}

	/**
	 * The Stage that will provide the ContextGL used for rendering.
	 */
	public get stage():Stage
	{
		return this._pStage;
	}

	public set stage(value:Stage)
	{
		if (this._pStage == value)
			return;

		this.iSetStage(value);
	}

	public iSetStage(value:Stage)
	{
		if (this._pStage)
			this.dispose();

		if (value) {
			this._pStage = value;

			this._rendererPool.stage = this._pStage;

			this._pStage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
			this._pStage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
			this._pStage.addEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);

			/*
			 if (_backgroundImageRenderer)
			 _backgroundImageRenderer.stage = value;
			 */
			if (this._pStage.context)
				this._pContext = <IContextGL> this._pStage.context;
		}

		this._pBackBufferInvalid = true;

		this.updateGlobalPos();
	}

	/**
	 * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
	 * to share the same ContextGL object.
	 */
	public get shareContext():boolean
	{
		return this._shareContext;
	}

	public set shareContext(value:boolean)
	{
		if (this._shareContext == value)
			return;

		this._shareContext = value;

		this.updateGlobalPos();
	}

	/**
	 * Disposes the resources used by the RendererBase.
	 */
	public dispose()
	{
		this._rendererPool.dispose();

		this._pStage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._pStage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._pStage.removeEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);

		this._pStage = null;
		this._pContext = null;
		/*
		 if (_backgroundImageRenderer) {
		 _backgroundImageRenderer.dispose();
		 _backgroundImageRenderer = null;
		 }
		 */
	}

	public render(entityCollector:CollectorBase)
	{
		this._viewportDirty = false;
		this._scissorDirty = false;
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture.
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public _iRender(entityCollector:CollectorBase, target:TextureBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		//TODO refactor setTarget so that rendertextures are created before this check
		if (!this._pStage || !this._pContext)
			return;

		this._pRttViewProjectionMatrix.copyFrom(entityCollector.camera.viewProjection);
		this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		this.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);

		// generate mip maps on target (if target exists) //TODO
		//if (target)
		//	(<Texture>target).generateMipmaps();

		// clear buffers
		for (var i:number = 0; i < 8; ++i) {
			this._pContext.setVertexBufferAt(i, null);
			this._pContext.setTextureAt(i, null);
		}
	}

	public _iRenderCascades(entityCollector:ShadowCasterCollector, target:TextureBase, numCascades:number, scissorRects:Array<Rectangle>, cameras:Array<Camera>)
	{
		this.pCollectRenderables(entityCollector);

		this._pStage.setRenderTarget(target, true, 0);
		this._pContext.clear(1, 1, 1, 1, 1, 0);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

		var head:RenderableBase = this._pOpaqueRenderableHead;

		var first:boolean = true;

		//TODO cascades must have separate collectors, rather than separate draw commands
		for (var i:number = numCascades - 1; i >= 0; --i) {
			this._pStage.scissorRect = scissorRects[i];
			//this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
			first = false;
		}

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);

		this._pStage.scissorRect = null;
	}

	public pCollectRenderables(entityCollector:CollectorBase)
	{
		//reset head values
		this._pBlendedRenderableHead = null;
		this._pOpaqueRenderableHead = null;
		this._pNumTriangles = 0;

		//grab entity head
		var item:EntityListItem = entityCollector.entityHead;

		//set temp values for entry point and camera forward vector
		this._pCamera = entityCollector.camera;
		this._iEntryPoint = this._pCamera.scenePosition;
		this._pCameraForward = this._pCamera.transform.forwardVector;

		//iterate through all entities
		while (item) {
			item.entity._iCollectRenderables(this._rendererPool);
			item = item.next;
		}

		//sort the resulting renderables
		this._pOpaqueRenderableHead = <RenderableBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
		this._pBlendedRenderableHead = <RenderableBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	 *
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public pExecuteRender(entityCollector:CollectorBase, target:TextureBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		this._pStage.setRenderTarget(target, true, surfaceSelector);

		if ((target || !this._shareContext) && !this._depthPrepass)
			this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);

		this._pStage.scissorRect = scissorRect;

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */
		this.pCollectRenderables(entityCollector);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		this.pDraw(entityCollector);

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (!this._shareContext) {
			if (this._snapshotRequired && this._snapshotBitmapData) {
				this._pContext.drawToBitmapData(this._snapshotBitmapData);
				this._snapshotRequired = false;
			}
		}

		this._pStage.scissorRect = null;
	}

	/*
	 * Will draw the renderer's output on next render to the provided bitmap data.
	 * */
	public queueSnapshot(bmd:BitmapData)
	{
		this._snapshotRequired = true;
		this._snapshotBitmapData = bmd;
	}

	/**
	 * Performs the actual drawing of geometry to the target.
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 */
	public pDraw(entityCollector:CollectorBase)
	{
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		if (this._disableColor)
			this._pContext.setColorMask(false, false, false, false);

		this.drawRenderables(this._pOpaqueRenderableHead, entityCollector);

		if (this._renderBlended)
			this.drawRenderables(this._pBlendedRenderableHead, entityCollector);

		if (this._disableColor)
			this._pContext.setColorMask(true, true, true, true);
	}

	//private drawCascadeRenderables(renderable:RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
	//{
	//	var renderable2:RenderableBase;
	//	var renderObject:RenderObjectBase;
	//	var pass:RenderPassBase;
	//
	//	while (renderable) {
	//		renderable2 = renderable;
	//		renderObject = renderable.renderObject;
	//		pass = renderObject.passes[0] //assuming only one pass per material
	//
	//		this.activatePass(renderable, pass, camera);
	//
	//		do {
	//			// if completely in front, it will fall in a different cascade
	//			// do not use near and far planes
	//			if (!cullPlanes || renderable2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
	//				renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
	//			} else {
	//				renderable2.cascaded = true;
	//			}
	//
	//			renderable2 = renderable2.next;
	//
	//		} while (renderable2 && renderable2.renderObject == renderObject && !renderable2.cascaded);
	//
	//		this.deactivatePass(renderable, pass);
	//
	//		renderable = renderable2;
	//	}
	//}

	/**
	 * Draw a list of renderables.
	 *
	 * @param renderables The renderables to draw.
	 * @param entityCollector The EntityCollector containing all potentially visible information.
	 */
	public drawRenderables(renderable:RenderableBase, entityCollector:CollectorBase)
	{
		var i:number;
		var len:number;
		var renderable2:RenderableBase;
		var renderObject:RenderObjectBase;
		var passes:Array<RenderPassBase>;
		var pass:RenderPassBase;
		var camera:Camera = entityCollector.camera;


		while (renderable) {
			renderObject = renderable.renderObject;
			passes = renderObject.passes;

			// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
			if (this._disableColor && renderObject._renderObjectOwner.alphaThreshold != 0) {
				renderable2 = renderable;
				// fast forward
				do {
					renderable2 = renderable2.next;

				} while (renderable2 && renderable2.renderObject == renderObject);
			} else {
				//iterate through each shader object
				len = passes.length;
				for (i = 0; i < len; i++) {
					renderable2 = renderable;
					pass = passes[i];

					this.activatePass(renderable, pass, camera);

					do {
						renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);

						renderable2 = renderable2.next;

					} while (renderable2 && renderable2.renderObject == renderObject);

					this.deactivatePass(renderable, pass);
				}
			}

			renderable = renderable2;
		}
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event:Event)
	{
		this._pContext = <IContextGL> this._pStage.context;
	}

	public get _iBackgroundAlpha():number
	{
		return this._backgroundAlpha;
	}

	public set _iBackgroundAlpha(value:number)
	{
		if (this._backgroundAlpha == value)
			return;

		this._backgroundAlpha = value;

		this._pBackBufferInvalid = true;
	}

	/*
	 public get iBackground():Texture2DBase
	 {
	 return this._background;
	 }
	 */

	/*
	 public set iBackground(value:Texture2DBase)
	 {
	 if (this._backgroundImageRenderer && !value) {
	 this._backgroundImageRenderer.dispose();
	 this._backgroundImageRenderer = null;
	 }

	 if (!this._backgroundImageRenderer && value)
	 {

	 this._backgroundImageRenderer = new BackgroundImageRenderer(this._pStage);

	 }


	 this._background = value;

	 if (this._backgroundImageRenderer)
	 this._backgroundImageRenderer.texture = value;
	 }
	 */
	/*
	 public get backgroundImageRenderer():BackgroundImageRenderer
	 {
	 return _backgroundImageRenderer;
	 }
	 */


	/**
	 * @private
	 */
	private notifyScissorUpdate()
	{
		if (this._scissorDirty)
			return;

		this._scissorDirty = true;

		if (!this._scissorUpdated)
			this._scissorUpdated = new RendererEvent(RendererEvent.SCISSOR_UPDATED);

		this.dispatchEvent(this._scissorUpdated);
	}


	/**
	 * @private
	 */
	private notifyViewportUpdate()
	{
		if (this._viewportDirty)
			return;

		this._viewportDirty = true;

		if (!this._viewPortUpdated)
			this._viewPortUpdated = new RendererEvent(RendererEvent.VIEWPORT_UPDATED);

		this.dispatchEvent(this._viewPortUpdated);
	}

	/**
	 *
	 */
	public onViewportUpdated(event:StageEvent)
	{
		this._viewPort = this._pStage.viewPort;
		//TODO stop firing viewport updated for every stagegl viewport change

		if (this._shareContext) {
			this._pScissorRect.x = this._globalPos.x - this._pStage.x;
			this._pScissorRect.y = this._globalPos.y - this._pStage.y;
			this.notifyScissorUpdate();
		}

		this.notifyViewportUpdate();
	}

	/**
	 *
	 */
	public updateGlobalPos()
	{
		if (this._shareContext) {
			this._pScissorRect.x = this._globalPos.x - this._viewPort.x;
			this._pScissorRect.y = this._globalPos.y - this._viewPort.y;
		} else {
			this._pScissorRect.x = 0;
			this._pScissorRect.y = 0;
			this._viewPort.x = this._globalPos.x;
			this._viewPort.y = this._globalPos.y;
		}

		this.notifyScissorUpdate();
	}

	/**
	 *
	 * @param renderable
	 * @protected
	 */
	public applyRenderable(renderable:RenderableBase)
	{
		//set local vars for faster referencing
		var renderObject:RenderObjectBase = this._pGetRenderObject(renderable, renderable.renderObjectOwner || DefaultMaterialManager.getDefaultMaterial(renderable.renderableOwner));

		renderable.renderObject = renderObject;
		renderable.renderObjectId = renderObject.renderObjectId;
		renderable.renderOrderId = renderObject.renderOrderId;

		renderable.cascaded = false;

		var entity:IEntity = renderable.sourceEntity;
		var position:Vector3D = entity.scenePosition;

		// project onto camera's z-axis
		position = this._iEntryPoint.subtract(position);
		renderable.zIndex = entity.zOffset + position.dotProduct(this._pCameraForward);

		//store reference to scene transform
		renderable.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._pCamera);

		if (renderObject.requiresBlending) {
			renderable.next = this._pBlendedRenderableHead;
			this._pBlendedRenderableHead = renderable;
		} else {
			renderable.next = this._pOpaqueRenderableHead;
			this._pOpaqueRenderableHead = renderable;
		}

		this._pNumTriangles += renderable.numTriangles;

		//handle any overflow for renderables with data that exceeds GPU limitations
		if (renderable.overflow)
			this.applyRenderable(renderable.overflow);
	}

	public _pGetRenderObject(renderable:RenderableBase, renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		throw new AbstractMethodError();
	}
}

export = RendererBase;