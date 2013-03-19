/**
 * Created with JetBrains PhpStorm.
 * User: justus
 * Date: 19.03.13
 * Time: 16:01
 * Yes, I'm fucking serious.
 */

function theLocator() {
}

var TheLocator = new theLocator();

theLocator.prototype.getPath = function () {
    // We're going to hell for this. Sorry folks.
    var path = (document.location.hash + '/').match(/([_A-z]+\.\d+(\.(pro|con|neut)\.\d+)?\/+)+/g);
    if (path == null || path.length == 0) {
        path = '/';
    } else {
        path = path[0];
    }
    return path;
}

theLocator.prototype.getPathParts = function () {
    var pathParts = this.getPath().split("/");
    return pathParts;
}

theLocator.prototype.getSanitizedPath = function (target) {
    if (target == undefined) {
        target = '';
    } else {
        target = target.replace(/\//g, '');
    }

    var parts = this.getPathParts();
    var tmp = [];
    for (p in parts) {
        if (parts[p] == "") {
            continue;
        }
        //console.log(parts[p]);
        tmp.push(parts[p]);
    }

    var sanePath = this.saneSlashAppending(tmp.join('/')) + target;
    if (sanePath != '/') {
        sanePath = this.removeTrailingSlashes(sanePath);
    }
    console.log(sanePath, tmp);

    return sanePath;
}

theLocator.prototype.removeTrailingSlashes = function (string) {
    if (string.substr(string.length-1) == '/') {
        string = string.substr(0, string.length - 1);
    }
    return string;
}

theLocator.prototype.saneSlashAppending = function (string) {
    if (string.substr(string.length-1) != '/') {
        string += '/';
    }
    return string;
}
