var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonNaryLERPState = (function (_super) {
    __extends(SkeletonNaryLERPState, _super);
    function SkeletonNaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._blendWeights = new Array();
        this._inputs = new Array();
        this._skeletonAnimationNode = skeletonAnimationNode;
        var i = this._skeletonAnimationNode.numInputs;
        while (i--)
            this._inputs[i] = animator.getAnimationState(this._skeletonAnimationNode._iInputs[i]);
    }
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(value);
        }
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUdateTime = function (time /*int*/) {
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(time);
        }
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonNaryLERPState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node blend weight is requested.
     */
    SkeletonNaryLERPState.prototype.getBlendWeightAt = function (index /*uint*/) {
        return this._blendWeights[index];
    };
    /**
     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index on which the skeleton animation node blend weight is to be set.
     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
     */
    SkeletonNaryLERPState.prototype.setBlendWeightAt = function (index /*uint*/, blendWeight) {
        this._blendWeights[index] = blendWeight;
        this._pPositionDeltaDirty = true;
        this._skeletonPoseDirty = true;
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var delta;
        var weight;
        this.positionDelta.x = 0;
        this.positionDelta.y = 0;
        this.positionDelta.z = 0;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (weight) {
                delta = this._inputs[j].positionDelta;
                this.positionDelta.x += weight * delta.x;
                this.positionDelta.y += weight * delta.y;
                this.positionDelta.z += weight * delta.z;
            }
        }
    };
    /**
     * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonNaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var weight;
        var endPoses = this._skeletonPose.jointPoses;
        var poses;
        var endPose, pose;
        var endTr, tr;
        var endQuat, q;
        var firstPose;
        var i /*uint*/;
        var w0, x0, y0, z0;
        var w1, x1, y1, z1;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (!weight)
                continue;
            poses = this._inputs[j].getSkeletonPose(skeleton).jointPoses;
            if (!firstPose) {
                firstPose = poses;
                for (i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];
                    if (endPose == null)
                        endPose = endPoses[i] = new JointPose();
                    pose = poses[i];
                    q = pose.orientation;
                    tr = pose.translation;
                    endQuat = endPose.orientation;
                    endQuat.x = weight * q.x;
                    endQuat.y = weight * q.y;
                    endQuat.z = weight * q.z;
                    endQuat.w = weight * q.w;
                    endTr = endPose.translation;
                    endTr.x = weight * tr.x;
                    endTr.y = weight * tr.y;
                    endTr.z = weight * tr.z;
                }
            }
            else {
                for (i = 0; i < skeleton.numJoints; ++i) {
                    endPose = endPoses[i];
                    pose = poses[i];
                    q = firstPose[i].orientation;
                    x0 = q.x;
                    y0 = q.y;
                    z0 = q.z;
                    w0 = q.w;
                    q = pose.orientation;
                    tr = pose.translation;
                    x1 = q.x;
                    y1 = q.y;
                    z1 = q.z;
                    w1 = q.w;
                    // find shortest direction
                    if (x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1 < 0) {
                        x1 = -x1;
                        y1 = -y1;
                        z1 = -z1;
                        w1 = -w1;
                    }
                    endQuat = endPose.orientation;
                    endQuat.x += weight * x1;
                    endQuat.y += weight * y1;
                    endQuat.z += weight * z1;
                    endQuat.w += weight * w1;
                    endTr = endPose.translation;
                    endTr.x += weight * tr.x;
                    endTr.y += weight * tr.y;
                    endTr.z += weight * tr.z;
                }
            }
        }
        for (i = 0; i < skeleton.numJoints; ++i)
            endPoses[i].orientation.normalize();
    };
    return SkeletonNaryLERPState;
})(AnimationStateBase);
module.exports = SkeletonNaryLERPState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL3NrZWxldG9ubmFyeWxlcnBzdGF0ZS50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbk5hcnlMRVJQU3RhdGUiLCJTa2VsZXRvbk5hcnlMRVJQU3RhdGUuY29uc3RydWN0b3IiLCJTa2VsZXRvbk5hcnlMRVJQU3RhdGUucGhhc2UiLCJTa2VsZXRvbk5hcnlMRVJQU3RhdGUuX3BVZGF0ZVRpbWUiLCJTa2VsZXRvbk5hcnlMRVJQU3RhdGUuZ2V0U2tlbGV0b25Qb3NlIiwiU2tlbGV0b25OYXJ5TEVSUFN0YXRlLmdldEJsZW5kV2VpZ2h0QXQiLCJTa2VsZXRvbk5hcnlMRVJQU3RhdGUuc2V0QmxlbmRXZWlnaHRBdCIsIlNrZWxldG9uTmFyeUxFUlBTdGF0ZS5fcFVwZGF0ZVBvc2l0aW9uRGVsdGEiLCJTa2VsZXRvbk5hcnlMRVJQU3RhdGUudXBkYXRlU2tlbGV0b25Qb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQSxJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUVsRixJQUFPLFlBQVksV0FBZ0IsbURBQW1ELENBQUMsQ0FBQztBQUV4RixJQUFPLGtCQUFrQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFHcEcsQUFHQTs7R0FERztJQUNHLHFCQUFxQjtJQUFTQSxVQUE5QkEscUJBQXFCQSxVQUEyQkE7SUFRckRBLFNBUktBLHFCQUFxQkEsQ0FRZEEsUUFBcUJBLEVBQUVBLHFCQUEwQ0E7UUFFNUVDLGtCQUFNQSxRQUFRQSxFQUFFQSxxQkFBcUJBLENBQUNBLENBQUNBO1FBUGhDQSxrQkFBYUEsR0FBZ0JBLElBQUlBLFlBQVlBLEVBQUVBLENBQUNBO1FBQ2hEQSx1QkFBa0JBLEdBQVdBLElBQUlBLENBQUNBO1FBQ2xDQSxrQkFBYUEsR0FBaUJBLElBQUlBLEtBQUtBLEVBQVVBLENBQUNBO1FBQ2xEQSxZQUFPQSxHQUFrQ0EsSUFBSUEsS0FBS0EsRUFBMkJBLENBQUNBO1FBTXJGQSxJ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T0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7b0JBQzVCQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxHQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDdEJBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLEdBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUN0QkEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsR0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZCQSxDQUFDQTtZQUNGQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7b0JBQ3pDQSxPQUFPQSxHQUFHQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDdEJBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUVoQkEsQ0FBQ0EsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7b0JBQzdCQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDVEEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1RBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFFVEEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7b0JBQ3JCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFFdEJBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDVEEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1RBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxBQUNBQSwwQkFEMEJBO29CQUMxQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3ZDQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDVEEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ1RBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBO3dCQUNUQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQTtvQkFDVkEsQ0FBQ0E7b0JBQ0RBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBO29CQUM5QkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7b0JBQ3ZCQSxPQUFPQSxDQUFDQSxDQUFDQSxJQUFJQSxNQUFNQSxHQUFDQSxFQUFFQSxDQUFDQTtvQkFDdkJBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLE1BQU1BLEdBQUNBLEVBQUVBLENBQUNBO29CQUN2QkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7b0JBRXZCQSxLQUFLQSxHQUFHQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFDNUJBLEtBQUtBLENBQUNBLENBQUNBLElBQUlBLE1BQU1BLEdBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUN2QkEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsR0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxLQUFLQSxDQUFDQSxDQUFDQSxJQUFJQSxNQUFNQSxHQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeEJBLENBQUNBO1lBQ0ZBLENBQUNBO1FBQ0ZBLENBQUNBO1FBRURBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3RDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtJQUN0Q0EsQ0FBQ0E7SUFDRlIsNEJBQUNBO0FBQURBLENBaE5BLEFBZ05DQSxFQWhObUMsa0JBQWtCLEVBZ05yRDtBQUVELEFBQStCLGlCQUF0QixxQkFBcUIsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL1NrZWxldG9uTmFyeUxFUlBTdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUXVhdGVybmlvblx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1F1YXRlcm5pb25cIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5cbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25cIik7XG5pbXBvcnQgU2tlbGV0b25Qb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uUG9zZVwiKTtcbmltcG9ydCBTa2VsZXRvbk5hcnlMRVJQTm9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9Ta2VsZXRvbk5hcnlMRVJQTm9kZVwiKTtcbmltcG9ydCBBbmltYXRpb25TdGF0ZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0FuaW1hdGlvblN0YXRlQmFzZVwiKTtcbmltcG9ydCBJU2tlbGV0b25BbmltYXRpb25TdGF0ZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0lTa2VsZXRvbkFuaW1hdGlvblN0YXRlXCIpO1xuXG4vKipcbiAqXG4gKi9cbmNsYXNzIFNrZWxldG9uTmFyeUxFUlBTdGF0ZSBleHRlbmRzIEFuaW1hdGlvblN0YXRlQmFzZSBpbXBsZW1lbnRzIElTa2VsZXRvbkFuaW1hdGlvblN0YXRlXG57XG5cdHByaXZhdGUgX3NrZWxldG9uQW5pbWF0aW9uTm9kZTpTa2VsZXRvbk5hcnlMRVJQTm9kZTtcblx0cHJpdmF0ZSBfc2tlbGV0b25Qb3NlOlNrZWxldG9uUG9zZSA9IG5ldyBTa2VsZXRvblBvc2UoKTtcblx0cHJpdmF0ZSBfc2tlbGV0b25Qb3NlRGlydHk6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX2JsZW5kV2VpZ2h0czpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0cHJpdmF0ZSBfaW5wdXRzOkFycmF5PElTa2VsZXRvbkFuaW1hdGlvblN0YXRlPiA9IG5ldyBBcnJheTxJU2tlbGV0b25BbmltYXRpb25TdGF0ZT4oKTtcblxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpBbmltYXRvckJhc2UsIHNrZWxldG9uQW5pbWF0aW9uTm9kZTpTa2VsZXRvbk5hcnlMRVJQTm9kZSlcblx0e1xuXHRcdHN1cGVyKGFuaW1hdG9yLCBza2VsZXRvbkFuaW1hdGlvbk5vZGUpO1xuXG5cdFx0dGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlID0gc2tlbGV0b25BbmltYXRpb25Ob2RlO1xuXG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovID0gdGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLm51bUlucHV0cztcblxuXHRcdHdoaWxlIChpLS0pXG5cdFx0XHR0aGlzLl9pbnB1dHNbaV0gPSA8SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU+IGFuaW1hdG9yLmdldEFuaW1hdGlvblN0YXRlKHRoaXMuX3NrZWxldG9uQW5pbWF0aW9uTm9kZS5faUlucHV0c1tpXSk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBwaGFzZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9za2VsZXRvblBvc2VEaXJ0eSA9IHRydWU7XG5cblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gdHJ1ZTtcblxuXHRcdGZvciAodmFyIGo6bnVtYmVyIC8qdWludCovID0gMDsgaiA8IHRoaXMuX3NrZWxldG9uQW5pbWF0aW9uTm9kZS5udW1JbnB1dHM7ICsraikge1xuXHRcdFx0aWYgKHRoaXMuX2JsZW5kV2VpZ2h0c1tqXSlcblx0XHRcdFx0dGhpcy5faW5wdXRzW2pdLnVwZGF0ZSh2YWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVZGF0ZVRpbWUodGltZTpudW1iZXIgLyppbnQqLylcblx0e1xuXHRcdGZvciAodmFyIGo6bnVtYmVyIC8qdWludCovID0gMDsgaiA8IHRoaXMuX3NrZWxldG9uQW5pbWF0aW9uTm9kZS5udW1JbnB1dHM7ICsraikge1xuXHRcdFx0aWYgKHRoaXMuX2JsZW5kV2VpZ2h0c1tqXSlcblx0XHRcdFx0dGhpcy5faW5wdXRzW2pdLnVwZGF0ZSh0aW1lKTtcblx0XHR9XG5cblx0XHRzdXBlci5fcFVwZGF0ZVRpbWUodGltZSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgY3VycmVudCBza2VsZXRvbiBwb3NlIG9mIHRoZSBhbmltYXRpb24gaW4gdGhlIGNsaXAgYmFzZWQgb24gdGhlIGludGVybmFsIHBsYXloZWFkIHBvc2l0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldFNrZWxldG9uUG9zZShza2VsZXRvbjpTa2VsZXRvbik6U2tlbGV0b25Qb3NlXG5cdHtcblx0XHRpZiAodGhpcy5fc2tlbGV0b25Qb3NlRGlydHkpXG5cdFx0XHR0aGlzLnVwZGF0ZVNrZWxldG9uUG9zZShza2VsZXRvbik7XG5cblx0XHRyZXR1cm4gdGhpcy5fc2tlbGV0b25Qb3NlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGJsZW5kIHdlaWdodCBvZiB0aGUgc2tlbGV0b24gYW5pYW10aW9uIG5vZGUgdGhhdCByZXNpZGVzIGF0IHRoZSBnaXZlbiBpbnB1dCBpbmRleC5cblx0ICpcblx0ICogQHBhcmFtIGluZGV4IFRoZSBpbnB1dCBpbmRleCBmb3Igd2hpY2ggdGhlIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIGJsZW5kIHdlaWdodCBpcyByZXF1ZXN0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QmxlbmRXZWlnaHRBdChpbmRleDpudW1iZXIgLyp1aW50Ki8pOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JsZW5kV2VpZ2h0c1tpbmRleF07XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgYmxlbmQgd2VpZ2h0IG9mIHRoZSBza2VsZXRvbiBhbmlhbXRpb24gbm9kZSB0aGF0IHJlc2lkZXMgYXQgdGhlIGdpdmVuIGlucHV0IGluZGV4LlxuXHQgKlxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGlucHV0IGluZGV4IG9uIHdoaWNoIHRoZSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBibGVuZCB3ZWlnaHQgaXMgdG8gYmUgc2V0LlxuXHQgKiBAcGFyYW0gYmxlbmRXZWlnaHQgVGhlIGJsZW5kIHdlaWdodCB2YWx1ZSB0byB1c2UgZm9yIHRoZSBnaXZlbiBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBzZXRCbGVuZFdlaWdodEF0KGluZGV4Om51bWJlciAvKnVpbnQqLywgYmxlbmRXZWlnaHQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fYmxlbmRXZWlnaHRzW2luZGV4XSA9IGJsZW5kV2VpZ2h0O1xuXG5cdFx0dGhpcy5fcFBvc2l0aW9uRGVsdGFEaXJ0eSA9IHRydWU7XG5cdFx0dGhpcy5fc2tlbGV0b25Qb3NlRGlydHkgPSB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVQb3NpdGlvbkRlbHRhKClcblx0e1xuXHRcdHRoaXMuX3BQb3NpdGlvbkRlbHRhRGlydHkgPSBmYWxzZTtcblxuXHRcdHZhciBkZWx0YTpWZWN0b3IzRDtcblx0XHR2YXIgd2VpZ2h0Om51bWJlcjtcblxuXHRcdHRoaXMucG9zaXRpb25EZWx0YS54ID0gMDtcblx0XHR0aGlzLnBvc2l0aW9uRGVsdGEueSA9IDA7XG5cdFx0dGhpcy5wb3NpdGlvbkRlbHRhLnogPSAwO1xuXG5cdFx0Zm9yICh2YXIgajpudW1iZXIgLyp1aW50Ki8gPSAwOyBqIDwgdGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLm51bUlucHV0czsgKytqKSB7XG5cdFx0XHR3ZWlnaHQgPSB0aGlzLl9ibGVuZFdlaWdodHNbal07XG5cblx0XHRcdGlmICh3ZWlnaHQpIHtcblx0XHRcdFx0ZGVsdGEgPSB0aGlzLl9pbnB1dHNbal0ucG9zaXRpb25EZWx0YTtcblx0XHRcdFx0dGhpcy5wb3NpdGlvbkRlbHRhLnggKz0gd2VpZ2h0KmRlbHRhLng7XG5cdFx0XHRcdHRoaXMucG9zaXRpb25EZWx0YS55ICs9IHdlaWdodCpkZWx0YS55O1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uRGVsdGEueiArPSB3ZWlnaHQqZGVsdGEuejtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgb3V0cHV0IHNrZWxldG9uIHBvc2Ugb2YgdGhlIG5vZGUgYmFzZWQgb24gdGhlIGJsZW5kIHdlaWdodCB2YWx1ZXMgZ2l2ZW4gdG8gdGhlIGlucHV0IG5vZGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0gc2tlbGV0b24gVGhlIHNrZWxldG9uIHVzZWQgYnkgdGhlIGFuaW1hdG9yIHJlcXVlc3RpbmcgdGhlIG91cHV0IHBvc2UuXG5cdCAqL1xuXHRwcml2YXRlIHVwZGF0ZVNrZWxldG9uUG9zZShza2VsZXRvbjpTa2VsZXRvbilcblx0e1xuXHRcdHRoaXMuX3NrZWxldG9uUG9zZURpcnR5ID0gZmFsc2U7XG5cblx0XHR2YXIgd2VpZ2h0Om51bWJlcjtcblx0XHR2YXIgZW5kUG9zZXM6QXJyYXk8Sm9pbnRQb3NlPiA9IHRoaXMuX3NrZWxldG9uUG9zZS5qb2ludFBvc2VzO1xuXHRcdHZhciBwb3NlczpBcnJheTxKb2ludFBvc2U+O1xuXHRcdHZhciBlbmRQb3NlOkpvaW50UG9zZSwgcG9zZTpKb2ludFBvc2U7XG5cdFx0dmFyIGVuZFRyOlZlY3RvcjNELCB0cjpWZWN0b3IzRDtcblx0XHR2YXIgZW5kUXVhdDpRdWF0ZXJuaW9uLCBxOlF1YXRlcm5pb247XG5cdFx0dmFyIGZpcnN0UG9zZTpBcnJheTxKb2ludFBvc2U+O1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgdzA6bnVtYmVyLCB4MDpudW1iZXIsIHkwOm51bWJlciwgejA6bnVtYmVyO1xuXHRcdHZhciB3MTpudW1iZXIsIHgxOm51bWJlciwgeTE6bnVtYmVyLCB6MTpudW1iZXI7XG5cdFx0dmFyIG51bUpvaW50czpudW1iZXIgLyp1aW50Ki8gPSBza2VsZXRvbi5udW1Kb2ludHM7XG5cblx0XHQvLyA6c1xuXHRcdGlmIChlbmRQb3Nlcy5sZW5ndGggIT0gbnVtSm9pbnRzKVxuXHRcdFx0ZW5kUG9zZXMubGVuZ3RoID0gbnVtSm9pbnRzO1xuXG5cdFx0Zm9yICh2YXIgajpudW1iZXIgLyp1aW50Ki8gPSAwOyBqIDwgdGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLm51bUlucHV0czsgKytqKSB7XG5cdFx0XHR3ZWlnaHQgPSB0aGlzLl9ibGVuZFdlaWdodHNbal07XG5cblx0XHRcdGlmICghd2VpZ2h0KVxuXHRcdFx0XHRjb250aW51ZTtcblxuXHRcdFx0cG9zZXMgPSB0aGlzLl9pbnB1dHNbal0uZ2V0U2tlbGV0b25Qb3NlKHNrZWxldG9uKS5qb2ludFBvc2VzO1xuXG5cdFx0XHRpZiAoIWZpcnN0UG9zZSkge1xuXHRcdFx0XHRmaXJzdFBvc2UgPSBwb3Nlcztcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG51bUpvaW50czsgKytpKSB7XG5cdFx0XHRcdFx0ZW5kUG9zZSA9IGVuZFBvc2VzW2ldO1xuXG5cdFx0XHRcdFx0aWYgKGVuZFBvc2UgPT0gbnVsbClcblx0XHRcdFx0XHRcdGVuZFBvc2UgPSBlbmRQb3Nlc1tpXSA9IG5ldyBKb2ludFBvc2UoKTtcblxuXHRcdFx0XHRcdHBvc2UgPSBwb3Nlc1tpXTtcblx0XHRcdFx0XHRxID0gcG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdFx0XHR0ciA9IHBvc2UudHJhbnNsYXRpb247XG5cblx0XHRcdFx0XHRlbmRRdWF0ID0gZW5kUG9zZS5vcmllbnRhdGlvbjtcblxuXHRcdFx0XHRcdGVuZFF1YXQueCA9IHdlaWdodCpxLng7XG5cdFx0XHRcdFx0ZW5kUXVhdC55ID0gd2VpZ2h0KnEueTtcblx0XHRcdFx0XHRlbmRRdWF0LnogPSB3ZWlnaHQqcS56O1xuXHRcdFx0XHRcdGVuZFF1YXQudyA9IHdlaWdodCpxLnc7XG5cblx0XHRcdFx0XHRlbmRUciA9IGVuZFBvc2UudHJhbnNsYXRpb247XG5cdFx0XHRcdFx0ZW5kVHIueCA9IHdlaWdodCp0ci54O1xuXHRcdFx0XHRcdGVuZFRyLnkgPSB3ZWlnaHQqdHIueTtcblx0XHRcdFx0XHRlbmRUci56ID0gd2VpZ2h0KnRyLno7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBza2VsZXRvbi5udW1Kb2ludHM7ICsraSkge1xuXHRcdFx0XHRcdGVuZFBvc2UgPSBlbmRQb3Nlc1tpXTtcblx0XHRcdFx0XHRwb3NlID0gcG9zZXNbaV07XG5cblx0XHRcdFx0XHRxID0gZmlyc3RQb3NlW2ldLm9yaWVudGF0aW9uO1xuXHRcdFx0XHRcdHgwID0gcS54O1xuXHRcdFx0XHRcdHkwID0gcS55O1xuXHRcdFx0XHRcdHowID0gcS56O1xuXHRcdFx0XHRcdHcwID0gcS53O1xuXG5cdFx0XHRcdFx0cSA9IHBvc2Uub3JpZW50YXRpb247XG5cdFx0XHRcdFx0dHIgPSBwb3NlLnRyYW5zbGF0aW9uO1xuXG5cdFx0XHRcdFx0eDEgPSBxLng7XG5cdFx0XHRcdFx0eTEgPSBxLnk7XG5cdFx0XHRcdFx0ejEgPSBxLno7XG5cdFx0XHRcdFx0dzEgPSBxLnc7XG5cdFx0XHRcdFx0Ly8gZmluZCBzaG9ydGVzdCBkaXJlY3Rpb25cblx0XHRcdFx0XHRpZiAoeDAqeDEgKyB5MCp5MSArIHowKnoxICsgdzAqdzEgPCAwKSB7XG5cdFx0XHRcdFx0XHR4MSA9IC14MTtcblx0XHRcdFx0XHRcdHkxID0gLXkxO1xuXHRcdFx0XHRcdFx0ejEgPSAtejE7XG5cdFx0XHRcdFx0XHR3MSA9IC13MTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZW5kUXVhdCA9IGVuZFBvc2Uub3JpZW50YXRpb247XG5cdFx0XHRcdFx0ZW5kUXVhdC54ICs9IHdlaWdodCp4MTtcblx0XHRcdFx0XHRlbmRRdWF0LnkgKz0gd2VpZ2h0KnkxO1xuXHRcdFx0XHRcdGVuZFF1YXQueiArPSB3ZWlnaHQqejE7XG5cdFx0XHRcdFx0ZW5kUXVhdC53ICs9IHdlaWdodCp3MTtcblxuXHRcdFx0XHRcdGVuZFRyID0gZW5kUG9zZS50cmFuc2xhdGlvbjtcblx0XHRcdFx0XHRlbmRUci54ICs9IHdlaWdodCp0ci54O1xuXHRcdFx0XHRcdGVuZFRyLnkgKz0gd2VpZ2h0KnRyLnk7XG5cdFx0XHRcdFx0ZW5kVHIueiArPSB3ZWlnaHQqdHIuejtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDA7IGkgPCBza2VsZXRvbi5udW1Kb2ludHM7ICsraSlcblx0XHRcdGVuZFBvc2VzW2ldLm9yaWVudGF0aW9uLm5vcm1hbGl6ZSgpO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uTmFyeUxFUlBTdGF0ZTsiXX0=