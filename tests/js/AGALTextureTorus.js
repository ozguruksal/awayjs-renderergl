///<reference path="../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../src/Away3D.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var scene;
(function (scene) {
    var AGALTextureTorus = (function (_super) {
        __extends(AGALTextureTorus, _super);
        function AGALTextureTorus() {
            _super.call(this);

            if (!document) {
                throw "The document root object must be avaiable";
            }

            this._stageGL = new away.base.StageGL(document.createElement("canvas"), 0, null);
            this._stageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
            this._stageGL.requestContext(true);
        }
        AGALTextureTorus.prototype.onContextGLCreateHandler = function (e) {
            this._stageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
            this._stageGL.width = 800;
            this._stageGL.height = 600;

            document.body.appendChild(this._stageGL.canvas);

            this._contextGL = this._stageGL.contextGL;

            this._contextGL.configureBackBuffer(800, 600, 0, true);
            this._contextGL.setColorMask(true, true, true, true);

            this._geometry = new away.base.Geometry();

            var torus = new away.primitives.TorusGeometry(1, 0.5, 32, 16, false);
            torus.iValidate();

            var vertices = torus.getSubGeometries()[0].vertexData;
            var indices = torus.getSubGeometries()[0].indexData;

            var stride = 13;
            var numVertices = vertices.length / stride;
            this._vBuffer = this._contextGL.createVertexBuffer(numVertices, stride);
            this._vBuffer.uploadFromArray(vertices, 0, numVertices);

            var numIndices = indices.length;
            this._iBuffer = this._contextGL.createIndexBuffer(numIndices);
            this._iBuffer.uploadFromArray(indices, 0, numIndices);

            this._program = this._contextGL.createProgram();

            var vProgram = "m44 op, va0, vc0  \n" + "mov v0, va1       \n";

            var fProgram = "mov oc, v0 \n";

            var vertCompiler = new aglsl.AGLSLCompiler();
            var fragCompiler = new aglsl.AGLSLCompiler();

            var compVProgram = vertCompiler.compile(away.gl.ContextGLProgramType.VERTEX, vProgram);
            var compFProgram = fragCompiler.compile(away.gl.ContextGLProgramType.FRAGMENT, fProgram);

            console.log("=== compVProgram ===");
            console.log(compVProgram);

            console.log("\n");

            console.log("=== compFProgram ===");
            console.log(compFProgram);

            this._program.upload(compVProgram, compFProgram);
            this._contextGL.setProgram(this._program);

            this._matrix = new away.utils.PerspectiveMatrix3D();
            this._matrix.perspectiveFieldOfViewLH(85, 800 / 600, 0.1, 1000);

            this._contextGL.setVertexBufferAt(0, this._vBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_3);
            this._contextGL.setVertexBufferAt(1, this._vBuffer, 6, away.gl.ContextGLVertexBufferFormat.FLOAT_3); // test varying interpolation with normal channel as some colors

            //this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
            //this._requestAnimationFrameTimer.start();
            this.tick(0);
        };

        AGALTextureTorus.prototype.tick = function (dt) {
            this._contextGL.setProgram(this._program);
            this._contextGL.setProgramConstantsFromMatrix(away.gl.ContextGLProgramType.VERTEX, 0, this._matrix, true);

            this._contextGL.clear(0.16, 0.16, 0.16, 1);
            this._contextGL.drawTriangles(this._iBuffer, 0, this._iBuffer.numIndices / 3);
            this._contextGL.present();
            //this._requestAnimationFrameTimer.stop();
        };
        return AGALTextureTorus;
    })(away.events.EventDispatcher);
    scene.AGALTextureTorus = AGALTextureTorus;
})(scene || (scene = {}));
//# sourceMappingURL=AGALTextureTorus.js.map
