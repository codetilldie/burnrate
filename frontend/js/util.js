/**
 *
 * User: lin
 * Date: 13-12-1
 * Time: 下午11:44
 *
 */

/**
 * log
 */
function log(){
    if(console && console.log){
        console.log(arguments);
    }
}

/**
 * get key from object by value
 * @param object
 * @param value
 * @returns {*}
 */
function getKey(object, value){
    for(var key in object){
        if(object.hasOwnProperty(key) && object[key] == value){
            return key;
        }
    }
    return null;
}