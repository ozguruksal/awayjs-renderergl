var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodEvent = require("awayjs-stagegl/lib/events/ShadingMethodEvent");
var DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
/**
 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
var DiffuseCompositeMethod = (function (_super) {
    __extends(DiffuseCompositeMethod, _super);
    /**
     * Creates a new <code>DiffuseCompositeMethod</code> object.
     *
     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
     * @param baseMethod The base diffuse method on which this method's shading is based.
     */
    function DiffuseCompositeMethod(modulateMethod, baseMethod) {
        var _this = this;
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this);
        this._onShaderInvalidatedDelegate = function (event) { return _this.onShaderInvalidated(event); };
        this.pBaseMethod = baseMethod || new DiffuseBasicMethod();
        this.pBaseMethod._iModulateMethod = modulateMethod;
        this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
    }
    Object.defineProperty(DiffuseCompositeMethod.prototype, "baseMethod", {
        /**
         * The base diffuse method on which this method's shading is based.
         */
        get: function () {
            return this.pBaseMethod;
        },
        set: function (value) {
            if (this.pBaseMethod == value)
                return;
            this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.pBaseMethod = value;
            this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        this.pBaseMethod.iInitVO(shaderObject, methodVO);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        this.pBaseMethod.iInitConstants(shaderObject, methodVO);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.dispose = function () {
        this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
        this.pBaseMethod.dispose();
    };
    Object.defineProperty(DiffuseCompositeMethod.prototype, "texture", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.texture;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.texture = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCompositeMethod.prototype, "diffuseColor", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.diffuseColor;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.diffuseColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCompositeMethod.prototype, "ambientColor", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.ambientColor;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.ambientColor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerProbe(shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        this.pBaseMethod.iActivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
        this.pBaseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
        this.pBaseMethod.iDeactivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iReset = function () {
        this.pBaseMethod.iReset();
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this.pBaseMethod.iCleanCompilationData();
    };
    /**
     * Called when the base method's shader code is invalidated.
     */
    DiffuseCompositeMethod.prototype.onShaderInvalidated = function (event) {
        this.iInvalidateShaderProgram();
    };
    return DiffuseCompositeMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseCompositeMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9kaWZmdXNlY29tcG9zaXRlbWV0aG9kLnRzIl0sIm5hbWVzIjpbIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QiLCJEaWZmdXNlQ29tcG9zaXRlTWV0aG9kLmNvbnN0cnVjdG9yIiwiRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5iYXNlTWV0aG9kIiwiRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5pSW5pdFZPIiwiRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5pSW5pdENvbnN0YW50cyIsIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QuZGlzcG9zZSIsIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QudGV4dHVyZSIsIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QuZGlmZnVzZUNvbG9yIiwiRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5hbWJpZW50Q29sb3IiLCJEaWZmdXNlQ29tcG9zaXRlTWV0aG9kLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZSIsIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QuaUdldEZyYWdtZW50Q29kZVBlckxpZ2h0IiwiRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlUGVyUHJvYmUiLCJEaWZmdXNlQ29tcG9zaXRlTWV0aG9kLmlBY3RpdmF0ZSIsIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QuaVNldFJlbmRlclN0YXRlIiwiRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5pRGVhY3RpdmF0ZSIsIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QuaUdldFZlcnRleENvZGUiLCJEaWZmdXNlQ29tcG9zaXRlTWV0aG9kLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUiLCJEaWZmdXNlQ29tcG9zaXRlTWV0aG9kLmlSZXNldCIsIkRpZmZ1c2VDb21wb3NpdGVNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhIiwiRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5vblNoYWRlckludmFsaWRhdGVkIl0s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QTNCQSxVQUE0QkEsS0FBd0JBO1FBRW5EbUIsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxFQUFFQSxDQUFDQTtJQUNqQ0EsQ0FBQ0E7SUFDRm5CLDZCQUFDQTtBQUFEQSxDQWhOQSxBQWdOQ0EsRUFoTm9DLGtCQUFrQixFQWdOdEQ7QUFFRCxBQUFnQyxpQkFBdkIsc0JBQXNCLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBTaGFkaW5nTWV0aG9kRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9ldmVudHMvU2hhZGluZ01ldGhvZEV2ZW50XCIpO1xuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VCYXNpY01ldGhvZFwiKTtcblxuLyoqXG4gKiBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kIHByb3ZpZGVzIGEgYmFzZSBjbGFzcyBmb3IgZGlmZnVzZSBtZXRob2RzIHRoYXQgd3JhcCBhIGRpZmZ1c2UgbWV0aG9kIHRvIGFsdGVyIHRoZVxuICogY2FsY3VsYXRlZCBkaWZmdXNlIHJlZmxlY3Rpb24gc3RyZW5ndGguXG4gKi9cbmNsYXNzIERpZmZ1c2VDb21wb3NpdGVNZXRob2QgZXh0ZW5kcyBEaWZmdXNlQmFzaWNNZXRob2Rcbntcblx0cHVibGljIHBCYXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZDtcblxuXHRwcml2YXRlIF9vblNoYWRlckludmFsaWRhdGVkRGVsZWdhdGU6RnVuY3Rpb247XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+RGlmZnVzZUNvbXBvc2l0ZU1ldGhvZDwvY29kZT4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gbW9kdWxhdGVNZXRob2QgVGhlIG1ldGhvZCB3aGljaCB3aWxsIGFkZCB0aGUgY29kZSB0byBhbHRlciB0aGUgYmFzZSBtZXRob2QncyBzdHJlbmd0aC4gSXQgbmVlZHMgdG8gaGF2ZSB0aGUgc2lnbmF0dXJlIGNsYW1wRGlmZnVzZSh0OlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSk6c3RyaW5nLCBpbiB3aGljaCB0Lncgd2lsbCBjb250YWluIHRoZSBkaWZmdXNlIHN0cmVuZ3RoLlxuXHQgKiBAcGFyYW0gYmFzZU1ldGhvZCBUaGUgYmFzZSBkaWZmdXNlIG1ldGhvZCBvbiB3aGljaCB0aGlzIG1ldGhvZCdzIHNoYWRpbmcgaXMgYmFzZWQuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihtb2R1bGF0ZU1ldGhvZDooc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpID0+IHN0cmluZywgYmFzZU1ldGhvZDpEaWZmdXNlQmFzaWNNZXRob2QgPSBudWxsKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX29uU2hhZGVySW52YWxpZGF0ZWREZWxlZ2F0ZSA9IChldmVudDpTaGFkaW5nTWV0aG9kRXZlbnQpID0+IHRoaXMub25TaGFkZXJJbnZhbGlkYXRlZChldmVudCk7XG5cblx0XHR0aGlzLnBCYXNlTWV0aG9kID0gYmFzZU1ldGhvZCB8fCBuZXcgRGlmZnVzZUJhc2ljTWV0aG9kKCk7XG5cdFx0dGhpcy5wQmFzZU1ldGhvZC5faU1vZHVsYXRlTWV0aG9kID0gbW9kdWxhdGVNZXRob2Q7XG5cdFx0dGhpcy5wQmFzZU1ldGhvZC5hZGRFdmVudExpc3RlbmVyKFNoYWRpbmdNZXRob2RFdmVudC5TSEFERVJfSU5WQUxJREFURUQsIHRoaXMuX29uU2hhZGVySW52YWxpZGF0ZWREZWxlZ2F0ZSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJhc2UgZGlmZnVzZSBtZXRob2Qgb24gd2hpY2ggdGhpcyBtZXRob2QncyBzaGFkaW5nIGlzIGJhc2VkLlxuXHQgKi9cblx0cHVibGljIGdldCBiYXNlTWV0aG9kKCk6RGlmZnVzZUJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5wQmFzZU1ldGhvZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYmFzZU1ldGhvZCh2YWx1ZTpEaWZmdXNlQmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5wQmFzZU1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMucEJhc2VNZXRob2QucmVtb3ZlRXZlbnRMaXN0ZW5lcihTaGFkaW5nTWV0aG9kRXZlbnQuU0hBREVSX0lOVkFMSURBVEVELCB0aGlzLl9vblNoYWRlckludmFsaWRhdGVkRGVsZWdhdGUpO1xuXHRcdHRoaXMucEJhc2VNZXRob2QgPSB2YWx1ZTtcblx0XHR0aGlzLnBCYXNlTWV0aG9kLmFkZEV2ZW50TGlzdGVuZXIoU2hhZGluZ01ldGhvZEV2ZW50LlNIQURFUl9JTlZBTElEQVRFRCwgdGhpcy5fb25TaGFkZXJJbnZhbGlkYXRlZERlbGVnYXRlKTtcblx0XHR0aGlzLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0dGhpcy5wQmFzZU1ldGhvZC5pSW5pdFZPKHNoYWRlck9iamVjdCwgbWV0aG9kVk8pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdHRoaXMucEJhc2VNZXRob2QuaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHRoaXMucEJhc2VNZXRob2QucmVtb3ZlRXZlbnRMaXN0ZW5lcihTaGFkaW5nTWV0aG9kRXZlbnQuU0hBREVSX0lOVkFMSURBVEVELCB0aGlzLl9vblNoYWRlckludmFsaWRhdGVkRGVsZWdhdGUpO1xuXHRcdHRoaXMucEJhc2VNZXRob2QuZGlzcG9zZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHRleHR1cmUoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5wQmFzZU1ldGhvZC50ZXh0dXJlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgc2V0IHRleHR1cmUodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMucEJhc2VNZXRob2QudGV4dHVyZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpZmZ1c2VDb2xvcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMucEJhc2VNZXRob2QuZGlmZnVzZUNvbG9yO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgc2V0IGRpZmZ1c2VDb2xvcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLnBCYXNlTWV0aG9kLmRpZmZ1c2VDb2xvciA9IHZhbHVlO1xuXHR9XG5cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgYW1iaWVudENvbG9yKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5wQmFzZU1ldGhvZC5hbWJpZW50Q29sb3I7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBzZXQgYW1iaWVudENvbG9yKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMucEJhc2VNZXRob2QuYW1iaWVudENvbG9yID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLnBCYXNlTWV0aG9kLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZVBlckxpZ2h0KHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIGxpZ2h0RGlyUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgbGlnaHRDb2xSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gdGhpcy5wQmFzZU1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlUGVyTGlnaHQoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgbGlnaHREaXJSZWcsIGxpZ2h0Q29sUmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHRcdHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcgPSB0aGlzLnBCYXNlTWV0aG9kLl9wVG90YWxMaWdodENvbG9yUmVnO1xuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZVBlclByb2JlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIGN1YmVNYXBSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB3ZWlnaHRSZWdpc3RlcjpzdHJpbmcsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSB0aGlzLnBCYXNlTWV0aG9kLmlHZXRGcmFnbWVudENvZGVQZXJQcm9iZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBjdWJlTWFwUmVnLCB3ZWlnaHRSZWdpc3RlciwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0XHR0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnID0gdGhpcy5wQmFzZU1ldGhvZC5fcFRvdGFsTGlnaHRDb2xvclJlZztcblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHRoaXMucEJhc2VNZXRob2QuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlTZXRSZW5kZXJTdGF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdHRoaXMucEJhc2VNZXRob2QuaVNldFJlbmRlclN0YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlbmRlcmFibGUsIHN0YWdlLCBjYW1lcmEpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaURlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHR0aGlzLnBCYXNlTWV0aG9kLmlEZWFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLnBCYXNlTWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5wQmFzZU1ldGhvZC5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHRhcmdldFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlSZXNldCgpXG5cdHtcblx0XHR0aGlzLnBCYXNlTWV0aG9kLmlSZXNldCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcblx0e1xuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xuXHRcdHRoaXMucEJhc2VNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIHdoZW4gdGhlIGJhc2UgbWV0aG9kJ3Mgc2hhZGVyIGNvZGUgaXMgaW52YWxpZGF0ZWQuXG5cdCAqL1xuXHRwcml2YXRlIG9uU2hhZGVySW52YWxpZGF0ZWQoZXZlbnQ6U2hhZGluZ01ldGhvZEV2ZW50KVxuXHR7XG5cdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcblx0fVxufVxuXG5leHBvcnQgPSBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kOyJdfQ==