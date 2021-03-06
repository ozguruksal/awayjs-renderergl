import TriangleSubGeometry				= require("awayjs-core/lib/data/TriangleSubGeometry");

class ParticleData
{
	public particleIndex:number /*uint*/;
	public numVertices:number /*uint*/;
	public startVertexIndex:number /*uint*/;
	public subGeometry:TriangleSubGeometry;
}

export = ParticleData