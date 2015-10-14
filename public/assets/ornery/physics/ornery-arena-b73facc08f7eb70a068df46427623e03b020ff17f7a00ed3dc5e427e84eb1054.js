/**
 * Created with JetBrains RubyMine.
 * User: ebauer
 * Date: 2/9/13
 * Time: 6:26 PM
 * To change this template use File | Settings | File Templates.
 */


// container class for the game functionalities
var OrneryArena = Class.create({

    initialize: function(canvas, renderDebugInfo) {
        // the master array of current objects
        this.objects = this.CreateWorldObjects(canvas.width, canvas.height);
        this.objects = this.objects.concat(GetUserTowers(0, 130, 200, 0));
        this.objects = this.objects.concat(GetUserTowers(600, 30, -200, 0));
        // the render for this game
        this.renderer = new ArenaRenderer(canvas,renderDebugInfo);
        this.physics = new OrneryPhysics(canvas.width, canvas.height);
    },

    Step: function(interval) {
        // steps the game a number of seconds
        this.physics.Step(this.objects, interval);

        this.Draw();
        setTimeout(this.ContinueExecution, 3);
    },
    ContinueExecution: function () {
        var BREAK_HERE_TO_PAUSE_ANIMATION = 0;
    },

    Draw: function() {
        // draws the current state onto the canvas
        this.renderer.DrawObjects(this.objects);
        if (this.renderer.renderDebugInfo) {
            this.renderer.DrawCollisions(this.physics.currentCollisions);
        }
        var victory = CheckVictoryCondition(this.objects);
        if (victory != null) {
            this.renderer.DrawVictory(victory);
        }
    },
    GetObjectById: function(id){
        var retVal = null;
        var length = this.objects.length;
        var i;
        for (i=0; i<length; i++){
            if (this.objects[i].id == id){
                retVal = this.objects[i];
                break;
            }
        }
        return retVal;
    },
    GetActiveObject: function(user){
        var retVal = null;
        var length = this.objects.length;
        var i;
        for (i=0; i<length; i++){
            var obj = this.objects[i];
            if (obj.user == user && obj.active == true){
                retVal = obj;
                break;
            }
        }
        return retVal;
    },
    GetObjectAtPoint: function(point) {
        // gets the object at a point in world coordinates
        return this.physics.colDet.ObjectAtPoint(point, this.objects);
    },
    AddObject: function(obj) {
        this.objects.push(obj);
    },

    Clear: function() {
        this.objects = [];
        this.Draw();
    },
    CreateWorldObjects: function(width, height) {

        var padding = 4;

        var top = 0 + padding;
        var left = 0 + padding;
        var right = width - padding;
        var bottom = height - padding;
        var max = 50;

        // create the world boundary polygons
        var ceiling = new OrneryPoly(new oVec2(0,0),[
            new oVec2(right,top),
            new oVec2(right,-max),
            new oVec2(left,-max),
            new oVec2(left,top)], true);

        var rightWall = new OrneryPoly(new oVec2(0,0),[
            new oVec2(right,bottom),
            new oVec2(right + max,bottom),
            new oVec2(right + max,top),
            new oVec2(right,top)], true);

        // create the world boundary polygons
        var floor = new OrneryPoly(new oVec2(0,0),[
            new oVec2(left,bottom + max),
            new oVec2(right,bottom + max),
            new oVec2(right,bottom),
            new oVec2(left,bottom)], true);

        var leftWall = new OrneryPoly(new oVec2(0,0),[
            new oVec2(-max,top),
            new oVec2(-max,bottom),
            new oVec2(left,bottom),
            new oVec2(left, top)], true);

        ceiling.fixed = true;
        rightWall.fixed = true;
        floor.fixed = true;
        leftWall.fixed = true;

        return [ceiling, rightWall, floor, leftWall];
    }
});
