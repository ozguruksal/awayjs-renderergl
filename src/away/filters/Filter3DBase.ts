///<reference path="../_definitions.ts"/>

module away.filters
{

	export class Filter3DBase
	{
		private _tasks:away.filters.Filter3DTaskBase[];//Vector.<Filter3DTaskBase>;
		private _requireDepthRender:boolean;
		private _textureWidth:number;
		private _textureHeight:number;

		constructor()
		{
			this._tasks = new Array<away.filters.Filter3DTaskBase>();
		}

		public get requireDepthRender():boolean
		{
			return this._requireDepthRender;
		}

		public pAddTask(filter:Filter3DTaskBase)
		{
			this._tasks.push(filter);

			if (this._requireDepthRender == null) {

				this._requireDepthRender = filter.requireDepthRender;

			}

		}

		public get tasks():away.filters.Filter3DTaskBase[]
		{

			return this._tasks;

		}

		public getMainInputTexture(stageGL:away.base.StageGL):away.gl.Texture
		{

			return this._tasks[0].getMainInputTexture(stageGL);

		}

		public get textureWidth():number
		{
			return this._textureWidth;
		}

		public set textureWidth(value:number)
		{
			this._textureWidth = value;

			for (var i:number = 0; i < this._tasks.length; ++i) {

				this._tasks[i].textureWidth = value;

			}

		}

		public get textureHeight():number
		{

			return this._textureHeight;

		}

		public set textureHeight(value:number)
		{
			this._textureHeight = value;

			for (var i:number = 0; i < this._tasks.length; ++i) {

				this._tasks[i].textureHeight = value;

			}

		}

		// link up the filters correctly with the next filter
		public setRenderTargets(mainTarget:away.gl.Texture, stageGL:away.base.StageGL)
		{

			this._tasks[this._tasks.length - 1].target = mainTarget;

		}

		public dispose()
		{

			for (var i:number = 0; i < this._tasks.length; ++i) {

				this._tasks[i].dispose();

			}

		}

		public update(stage:away.base.StageGL, camera:away.cameras.Camera3D)
		{

		}
	}
}
