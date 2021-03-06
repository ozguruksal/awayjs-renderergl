import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");
import SkeletonBinaryLERPNode			= require("awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode");
import SkeletonBinaryLERPState			= require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");
import CrossfadeTransitionNode			= require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode");
import AnimationStateEvent				= require("awayjs-renderergl/lib/events/AnimationStateEvent");

/**
 *
 */
class CrossfadeTransitionState extends SkeletonBinaryLERPState
{
	private _crossfadeTransitionNode:CrossfadeTransitionNode;
	private _animationStateTransitionComplete:AnimationStateEvent;

	constructor(animator:AnimatorBase, skeletonAnimationNode:CrossfadeTransitionNode)
	{
		super(animator, <SkeletonBinaryLERPNode> skeletonAnimationNode);

		this._crossfadeTransitionNode = skeletonAnimationNode;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateTime(time:number /*int*/)
	{
		this.blendWeight = Math.abs(time - this._crossfadeTransitionNode.startBlend)/(1000*this._crossfadeTransitionNode.blendSpeed);

		if (this.blendWeight >= 1) {
			this.blendWeight = 1;

			if (this._animationStateTransitionComplete == null)
				this._animationStateTransitionComplete = new AnimationStateEvent(AnimationStateEvent.TRANSITION_COMPLETE, this._pAnimator, this, this._crossfadeTransitionNode);

			this._crossfadeTransitionNode.dispatchEvent(this._animationStateTransitionComplete);
		}

		super._pUpdateTime(time);
	}
}

export = CrossfadeTransitionState;