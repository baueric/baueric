/**
 * Created with JetBrains RubyMine.
 * User: ebauer
 * Date: 2/9/13
 * Time: 5:24 PM
 * To change this template use File | Settings | File Templates.
 */


var ArenaRenderer = Class.create({
    initialize: function(canvas, renderDebugInfo) {
        this.canvas = canvas;
        this.renderDebugInfo = renderDebugInfo;
        this.context = this.canvas.getContext("2d");
    },

    DrawObjects: function(objs) {

        this.Clear();

        var length = objs.length, obj = null;

        var translationalEnergy = 0;
        var rotationalEnergy = 0;
        var potentialEnergy = 0;

        for (var i = 0; i < length; i++) {
            obj = objs[i];
            if(obj instanceof OrneryPoly){
                this.DrawPolygon(obj);
            }

            if (this.renderDebugInfo) {
                if (!obj.fixed) {
                    translationalEnergy += (0.5) * obj.Mass() * Math.pow(obj.vel.Mag(),2);
                    rotationalEnergy += (0.5) * obj.momentOfInert * Math.pow(obj.rotVel,2);
                    // use the veritical position from the floor (496)
                    var h = (496 - obj.pos.y);
                    potentialEnergy += h * obj.Mass() / 0.031 ;
                }
            }
        }

        if (this.renderDebugInfo) {
            this.context.fillStyle = "blue";
            this.context.font = '10px sans-serif';
            this.context.fillText("Translational Energy: " + translationalEnergy, 10, 15);
            this.context.fillText("Rotational Energy: " + rotationalEnergy, 10, 30);
            this.context.fillText("Gravitational Energy: " + potentialEnergy, 10, 45);
            this.context.fillText("Total Energy: " + (translationalEnergy + rotationalEnergy + potentialEnergy), 10, 60);
        }

    },

    DrawPolygon: function(obj){
        if (obj.vertices.length > 2) {

            var verts = obj.GetWorldVertices();
            this.context.beginPath();

            var worldVert = verts[0];
            this.context.moveTo(worldVert.x, worldVert.y);

            if (this.renderDebugInfo) {
                this.context.fillStyle = 'black';
                this.context.font = '10px sans-serif';
                this.context.fillText("(" + worldVert.x.toPrecision(4) + "," + worldVert.y.toPrecision(4) + ")", worldVert.x, worldVert.y);
            }

            var length = verts.length;
            for (var i = 1; i < length; i++) {
                worldVert = verts[i];
                this.context.lineTo(worldVert.x, worldVert.y);
                if (this.renderDebugInfo) {
                    this.context.fillStyle = 'black';
                    this.context.font = '10px sans-serif';
                    this.context.fillText("(" + worldVert.x.toPrecision(4) + "," + worldVert.y.toPrecision(4)+ ")", worldVert.x, worldVert.y);
                }
            }
            this.context.closePath();
            this.context.strokeStyle = 'black';
            if (obj.color != "#FFFFFF"){
                this.context.fillStyle = obj.color;
                this.context.fill();
            }
            this.context.stroke();

            if (this.renderDebugInfo) {
                this.context.beginPath();
                this.context.arc(obj.pos.x, obj.pos.y, 2, 0, 2 * Math.PI, false);
                this.context.fillStyle = 'green';
                this.context.fill();
                this.context.fillText("(" + obj.pos.x.toPrecision(4) + "," + obj.pos.y.toPrecision(4)+ ")", obj.pos.x, obj.pos.y);

                var surfaceNormals = obj.GetSurfaceNormals();
                for (var i=1; i <= surfaceNormals.length; i++) {
                    this.context.beginPath();
                    var i2 = (i-1) % surfaceNormals.length;
                    var p = i % surfaceNormals.length;
                    var normalStart = oVec2.Add(verts[p], verts[i2]);
                    normalStart.Multiply(0.5);
                    this.context.moveTo(normalStart.x, normalStart.y);
                    var longNormal = oVec2.Multiply(surfaceNormals[p], 10);
                    this.context.lineTo(normalStart.x + longNormal.x, normalStart.y + longNormal.y);
                    this.context.strokeStyle = 'green';
                    this.context.stroke();
                }
            }
        }
        else
        {
            // this isn't a valid polygon
        }
    },
    DrawCollisions: function(collisions) {
        var collision;
        for (var i = 0; i < collisions.length; i++) {
            collision = collisions[i];

            this.context.beginPath();
            this.context.moveTo(collision.vertex.x, collision.vertex.y);
            this.context.lineTo(collision.vertex.x + collision.mtv.x, collision.vertex.y + collision.mtv.y);
            this.context.strokeStyle = 'red';
            this.context.stroke();
            this.context.fillStyle = 'red';
            var vertcenter = oVec2.Add(oVec2.Multiply(collision.mtv, 0.5), collision.vertex);
            this.context.font = '10px sans-serif';
            this.context.fillText("(" + collision.mtv.x.toPrecision(4) + "," + collision.mtv.y.toPrecision(4)+ ")", vertcenter.x, vertcenter.y);

            this.context.beginPath();
            this.context.arc(collision.vertex.x, collision.vertex.y, 2, 0, 2 * Math.PI, false);
            this.context.fillStyle = 'blue';
            this.context.fill();
            this.context.font = '10px sans-serif';
            this.context.fillText("(" + collision.vertex.x.toPrecision(4) + "," + collision.vertex.y.toPrecision(4)+ ")", collision.vertex.x, collision.vertex.y);
        }
    },
    DrawVictory: function(victoryPlayer) {
        this.context.fillStyle = "green";
        this.context.font = '20px sans-serif';
        this.context.fillText(victoryPlayer + " Has lost the game", this.canvas.width/2 - 120, 40);
    },
    Clear: function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
});

