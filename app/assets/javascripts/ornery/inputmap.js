var _arena;
var _canvasRect;
var _activeObj;
var _user;

function createInputMap(user,canvas,arena){
    _user = user;
    _canvasRect = canvas.getBoundingClientRect();
    _arena = arena;
    var touchEvents = !(document.ontouchmove == undefined || document.ontouchmove == null);
    if (touchEvents){
        canvas.addEventListener('touchdown', player_touch_down, false);
        //addEventListener('touchmove', player_did_move, false);
    }
    else{
        canvas.addEventListener('mousedown', player_touch_down, false);
        addEventListener('mousemove', player_touch_moved, false);
        addEventListener('mouseup', player_touch_up, false);
    }

}

function player_touch_down(event){

    var x;
    var y;
    event.preventDefault();
    x = event.clientX - _canvasRect.left;
    y = event.clientY - _canvasRect.top;
    console.log("x:"+x+" y:"+y);
    var tmpObj = _arena.GetObjectAtPoint(new oVec2(x,y),_arena.objects);
    console.log("object:"+ tmpObj);
    if(tmpObj != null && tmpObj.user == _user){
        _activeObj = tmpObj;
        _activeObj.active = true;
    }
}

function player_touch_moved(event){
    if (_activeObj != null && _activeObj.active){
        event.preventDefault();
        var x = event.clientX - _canvasRect.left;
        var y = event.clientY - _canvasRect.top;
        var touchPos = new oVec2(x,y);
        _activeObj.pos = touchPos;
    }
}

function player_touch_up(event){
    event.preventDefault();
    if (_activeObj != null){
        _activeObj.active = false;
        _activeObj = null;
    }
}
