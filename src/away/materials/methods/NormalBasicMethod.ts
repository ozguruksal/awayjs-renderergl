///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
	 */
	export class NormalBasicMethod extends ShadingMethodBase
	{
		private _texture:away.textures.Texture2DBase;
		private _useTexture:boolean;
		public _pNormalTextureRegister:ShaderRegisterElement;

		/**
		 * Creates a new NormalBasicMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			if (this._texture) {

				vo.needsUV = true;

			} else {

				vo.needsUV = false;

			}

			//vo.needsUV = Boolean(_texture);
		}

		/**
		 * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
		 */
		public get iTangentSpace():boolean
		{
			return true;
		}

		/**
		 * Indicates if the normal method output is not based on a texture (if not, it will usually always return true)
		 * Override if subclasses are different.
		 */
		public get iHasOutput():boolean
		{
			return this._useTexture;
		}

		/**
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{
			var s:any = method;
			var bnm:NormalBasicMethod = <NormalBasicMethod> method;

			if (bnm.normalMap != null)
				this.normalMap = bnm.normalMap;
		}

		/**
		 * The texture containing the normals per pixel.
		 */
		public get normalMap():away.textures.Texture2DBase
		{
			return this._texture;
		}

		public set normalMap(value:away.textures.Texture2DBase)
		{
			var b:boolean = ( value != null );

			if (b != this._useTexture || (value && this._texture && (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)))
				this.iInvalidateShaderProgram();

			this._useTexture = b;
			this._texture = value;

		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._pNormalTextureRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			if (this._texture)
				this._texture = null;
		}


		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			if (vo.texturesIndex >= 0) {
				stageGL.contextGL.setSamplerStateAt(vo.texturesIndex, vo.repeatTextures? away.stagegl.ContextGLWrapMode.REPEAT:away.stagegl.ContextGLWrapMode.CLAMP, vo.useSmoothTextures? away.stagegl.ContextGLTextureFilter.LINEAR:away.stagegl.ContextGLTextureFilter.NEAREST, vo.useMipmapping? away.stagegl.ContextGLMipFilter.MIPLINEAR:away.stagegl.ContextGLMipFilter.MIPNONE);
				this._texture.activateTextureForStage(vo.texturesIndex, stageGL);
			}
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			this._pNormalTextureRegister = regCache.getFreeTextureReg();

			vo.texturesIndex = this._pNormalTextureRegister.index;

			return this.pGetTex2DSampleCode(vo, targetReg, this._pNormalTextureRegister, this._texture) + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + this._sharedRegisters.commons + ".xxx\n" + "nrm " + targetReg + ".xyz, " + targetReg + "\n";

		}
	}
}
