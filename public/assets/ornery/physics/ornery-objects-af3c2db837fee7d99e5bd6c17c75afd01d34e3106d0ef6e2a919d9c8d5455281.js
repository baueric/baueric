/**
 * Created with JetBrains RubyMine.
 * User: ebauer
 * Date: 2/9/13
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.
 */



var OrneryObject = Class.create({

    initialize:function (position) {
        // the location in WORLD coordinates of this object. This is the center of gravity point for the object.
        this.pos = position;
        // velocity of this object
        this.vel = new oVec2(0.0,0.0);
        // rotational velocity. Positive is clockwise, negaitve counter-clockwise
        this.rotVel = 0;
        // area and area are
        this.area = 0.0;

        // is this object fixed in the game world
        this.fixed = false;

        // projectile or tower
        this.type = "";

        // id obtained from db
        this.id = -1;

        // fill color
        this.color = "#FFFFFF";

        // user to whom this oo belongs
        this.user = "";

        // is this object currently being manipulated by input
        this.active = false;

        // current rotation transform
        this.rotMat = new oMatrix22(0.0);
    }
});


var OrneryPoly = Class.create(OrneryObject,{

    initialize: function($super,position, verts, isFixed){
        $super(position);
        if (verts.length < 3) {
            // this is bad because it has no volume
            throw "not enough vertices";
        }

        // stored values to reduce repeated computation
        this.surfaces = null;
        this.surfaceAxes = null;
        this.worldVerts = null;

        // the vertices of this object in local coordinates (relative to the center of gravity) defined in counter-clockwise direction.
        // These are also not rotated, they are the original positions.
        this.vertices = verts;
        // find the area

        this.area = OrneryPoly.FindArea(this.vertices);

        // find the center of mass
        var center = OrneryPoly.FindCenter(this.vertices, this.area);

        // now we need to move the vertices to be relative to the center of mass
        for (var i=0;i<this.vertices.length;i++) {
            this.vertices[i].Subtract(center);
        }

        // add the center to the original position so this object is in the same spot as it was defined
        this.pos.Add(center);

        this.boundingRadius = 0;
        // now find the farthest vertex from the center
        for (var i=0;i<this.vertices.length;i++) {
            this.boundingRadius = Math.max(this.boundingRadius, this.vertices[i].Mag());
        }

        this.fixed = isFixed;
        if (this.fixed) {
            this.momentOfInert = Number.POSITIVE_INFINITY;
        }
        else {
            this.momentOfInert = OrneryPoly.FindMomentOfInertia(this.vertices, this.Mass(), new oVec2(this.boundingRadius, this.boundingRadius));
        }
    },
    Rotate: function(rad){
        if (rad != 0) {
            this.rotMat = oMatrix22.MultMM(new oMatrix22(rad), this.rotMat);
            // invalidate the surfaces and surface axes
            this.surfaces = null;
            this.surfaceAxes = null;
            this.worldVerts = null;
        }
    },
    Move: function(delta) {
        if (delta.Mag() != 0) {
            this.pos.Add(delta);
            // invalidate the world vertices
            this.worldVerts = null;
        }
    },
    GetWorldVertices: function() {
        // if the world verts have already been computed this frame we don't need to do it again
        if (this.worldVerts == null) {
            this.worldVerts = [];
            for (var i=0;i<this.vertices.length;i++) {
                var vert = this.vertices[i];

                // rotate the point
                var newVert = oMatrix22.MulTMV(this.rotMat, vert);
                // translate the point
                newVert.Add(this.pos);

                // add the new vertex
                this.worldVerts.push(newVert);
            }
        }
        return this.worldVerts;
    },
    GetSurfaces: function() {
        if (this.surfaces == null) {
            var verts = this.GetWorldVertices();
            this.surfaces = new Array();

            var v1 = verts[verts.length-1];
            var v2;
            for (var i=0;i<verts.length;i++) {
                var v2 = verts[i];

                var surface = oVec2.Subtract(v2, v1);

                this.surfaces.push(surface);

                v1 = v2;
            }
        }
        return this.surfaces;
    },
    // gets all the normalized surface axes
    GetSurfaceNormals: function() {
        if (this.surfaceAxes == null) {
            var surs = this.GetSurfaces();

            this.surfaceAxes = new Array();

            for (var i=0;i<surs.length;i++) {
                var perp = oVec2.PerpendicularCW(surs[i]);
                perp.Normalize();

                // TODO: We can ignore parallels but this messes up the collision resolution
//                for (var j=0;j<this.surfaceAxes.length;j++) {
//                    if (oVec2.AreParallel(perp, this.surfaceAxes[j])) {
//                        perp = null;
//                        break;
//                    }
//                }

                if (perp != null) {
                    this.surfaceAxes.push(perp);
                }
            }
        }
        return this.surfaceAxes;
    },
    // clear this object for the next frame. Clears precomputed values
    NewFrame: function() {
        this.worldVerts = null;
        this.surfaces = null;
        this.surfaceAxes = null;
    },
    Mass: function() {
        if (this.fixed) {
            return Number.POSITIVE_INFINITY;
        }
        else{
            return this.area;
        }
    },
    Momentum: function() {
        return oVec2.Multiply(this.vel, this.Mass()).Mag();
    },
    AngularMomentum: function() {
        return Math.abs(this.rotVel * this.momentOfInert);
    },
    // gets the velocity vector of a point on the object. The point passed in must be in object local coordinates.
    GetVelocityOfPoint: function(point) {
        var angVel = oVec2.CrossZ(this.rotVel, point);
        return oVec2.Add(angVel, this.vel);
    }

});

// finds the center of mass of a polygon
OrneryPoly.FindCenter = function(verts, area) {
    var len = verts.length;
    var x=0; var y=0;
    var f;
    var j=len-1;
    var p1; var p2;

    for (var i=0; i<len; j=i++) {
        p1=verts[i]; p2=verts[j];
        f=p1.x*p2.y-p2.x*p1.y;
        x+=(p1.x+p2.x)*f;
        y+=(p1.y+p2.y)*f;
    }
    f=area*6;

    return new oVec2(x/f, y/f);
}

// finds the area of a polygon
OrneryPoly.FindArea = function(verts) {
    var len = verts.length;
    var area = 0;
    var v1;
    var v2;
    var j = len-1;

    for (var i=0; i<len; j=i++) {
        v1=verts[i]; v2=verts[j];
        area+=v1.x*v2.y;
        area-=v1.y*v2.x;
    }


    area = area / 2;
    if (area < 0) {
        throw "Area can not be negative"
    }
    return area;
}

// find the moment of inertia of a polygon. Positive translation moves the vertices to all be positive so the equation works.
OrneryPoly.FindMomentOfInertia = function(verts, mass, positiveTranslationVec) {
    var numer = 0;
    var denom = 0;
    var moi = 0;

    var v1 = verts[verts.length-1];
    var v2;
    for (var i=0;i<verts.length;i++) {
        v2 = verts[i];

        numer += Math.abs(oVec2.Cross(v2,v1)) * (oVec2.Dot(v2,v2) + oVec2.Dot(v2,v1) + oVec2.Dot(v1,v1));
        denom += Math.abs(oVec2.Cross(v2,v1));

        v1 = v2;
    }

    moi = (mass / 6) * (numer/denom);
    if (moi < 0) {
        throw "Moment of inertia cannot be less than 0";
    }
    return moi;
}
