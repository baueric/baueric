/**
 * Created with JetBrains RubyMine.
 * User: ebauer
 * Date: 2/11/13
 * Time: 2:18 PM
 * To change this template use File | Settings | File Templates.
 */


var OrneryCollisionDetection = Class.create({

    initialize:function () {
    },
    DetectObjectCollisions: function(objects) {

        var collisions = new Array();
        for(var i=0; i<objects.length; i++) {

            var obj1 = objects[i];

            var remainingObjs = objects.slice(i + 1, objects.length);

            for (var j=0;j<remainingObjs.length;j++) {
                var obj2 = remainingObjs[j];

                // don't need to compare two fixed objects
                if (obj1.fixed && obj2.fixed) {
                    continue;
                }

                var collision = this.DetectObjectCollision(obj1, obj2);

                if (collision != null) {

                    // add a new collision to the list
                    collisions.push(collision);
                }
            }
        }
        return collisions;
    },
    // Detects collision between two objects. Null if there is no collision.
    DetectObjectCollision: function(obj1, obj2) {
        // create a direction vector between the two objects
        var dirVec = oVec2.Subtract(obj1.pos, obj2.pos);

        // check the bounding circles first
        if (dirVec.Mag() <= obj1.boundingRadius + obj2.boundingRadius) {
            var minOverlap = null;

            minOverlap = this.MinOverlapVec(obj1, obj2, minOverlap);
            if (minOverlap == null) {
                return null;
            }
            minOverlap = this.MinOverlapVec(obj2, obj1, minOverlap);
            if (minOverlap == null) {
                return null;
            }

            return new Collision(minOverlap.surfaceObj, minOverlap.overlap.overlapVector, minOverlap.vertexObj, minOverlap.overlap.overlapVertex);
        }
        return null;
    },
    MinOverlapVec: function(surfaceObj, vertexObj, minOverlap) {
        // create list of all surfaceNormals of both polygons
        var surfaceNormals = surfaceObj.GetSurfaceNormals();
        for (var i=0;i<surfaceNormals.length;i++) {
            var overlap = this.OverlapVec(surfaceNormals[i], surfaceObj.GetWorldVertices(), vertexObj.GetWorldVertices());

            if (overlap == null) {
                // one surface axis didn't have overlap, we can drop out
                return null;
            }
            else {
                if (minOverlap == null || minOverlap.overlap.overlapVector.Mag() > overlap.overlapVector.Mag()) {

                    minOverlap = { overlap: overlap, surfaceObj: surfaceObj, vertexObj: vertexObj};
                }
            }
        }
        return minOverlap;
    },
    //Return if the overlapping vector, null if there is no overlap. Primary verts are of the object whose surface the normal is from.
    // The return also includes the vertex in the vertexObjectVerts that is farthest overlapping.
    OverlapVec: function(surfaceNormal, surfaceObjVerts, vertexObjectVerts) {

        var surfaceObjProj = this.Projection(surfaceNormal, surfaceObjVerts);
        var vertexObjectProj = this.Projection(surfaceNormal, vertexObjectVerts);

        if (surfaceObjProj.max < vertexObjectProj.min || vertexObjectProj.max < surfaceObjProj.min) {
            // the projections do not overlap
            return null;
        }
        else
        {
            var mag = surfaceObjProj.max - vertexObjectProj.min;
            var overlapVert = vertexObjectProj.minVert;

            // set the magnitude of the vector to be the overlap
            var overlapVec = new oVec2();
            overlapVec.SetV(surfaceNormal);
            overlapVec.SetMag(mag);
            return {overlapVector: overlapVec, overlapVertex: overlapVert};
        }

    },
    ObjectAtPoint: function(point, objects) {
        // gets the object at a given point. Null if there is no object.

        var obj;
        for (var i=0; i<objects.length;i++) {
            obj = objects[i];
            // create a direction vector
            var dirVec = oVec2.Subtract(point, obj.pos);

            // check the bounding circle first
            if (dirVec.Mag() <= obj.boundingRadius) {
                var surfaceNormals = obj.GetSurfaceNormals();
                var overlapVec = null;

                // check all surface normals for overlap
                for (var s=0; s<surfaceNormals.length; s++) {
                    overlapVec = this.OverlapVec(surfaceNormals[s], obj.GetWorldVertices(), [point]);
                    if (overlapVec == null) {
                        break;
                    }
                }

                if (overlapVec != null) {
                    // there was an overlap on all surfaces so the point is inside the object
                    return obj;
                }
            }
        }
    },
    // Gets the projects of vertices onto an axis or vector
    Projection: function(vec, verts) {

        // the minimum and maximum values of the projection
        var min = Number.MAX_VALUE;
        var max = -Number.MAX_VALUE;

        // The vertices that are associated with those projects
        var minVert = null;
        var maxVert = null;

        for (var i=0;i<verts.length;i++) {
            var vert = verts[i];
            var dot = oVec2.Dot(vec, vert);

            if (dot < min) {
                min = dot;
                minVert = vert;
            }
            if (dot > max) {
                max = dot;
                maxVert = vert;
            }
        }

        return {min : min, max : max, minVert : minVert, maxVert : maxVert};
    }
});

// defines a collision between two objects
var Collision = Class.create({

    // creates the new collision. The surface object is the object that had its surface penatrated and the vertex object
    // is the object whose vertex pentrated the surface.
    initialize: function (surfaceObject, minimumTranslationVector, vertexObject, vertex) {
        this.surfaceObject = surfaceObject;
        this.vertexObject = vertexObject;
        this.mtv = minimumTranslationVector;
        this.collisionNormal = oVec2.Normalize(this.mtv);
        this.vertex = vertex;

        // the velocity of the collision at the point of contact. This is the combined collision speed of the two objects.
        this.collisionVel = null;
        // impulse of the impact
        this.impulse = null;
    },

    // calculates the velocity of collision at point of contact
    CollisionVelocity: function() {
        if (this.collisionVel == null) {
            var surfaceObjPtVel = this.surfaceObject.GetVelocityOfPoint(oVec2.Subtract(this.vertex, this.surfaceObject.pos));
            var vertexObjPtVel = this.vertexObject.GetVelocityOfPoint(oVec2.Subtract(this.vertex, this.vertexObject.pos));

            this.collisionVel = oVec2.Subtract(vertexObjPtVel, surfaceObjPtVel);
        }
        return this.collisionVel;
    },
    Impulse: function(elasticity) {
        if (this.impulse == null) {

            var numer = oVec2.Dot(oVec2.Multiply(this.CollisionVelocity(), -(1 + elasticity)), this.collisionNormal);

            var denom = (1/this.vertexObject.Mass())
                + (1/this.surfaceObject.Mass())
                + (Math.pow(oVec2.Cross(oVec2.Subtract(this.vertex, this.vertexObject.pos), this.collisionNormal),2) / this.vertexObject.momentOfInert)
                + (Math.pow(oVec2.Cross(oVec2.Subtract(this.vertex, this.surfaceObject.pos), this.collisionNormal),2) / this.surfaceObject.momentOfInert);

            this.impulse = numer / denom;
        }
        return this.impulse;
    }

});