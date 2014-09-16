

var gameVictory = null;

function CheckVictoryCondition(objects) {
    if (gameVictory == null) {
        var obj;
        for (var i=0;i<objects.length;i++) {
            obj = objects[i];
            if (obj.type === "target") {

                if (obj.pos.y > 470) {
                    gameVictory = obj.user;
                    break;
                }

            }
        }
    }
    return gameVictory;
}

function GetUserTowers (xPos, yPos, xVel, yVel) {

    var pos = new oVec2(xPos,yPos);

    var leftLeg = new OrneryPoly((new oVec2(pos.x,pos.y)), [
    new oVec2(23,147),
    new oVec2(9,147),
    new oVec2(9,269),
    new oVec2(23,269)],false);
    leftLeg.vel = new oVec2(xVel,yVel);

    var rightLeg = new OrneryPoly((new oVec2(pos.x,pos.y)), [
        new oVec2(107,147),
        new oVec2(93,147),
        new oVec2(93,269),
        new oVec2(107,269)],false);
    rightLeg.vel = new oVec2(xVel,yVel);

    var firstPlatform = new OrneryPoly((new oVec2(pos.x,pos.y)), [
        new oVec2(114,140),
        new oVec2(2,140),
        new oVec2(2,146),
        new oVec2(114,146)],false);
    firstPlatform.vel = new oVec2(xVel,yVel);

    var pedestal = new OrneryPoly((new oVec2(pos.x,pos.y)), [
        new oVec2(78,67),
        new oVec2(45,67),
        new oVec2(55,141),
        new oVec2(68,141)],false);
    pedestal.vel = new oVec2(xVel,yVel);

    var target = new OrneryPoly((new oVec2(pos.x,pos.y)), [
        new oVec2(60,42),
        new oVec2(48,52),
        new oVec2(54,66),
        new oVec2(67,66),
        new oVec2(72,52)],false);
    target.vel = new oVec2(xVel,yVel);

//    var projectile = new OrneryPoly((new oVec2(20,400)), [
//        new oVec2(60,42),
//        new oVec2(48,52),
//        new oVec2(54,66),
//        new oVec2(67,66),
//        new oVec2(72,52)],false);
//    projectile.vel = new oVec2(300,-200);

    return [leftLeg, rightLeg, firstPlatform, pedestal, target];
}

// invalidates opponent's objects until he executes @init_my_objects
function init_game(thisPlayer,opponent,isGameHost){
    if(isGameHost){
        var url = "rest/init_game.php";
        var params = "user1="+thisPlayer+"&user2="+opponent;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST',url,true);
        //Send the proper header information along with the request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("Content-length", params.length);
        xmlhttp.send(params);
    }
    init_my_objects(thisPlayer,isGameHost);
}

// puts this player's objects on the grid
function init_my_objects(user,gameHost){
    var url = "rest/init_my_objects.php";
    var params = "user="+user+"&gameHost="+ (gameHost ? 'yes' : 'no');
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST',url,true);
    //Send the proper header information along with the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Content-length", params.length);
    xmlhttp.send(params);
}