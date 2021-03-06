import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import AnimationNodeBase				= require("awayjs-display/lib/animators/nodes/AnimationNodeBase");

import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");
import IAnimationState					= require("awayjs-renderergl/lib/animators/states/IAnimationState");

import AnimationStateEvent				= require("awayjs-renderergl/lib/events/AnimationStateEvent");

/**
 *
 */
class AnimationStateBase implements IAnimationState
{
	public _pAnimationNode:AnimationNodeBase;
	public _pRootDelta:Vector3D = new Vector3D();
	public _pPositionDeltaDirty:boolean = true;

	public _pTime:number;
	public _pStartTime:number = 0;
	public _pAnimator:AnimatorBase;

	/**
	 * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
	 */
	public get positionDelta():Vector3D
	{
		if (this._pPositionDeltaDirty) {

			this._pUpdatePositionDelta();
		}

		return this._pRootDelta;

	}

	constructor(animator:AnimatorBase, animationNode:AnimationNodeBase)
	{
		this._pAnimator = animator;
		this._pAnimationNode = animationNode;
	}

	/**
	 * Resets the start time of the node to a  new value.
	 *
	 * @param startTime The absolute start time (in milliseconds) of the node's starting time.
	 */
	public offset(startTime:number)
	{
		this._pStartTime = startTime;

		this._pPositionDeltaDirty = true;
	}

	/**
	 * Updates the configuration of the node to its current state.
	 *
	 * @param time The absolute time (in milliseconds) of the animator's play head position.
	 *
	 * @see AnimatorBase#update()
	 */
	public update(time:number)
	{
		if (this._pTime == time - this._pStartTime) {

			return;

		}

		this._pUpdateTime(time);

	}

	/**
	 * Sets the animation phase of the node.
	 *
	 * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	 */
	public phase(value:number)
	{

	}

	/**
	 * Updates the node's internal playhead position.
	 *
	 * @param time The local time (in milliseconds) of the node's playhead position.
	 */
	public _pUpdateTime(time:number)
	{
		this._pTime = time - this._pStartTime;

		this._pPositionDeltaDirty = true;
	}

	/**
	 * Updates the node's root delta position
	 */
	public _pUpdatePositionDelta()
	{
	}
}

export = AnimationStateBase;