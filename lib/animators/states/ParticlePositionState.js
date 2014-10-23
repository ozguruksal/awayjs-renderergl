var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 * @author ...
 */
var ParticlePositionState = (function (_super) {
    __extends(ParticlePositionState, _super);
    function ParticlePositionState(animator, particlePositionNode) {
        _super.call(this, animator, particlePositionNode);
        this._particlePositionNode = particlePositionNode;
        this._position = this._particlePositionNode._iPosition;
    }
    Object.defineProperty(ParticlePositionState.prototype, "position", {
        /**
         * Defines the position of the particle when in global mode. Defaults to 0,0,0.
         */
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ParticlePositionState.prototype.getPositions = function () {
        return this._pDynamicProperties;
    };
    ParticlePositionState.prototype.setPositions = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    /**
     * @inheritDoc
     */
    ParticlePositionState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (this._particlePositionNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
            this._pUpdateDynamicProperties(animationSubGeometry);
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticlePositionState.POSITION_INDEX);
        if (this._particlePositionNode.mode == ParticlePropertiesMode.GLOBAL)
            animationRegisterCache.setVertexConst(index, this._position.x, this._position.y, this._position.z);
        else
            animationSubGeometry.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticlePositionState.POSITION_INDEX = 0;
    return ParticlePositionState;
})(ParticleStateBase);
module.exports = ParticlePositionState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL3BhcnRpY2xlcG9zaXRpb25zdGF0ZS50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZVBvc2l0aW9uU3RhdGUiLCJQYXJ0aWNsZVBvc2l0aW9uU3RhdGUuY29uc3RydWN0b3IiLCJQYXJ0aWNsZVBvc2l0aW9uU3RhdGUucG9zaXRpb24iLCJQYXJ0aWNsZVBvc2l0aW9uU3RhdGUuZ2V0UG9zaXRpb25zIiwiUGFydGljbGVQb3NpdGlvblN0YXRlLnNldFBvc2l0aW9ucyIsIlBhcnRpY2xlUG9zaXRpb25TdGF0ZS5zZXRSZW5kZXJTdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBT0EsSUFBTywyQkFBMkIsV0FBWSxxREFBcUQsQ0FBQyxDQUFDO0FBSXJHLElBQU8sc0JBQXNCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUV6RyxJQUFPLGlCQUFpQixXQUFjLDBEQUEwRCxDQUFDLENBQUM7QUFFbEcsQUFJQTs7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBMEJBO0lBb0NwREEsU0FwQ0tBLHFCQUFxQkEsQ0FvQ2RBLFFBQXlCQSxFQUFFQSxvQkFBeUNBO1FBRS9FQyxrQkFBTUEsUUFBUUEsRUFBRUEsb0JBQW9CQSxDQUFDQSxDQUFDQTtRQUV0Q0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxHQUFHQSxvQkFBb0JBLENBQUNBO1FBQ2xEQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLFVBQVVBLENBQUNBO0lBQ3hEQSxDQUFDQTtJQS9CREQsc0JBQVdBLDJDQUFRQTtRQUhuQkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZCQSxDQUFDQTthQUVERixVQUFvQkEsS0FBY0E7WUFFakNFLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3hCQSxDQUFDQTs7O09BTEFGO0lBT0RBOztPQUVHQTtJQUNJQSw0Q0FBWUEsR0FBbkJBO1FBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBRU1ILDRDQUFZQSxHQUFuQkEsVUFBb0JBLEtBQXFCQTtRQUV4Q0ksSUFBSUEsQ0FBQ0EsbUJBQW1CQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVqQ0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxHQUFHQSxJQUFJQSxNQUFNQSxFQUFFQSxDQUFDQTtJQUM5Q0EsQ0FBQ0E7SUFVREo7O09BRUdBO0lBQ0lBLDhDQUFjQSxHQUFyQkEsVUFBc0JBLEtBQVdBLEVBQUVBLFVBQXlCQSxFQUFFQSxvQkFBeUNBLEVBQUVBLHNCQUE2Q0EsRUFBRUEsTUFBYUE7UUFFcEtLLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsSUFBSUEsc0JBQXNCQSxDQUFDQSxhQUFhQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDOUlBLElBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxDQUFDQTtRQUV0REEsSUFBSUEsS0FBS0EsR0FBa0JBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxxQkFBcUJBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO1FBRS9IQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLElBQUlBLElBQUlBLHNCQUFzQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDcEVBLHNCQUFzQkEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDcEdBLElBQUlBO1lBQ0hBLG9CQUFvQkEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLFlBQVlBLEVBQUVBLEtBQUtBLEVBQUVBLDJCQUEyQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFDeElBLENBQUNBO0lBeERETCxlQUFlQTtJQUNEQSxvQ0FBY0EsR0FBbUJBLENBQUNBLENBQUNBO0lBd0RsREEsNEJBQUNBO0FBQURBLENBM0RBLEFBMkRDQSxFQTNEbUMsaUJBQWlCLEVBMkRwRDtBQUVELEFBQStCLGlCQUF0QixxQkFBcUIsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL1BhcnRpY2xlUG9zaXRpb25TdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBDb250ZXh0R0xWZXJ0ZXhCdWZmZXJGb3JtYXRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMVmVydGV4QnVmZmVyRm9ybWF0XCIpO1xuXG5pbXBvcnQgUGFydGljbGVBbmltYXRvclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0b3JcIik7XG5pbXBvcnQgQW5pbWF0aW9uU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25TdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc01vZGVcIik7XG5pbXBvcnQgUGFydGljbGVQb3NpdGlvbk5vZGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVQb3NpdGlvbk5vZGVcIik7XG5pbXBvcnQgUGFydGljbGVTdGF0ZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL1BhcnRpY2xlU3RhdGVCYXNlXCIpO1xuXG4vKipcbiAqIC4uLlxuICogQGF1dGhvciAuLi5cbiAqL1xuY2xhc3MgUGFydGljbGVQb3NpdGlvblN0YXRlIGV4dGVuZHMgUGFydGljbGVTdGF0ZUJhc2Vcbntcblx0LyoqIEBwcml2YXRlICovXG5cdHB1YmxpYyBzdGF0aWMgUE9TSVRJT05fSU5ERVg6bnVtYmVyIC8qdWludCovID0gMDtcblxuXHRwcml2YXRlIF9wYXJ0aWNsZVBvc2l0aW9uTm9kZTpQYXJ0aWNsZVBvc2l0aW9uTm9kZTtcblx0cHJpdmF0ZSBfcG9zaXRpb246VmVjdG9yM0Q7XG5cblx0LyoqXG5cdCAqIERlZmluZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwYXJ0aWNsZSB3aGVuIGluIGdsb2JhbCBtb2RlLiBEZWZhdWx0cyB0byAwLDAsMC5cblx0ICovXG5cdHB1YmxpYyBnZXQgcG9zaXRpb24oKTpWZWN0b3IzRFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuXHR9XG5cblx0cHVibGljIHNldCBwb3NpdGlvbih2YWx1ZTpWZWN0b3IzRClcblx0e1xuXHRcdHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXRQb3NpdGlvbnMoKTpBcnJheTxWZWN0b3IzRD5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wRHluYW1pY1Byb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgc2V0UG9zaXRpb25zKHZhbHVlOkFycmF5PFZlY3RvcjNEPilcblx0e1xuXHRcdHRoaXMuX3BEeW5hbWljUHJvcGVydGllcyA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcER5bmFtaWNQcm9wZXJ0aWVzRGlydHkgPSBuZXcgT2JqZWN0KCk7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpQYXJ0aWNsZUFuaW1hdG9yLCBwYXJ0aWNsZVBvc2l0aW9uTm9kZTpQYXJ0aWNsZVBvc2l0aW9uTm9kZSlcblx0e1xuXHRcdHN1cGVyKGFuaW1hdG9yLCBwYXJ0aWNsZVBvc2l0aW9uTm9kZSk7XG5cblx0XHR0aGlzLl9wYXJ0aWNsZVBvc2l0aW9uTm9kZSA9IHBhcnRpY2xlUG9zaXRpb25Ob2RlO1xuXHRcdHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5fcGFydGljbGVQb3NpdGlvbk5vZGUuX2lQb3NpdGlvbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHNldFJlbmRlclN0YXRlKHN0YWdlOlN0YWdlLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBhbmltYXRpb25TdWJHZW9tZXRyeTpBbmltYXRpb25TdWJHZW9tZXRyeSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlLCBjYW1lcmE6Q2FtZXJhKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BhcnRpY2xlUG9zaXRpb25Ob2RlLm1vZGUgPT0gUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5MT0NBTF9EWU5BTUlDICYmICF0aGlzLl9wRHluYW1pY1Byb3BlcnRpZXNEaXJ0eVthbmltYXRpb25TdWJHZW9tZXRyeS5faVVuaXF1ZUlkXSlcblx0XHRcdHRoaXMuX3BVcGRhdGVEeW5hbWljUHJvcGVydGllcyhhbmltYXRpb25TdWJHZW9tZXRyeSk7XG5cblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBhbmltYXRpb25SZWdpc3RlckNhY2hlLmdldFJlZ2lzdGVySW5kZXgodGhpcy5fcEFuaW1hdGlvbk5vZGUsIFBhcnRpY2xlUG9zaXRpb25TdGF0ZS5QT1NJVElPTl9JTkRFWCk7XG5cblx0XHRpZiAodGhpcy5fcGFydGljbGVQb3NpdGlvbk5vZGUubW9kZSA9PSBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlLkdMT0JBTClcblx0XHRcdGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc2V0VmVydGV4Q29uc3QoaW5kZXgsIHRoaXMuX3Bvc2l0aW9uLngsIHRoaXMuX3Bvc2l0aW9uLnksIHRoaXMuX3Bvc2l0aW9uLnopO1xuXHRcdGVsc2Vcblx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5LmFjdGl2YXRlVmVydGV4QnVmZmVyKGluZGV4LCB0aGlzLl9wYXJ0aWNsZVBvc2l0aW9uTm9kZS5faURhdGFPZmZzZXQsIHN0YWdlLCBDb250ZXh0R0xWZXJ0ZXhCdWZmZXJGb3JtYXQuRkxPQVRfMyk7XG5cdH1cbn1cblxuZXhwb3J0ID0gUGFydGljbGVQb3NpdGlvblN0YXRlOyJdfQ==