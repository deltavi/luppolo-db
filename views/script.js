function ajax(method, url, callback, data) {
    try {
        var x = new (this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open(method, url, 1);
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
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
    ajax('DELETE', '/luppolo/query/' + db + '/' + key + '?pretty', function (res) {
        window.location.reload();
    });
}

function onSearch(db, queryId, valueId) {
    var el = document.getElementById(queryId);
    var query = el.value;
    ajax('POST', '/luppolo/query/' + db + '/_search?pretty', function (responseText, res) {
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