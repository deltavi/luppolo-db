function ajax(method, url, callback, data) {
    try {
        var req = this.XMLHttpRequest || ActiveXObject;
        var x = new req('MSXML2.XMLHTTP.3.0');
        x.open(method, url, 1);
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        x.onreadystatechange = function () {
            if(x.readyState > 3 && callback){
                callback(x.responseText, x);
            }
        };
        x.send(data);
    } catch (e) {
        if(window.console){
            console.log(e);
        }
        callback({ error: e });
    }
}

function onDelete(db, key) {
    ajax('DELETE', '/luppolo/db/' + db + '/' + key + '?pretty', function (res) {
        window.location.reload();
    });
}

function onSearch(db, queryId, valueId) {
    var el = document.getElementById(queryId);
    var query = el.value;
    ajax('POST', '/luppolo/db/' + db + '/_search?pretty', function (responseText, res) {
        var valueFrame = document.getElementById(valueId);
        valueFrame = valueFrame.contentWindow || valueFrame.contentDocument.document || valueFrame.contentDocument;
        valueFrame.document.open();
        var resHtml;
        if(res.status === 200){
           resHtml = '<pre>' + responseText + '</pre>';
        } else {
           resHtml = responseText;
        }
        valueFrame.document.write(resHtml);
        valueFrame.document.close();
    }, query);
}