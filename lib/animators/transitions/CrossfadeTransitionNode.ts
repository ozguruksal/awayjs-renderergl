import SkeletonBinaryLERPNode			= require("awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode");
import CrossfadeTransitionState			= require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState");

/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
class CrossfadeTransitionNode extends SkeletonBinaryLERPNode
{
	public blendSpeed:number;

	public startBlend:number /*int*/;

	/**
	 * Creates a new <code>CrossfadeTransitionNode</code> object.
	 */
	constructor()
	{
		super();

		this._pStateClass = CrossfadeTransitionState;
	}
}

export = CrossfadeTransitionNode;