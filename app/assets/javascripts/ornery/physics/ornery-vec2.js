/**
 * Created with JetBrains RubyMine.
 * User: ebauer
 * Date: 2/9/13
 * Time: 5:45 PM
 * To change this template use File | Settings | File Templates.
 */


// basic 2 value vector for storing positions or direction vectors
var oVec2 = Class.create({
    initialize: function(xVal, yVal){
        this.x = xVal;
        this.y = yVal;
    },

    Add: function(vec2)
    {
        this.x += vec2.x;
        this.y += vec2.y;
    },

    Subtract: function(vec2)
    {
        this.x -= vec2.x;
        this.y -= vec2.y;
    },

    Multiply: function(val)
    {
        this.x *= val;
        this.y *= val;
    },

    Abs: function()
    {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
    },

    Mag: function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    SetV: function(vec) {
        this.x = vec.x;
        this.y = vec.y;
    },
    Set: function(xVal, yVal) {
        this.x = xVal;
        this.y = yVal;
    },
    SetMag: function(magnitude) {
        this.Normalize();
        this.Multiply(magnitude);
    },

    Normalize: function()
    {
        var mag = this.Mag();
        if (mag < Number.MIN_VALUE)
        {
            return 0.0;
        }
        var magInv = 1.0 / mag;
        this.x *= magInv;
        this.y *= magInv;
    }
});

// methods below are static and create new instances of the vector class

oVec2.Multiply = function (vec, val) {
    return new oVec2(vec.x * val, vec.y * val);
};

oVec2.Add = function (vec1, vec2) {
    return new oVec2(vec1.x + vec2.x, vec1.y + vec2.y);
};

oVec2.Subtract = function (vec1, vec2) {
    return new oVec2(vec1.x - vec2.x, vec1.y - vec2.y);
};

oVec2.Dot = function(vec1, vec2)
{
    return vec1.x * vec2.x + vec1.y * vec2.y;
};

oVec2.Cross = function(vec1, vec2)
{
    return vec1.x * vec2.y - vec1.y * vec2.x;
};

// crosses a z direction vector with a x,y vector: (0,0,z) x (x, y, 0) = (-y*z, x*z, 0)
oVec2.CrossZ = function(z, vec) {
    return new oVec2(- vec.y * z, vec.x * z);
}

// Gets the perpendicular vector by rotating clockwise
oVec2.PerpendicularCW = function(vec) {
    return new oVec2(-vec.y, vec.x);
}

// Gets the perpendicular vector by rotating counter clockwise
oVec2.PerpendicularCCW = function(vec) {
    return new oVec2(vec.y, -vec.x);
}

oVec2.Min = function(vec1, vec2) {
    if (vec1.Mag() < vec2.Mag()) {
        return vec1;
    }
    else {
        return vec2;
    }
}

oVec2.Normalize = function(vec)
{
    var normVec = new oVec2(vec.x, vec.y);
    normVec.Normalize();
    return normVec;
}

oVec2.Max = function(vec1, vec2) {
    if (vec1.Mag() >= vec2.Mag()) {
        return vec1;
    }
    else {
        return vec2;
    }
}

oVec2.AreParallel = function(vec1, vec2) {
    if (oVec2.Cross(vec1, vec2) == 0) {
        return true;
    }
    else {
        return false;
    }
}
