import AnimationNodeBase				= require("awayjs-display/lib/animators/nodes/AnimationNodeBase");

import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");

import SkeletonDirectionalState			= require("awayjs-renderergl/lib/animators/states/SkeletonDirectionalState");

/**
 * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
 */
class SkeletonDirectionalNode extends AnimationNodeBase
{
	/**
	 * Defines the forward configured input node to use for the blended output.
	 */
	public forward:AnimationNodeBase;

	/**
	 * Defines the backwards configured input node to use for the blended output.
	 */
	public backward:AnimationNodeBase;

	/**
	 * Defines the left configured input node to use for the blended output.
	 */
	public left:AnimationNodeBase;

	/**
	 * Defines the right configured input node to use for the blended output.
	 */
	public right:AnimationNodeBase;

	constructor()
	{
		super();

		this._pStateClass = SkeletonDirectionalState;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):SkeletonDirectionalState
	{
		return <SkeletonDirectionalState> animator.getAnimationState(this);
	}

}

export = SkeletonDirectionalNode;