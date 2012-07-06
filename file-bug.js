/* Usage: include a link like:
 * <a href="https://www.w3.org/Bugs/Public/enter_bug.cgi?...">file a bug</a>
 * and somewhere after that, include the following:
 * <script src=/hg/quirks-mode/raw-file/tip/file-bug.js async></script>
 * If you don't want the script to inject styles, use an element with
 * id="bug-link-style" before the script.
 */
(function(){
    var prevSelection='';
    var bugLink = document.createElement('a');
    bugLink.className = 'bug-link';
    bugLink.textContent = 'File a bug about the selected text';
    var link = document.querySelector('a[href^="https://www.w3.org/Bugs/Public/enter_bug.cgi?"]');
    link.parentNode.appendChild(bugLink);
    var originalHref = link.href;
    if (!document.getElementById('bug-link-style')) {
        var style = document.createElement('style');
        style.id = 'bug-link-style';
        style.textContent = '.bug-link { position:fixed; bottom:0; left:0; background:rgba(255,255,255,0.8) !important; width:115px; font-size:smaller; padding:0 10px; z-index:1; visibility:hidden } .bug-link[href] { visibility:visible }';
        document.head.appendChild(style);
    }
    onmouseup=onkeyup=function(e){
        var selectionObj = getSelection();
        var selection = String(selectionObj);
        if (selection == prevSelection)
            return;
        prevSelection = selection;
        var node = e.target;
        if (selectionObj.anchorNode) {
            node = selectionObj.anchorNode;
            if (selectionObj.focusNode && selectionObj.anchorNode.compareDocumentPosition) {
                var compare = selectionObj.anchorNode.compareDocumentPosition(selectionObj.focusNode);
                if (compare == 20 || compare == 4) // descendant or following
                    node = selectionObj.focusNode;
            }
        }
        while (node && !node.id) {
            node = node.previousSibling || node.parentNode;
        }
        if (selection == '') {
            bugLink.removeAttribute('href');
            bugLink.removeAttribute('accesskey');
            return;
        }
        var summary = selection;
        if (selection.length > 50)
            summary = selection.substr(0,47)+'...';
        if (selection.length > 1000)
            selection = selection.substr(0,997)+'...';
        var url = location.protocol+'//'+location.host+location.pathname+(node ? '#'+node.id : '');
        bugLink.href = originalHref + '&short_desc='+encodeURIComponent('"'+summary+'" ')+'&comment='+encodeURIComponent(url+'\n\n[[\n'+selection+'\n]]\n\n');
        bugLink.accessKey = '1';
    };
})();
