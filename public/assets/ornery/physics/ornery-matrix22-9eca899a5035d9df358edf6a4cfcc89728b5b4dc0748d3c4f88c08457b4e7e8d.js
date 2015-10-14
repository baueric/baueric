/**
 * Created with JetBrains RubyMine.
 * User: ebauer
 * Date: 2/11/13
 * Time: 3:16 PM
 * To change this template use File | Settings | File Templates.
 */


//adapted from the box2d library.

var oMatrix22 = Class.create({
    initialize: function(angle, c1, c2)
    {
        if (angle==null) angle = 0;
        // initialize instance variables for references
        this.col1 = new oVec2();
        this.col2 = new oVec2();
        //

        if (c1!=null && c2!=null){
            this.col1.SetV(c1);
            this.col2.SetV(c2);
        }
        else{
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            this.col1.x = c; this.col2.x = -s;
            this.col1.y = s; this.col2.y = c;
        }
    },

    Set: function(angle)
    {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.col1.x = c; this.col2.x = -s;
        this.col1.y = s; this.col2.y = c;
    },

    SetVV: function(c1, c2)
    {
        this.col1.SetV(c1);
        this.col2.SetV(c2);
    },

    Copy: function(){
        return new oMatrix22(0, this.col1, this.col2);
    },

    SetM: function(m)
    {
        this.col1.SetV(m.col1);
        this.col2.SetV(m.col2);
    },

    AddM: function(m)
    {
        this.col1.x += m.col1.x;
        this.col1.y += m.col1.y;
        this.col2.x += m.col2.x;
        this.col2.y += m.col2.y;
    },

    SetIdentity: function()
    {
        this.col1.x = 1.0; this.col2.x = 0.0;
        this.col1.y = 0.0; this.col2.y = 1.0;
    },

    SetZero: function()
    {
        this.col1.x = 0.0; this.col2.x = 0.0;
        this.col1.y = 0.0; this.col2.y = 0.0;
    },

    Invert: function(out)
    {
        var a = this.col1.x;
        var b = this.col2.x;
        var c = this.col1.y;
        var d = this.col2.y;
        //var B = new b2Mat22();
        var det = a * d - b * c;
        //b2Settings.b2Assert(det != 0.0);
        det = 1.0 / det;
        out.col1.x =  det * d;	out.col2.x = -det * b;
        out.col1.y = -det * c;	out.col2.y =  det * a;
        return out;
    },

    // this.Solve A * x = b
    Solve: function(out, bX, bY)
    {
        //float32 a11 = this.col1.x, a12 = this.col2.x, a21 = this.col1.y, a22 = this.col2.y;
        var a11 = this.col1.x;
        var a12 = this.col2.x;
        var a21 = this.col1.y;
        var a22 = this.col2.y;
        //float32 det = a11 * a22 - a12 * a21;
        var det = a11 * a22 - a12 * a21;
        //b2Settings.b2Assert(det != 0.0);
        det = 1.0 / det;
        out.x = det * (a22 * bX - a12 * bY);
        out.y = det * (a11 * bY - a21 * bX);

        return out;
    },

    Abs: function()
    {
        this.col1.Abs();
        this.col2.Abs();
    },
    MultVec: function(vec) {
        vec.x = this.col1.x * vec.x + this.col2.x * vec.y;
        vec.y = this.col1.y * vec.x + this.col2.y * vec.y;
    },

    col1: new oVec2(),
    col2: new oVec2()
});

oMatrix22.MultMM = function(m1, m2)
{
    var col1 = new oVec2(oVec2.Dot(m1.col1, m2.col1), oVec2.Dot(m1.col2, m2.col1));
    var col2 = new oVec2(oVec2.Dot(m1.col1, m2.col2), oVec2.Dot(m1.col2, m2.col2));
    return new oMatrix22(0, col1, col2);
};

oMatrix22.MulTMV = function(m, v)
{
    return new oVec2(oVec2.Dot(v, m.col1), oVec2.Dot(v, m.col2));
};


