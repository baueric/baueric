/**
 * Created with JetBrains RubyMine.
 * User: ebauer
 * Date: 2/9/13
 * Time: 2:07 PM
 * To change this template use File | Settings | File Templates.
 */

var OrneryPhysics = Class.create({

    initialize:function () {
        this.colDet = new OrneryCollisionDetection();
        this.currentCollisions = new Array();
    },
    // This is the gravitational vector (units/s/s)
    gravity: new oVec2(0, 0),
    // Elasticity to use for collisions
    elasticity:.65,
    collisionFriction: 0.1,
    // A threshold to use to determine if there is a contact point
    contactVelThreshold: 0.1,
    SetElasticity: function(e) {
        this.elasticity = e;
    },
    SetGravityY: function(g) {
        this.gravity.y = g;
    },
    Step: function(objects, interval){

        // Ready the objects for the new frame
        for (var i=0;i<objects.length;i++){
            objects[i].NewFrame();
        }

        var obj;
        for (var i=0;i<objects.length;i++){
            obj = objects[i];
            // apply gravitational force

            if (!obj.fixed && !obj.active) {
                obj.vel.Add(oVec2.Multiply(this.gravity, interval));
                obj.Move(oVec2.Multiply(obj.vel, interval));
                obj.Rotate(obj.rotVel * interval);
            }
        }

        this.currentCollisions = this.colDet.DetectObjectCollisions(objects);

        var iters = 0;
        while (this.currentCollisions.length > 0 && iters < 4) {
            // resolve all collisions
            var collision;
            for (var i=0;i<this.currentCollisions.length;i++){
                collision = this.currentCollisions[i];

                if (collision.vertexObject.fixed == true && collision.surfaceObject.fixed == true ) {
                    continue;
                }
                var moveRatio = collision.vertexObject.Mass() / (collision.vertexObject.Mass() + collision.surfaceObject.Mass());
                if (isNaN(moveRatio)) {
                    // the vertex object is fixed so move the surface object
                    collision.surfaceObject.Move(oVec2.Multiply(collision.mtv, -1));
                }
                else if (moveRatio == 0) {
                    // the surface object is fixed so move the vertex object
                    collision.vertexObject.Move(collision.mtv);
                }
                else {
                    // this is the original code
                    // move the objects in proportion to their masses
                    collision.vertexObject.Move(oVec2.Multiply(collision.mtv, 1 - moveRatio));
                    collision.surfaceObject.Move(oVec2.Multiply(collision.mtv, -moveRatio));
                }

                var impulse = collision.Impulse(this.elasticity);
                this.ApplyImpulse(collision.vertexObject, impulse, collision);
                this.ApplyImpulse(collision.surfaceObject, -impulse, collision);
            }
            this.currentCollisions = this.colDet.DetectObjectCollisions(objects);
            iters++;
        }
    },
    // applies an impulse to an object
    ApplyImpulse: function(obj, impulse, collision) {

        if (obj.fixed || obj.active) {
            // nothing to do if the object is fixed
            return;
        }

        var frictionNormal = oVec2.PerpendicularCCW(collision.collisionNormal);
        if (oVec2.Dot(frictionNormal, collision.collisionVel) > 0) {
            frictionNormal = oVec2.PerpendicularCW(collision.collisionNormal);
        }

        var frictionImpulse = impulse * this.collisionFriction;

        // alter the objects translational velocity due to collision friction force
        obj.vel.Add(oVec2.Multiply(oVec2.Multiply(frictionNormal, frictionImpulse), 1/obj.Mass()));

        // change the rotational velocity due to collision friction
        obj.rotVel += oVec2.Cross(oVec2.Subtract(collision.vertex, obj.pos), oVec2.Multiply(frictionNormal, frictionImpulse)) / obj.momentOfInert;

        // alter the objects translational velocity due to normal force
        obj.vel.Add(oVec2.Multiply(oVec2.Multiply(collision.collisionNormal, impulse), 1/obj.Mass()));

        // change the rotational velocity
        obj.rotVel += oVec2.Cross(oVec2.Subtract(collision.vertex, obj.pos), oVec2.Multiply(collision.collisionNormal, impulse)) / obj.momentOfInert;

    }
});

