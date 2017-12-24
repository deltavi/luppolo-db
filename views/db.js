function ajax(method, url, callback, data) {
    try {
        var x = new (this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open(method, url, 1);
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.onreadystatechange = function () {
            x.readyState > 3 && callback && callback(x.responseText, x);
        };
        x.send(data)
    } catch (e) {
        window.console && console.log(e);
        callback({ error: e });
    }
};

function onDelete(db, key) {
    ajax('DELETE', '/' + db + '/' + key + '?pretty', function (res) {
        window.location.reload();
    });
}