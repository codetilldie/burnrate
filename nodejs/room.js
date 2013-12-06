/**
 *
 * User: lin
 * Date: 13-12-4
 * Time: 下午10:46
 *
 */
var _ = require('./underscore.js');
var u = require('./util.js');
console.info('room.js module init;');

var idList = [];
function getRanId(){
    var num = _.random(1111,8888);
    if(!num in idList){
        idList.push(num);
        return num;
    }else{
        return this.getRanId();
    }
}

function Room(id, name, password, url){
    this.id = id;
    this.name = name;
    this.password = password;
    this.url = url;
}

var roomList = [];
function createRoom(name, password){
    var room = new Room(getRanId(), name, password);
    roomList.push(room);
    return room;
}

function queryRoom(id, name){
    var resultList = [];
    for(room in roomList){
        if(room.id == id || room.name.contains(name)){
            resultList.push(room);
        }
    }
    return resultList;
}

exports.createRoom = createRoom;
exports.queryRoom = queryRoom;