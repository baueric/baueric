var OrneryPhysics=Class.create({initialize:function(){this.colDet=new OrneryCollisionDetection,this.currentCollisions=new Array},gravity:new oVec2(0,0),elasticity:.65,collisionFriction:.1,contactVelThreshold:.1,SetElasticity:function(e){this.elasticity=e},SetGravityY:function(e){this.gravity.y=e},Step:function(e,t){for(var n=0;n<e.length;n++)e[n].NewFrame();for(var r,n=0;n<e.length;n++)r=e[n],r.fixed||r.active||(r.vel.Add(oVec2.Multiply(this.gravity,t)),r.Move(oVec2.Multiply(r.vel,t)),r.Rotate(r.rotVel*t));this.currentCollisions=this.colDet.DetectObjectCollisions(e);for(var i=0;this.currentCollisions.length>0&&4>i;){for(var o,n=0;n<this.currentCollisions.length;n++)if(o=this.currentCollisions[n],1!=o.vertexObject.fixed||1!=o.surfaceObject.fixed){var a=o.vertexObject.Mass()/(o.vertexObject.Mass()+o.surfaceObject.Mass());isNaN(a)?o.surfaceObject.Move(oVec2.Multiply(o.mtv,-1)):0==a?o.vertexObject.Move(o.mtv):(o.vertexObject.Move(oVec2.Multiply(o.mtv,1-a)),o.surfaceObject.Move(oVec2.Multiply(o.mtv,-a)));var s=o.Impulse(this.elasticity);this.ApplyImpulse(o.vertexObject,s,o),this.ApplyImpulse(o.surfaceObject,-s,o)}this.currentCollisions=this.colDet.DetectObjectCollisions(e),i++}},ApplyImpulse:function(e,t,n){if(!e.fixed&&!e.active){var r=oVec2.PerpendicularCCW(n.collisionNormal);oVec2.Dot(r,n.collisionVel)>0&&(r=oVec2.PerpendicularCW(n.collisionNormal));var i=t*this.collisionFriction;e.vel.Add(oVec2.Multiply(oVec2.Multiply(r,i),1/e.Mass())),e.rotVel+=oVec2.Cross(oVec2.Subtract(n.vertex,e.pos),oVec2.Multiply(r,i))/e.momentOfInert,e.vel.Add(oVec2.Multiply(oVec2.Multiply(n.collisionNormal,t),1/e.Mass())),e.rotVel+=oVec2.Cross(oVec2.Subtract(n.vertex,e.pos),oVec2.Multiply(n.collisionNormal,t))/e.momentOfInert}}});