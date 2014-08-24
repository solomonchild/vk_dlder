AudioReg = new RegExp("http://.*audios.*\.mp3")

function getAudioUrl(play_btn) {
    arr = play_btn.children[0].parentNode.parentNode.children;
    var url;
    Array.prototype.every.call(arr, function(elem) {
            match_group = AudioReg.exec(elem.value);
            if(match_group != null) 
            {
                url = match_group[0];
                return false;
            }
            return true;
    });
    return url;
}

function onDlClick(event) {
    console.log(event.toElement.getAttribute('url'));
    return true;
}
var dHeight;


function getAudioElemList() {

    //handle video player elements
    getVideoElem();
    tumbs = document.getElementsByClassName('video_row_relative')
    Array.prototype.forEach.call(tumbs, function(elem) {
        elem.onclick = function() { console.log("CLICK"); }
    });
     

    //assign onClick for "Expand comment" anchors
    show_comments = document.getElementsByClassName('wr_header');
    Array.prototype.forEach.call(show_comments, function(show_comment) {
            show_comment.onclick = function() {
                //yes, a deferred callback
                //give some time for anchor
                //to be re-rendered
                setTimeout(function() {
                    getAudioElemList();
                }, 500);
            }
    });

    //Handle all "Play" buttons on a page
    play_buttons = document.getElementsByClassName('play_btn_wrap');
    Array.prototype.forEach.call(play_buttons, function(play_btn) {

            elem = play_btn.parentNode.parentNode;
            if(elem.tagName == 'TR') {
                 //third one is "info" td, insert before it
                before_ins = elem.childNodes[3];
                
                //If third element's classname is not info,
                //then this "Play" button has been processed before
                if(before_ins.className == "info") {
                    url = getAudioUrl(play_btn);
                    dl_a = document.createElement('a');
                    dl_a.setAttribute('href', url);
                    dl_a.setAttribute('download', "");
                    dl_a.setAttribute("style", "padding: 8px; padding-top:0px;");
                    dl_a.onclick = onDlClick;

                    dl_div = document.createElement('div');
                    
                    //Google extension-specific code
                    iconUrl = chrome.extension.getURL("images/play.gif"); 
                    dl_div.setAttribute("style", "background:url('" + iconUrl + "') no-repeat 0px 0px !important;");
                    dl_div.className = 'play_new';
                    dl_div.appendChild(dl_a);


                    fresh_td = document.createElement('td');
                    fresh_td.setAttribute('style', 'padding-top:6px; padding-right:6px; ');
                    fresh_td.appendChild(dl_div);
                    elem.insertBefore(fresh_td, before_ins);
                }
            }
    });
}

function getVideoElem() {
    video_player = document.getElementById('video_player');
    if(video_player == null)
        return;
    
    //construct regexes for each resolution type
    p240 = new RegExp("http[^http]*240.mp4");
    p360 = new RegExp("http[^http]*360.mp4");
    p480 = new RegExp("http[^http]*480.mp4");
    p720 = new RegExp("http[^http]*720.mp4");
    arr = [ p240, p360, p480, p720 ];
    text = video_player.getAttribute('flashvars');
    
    arr.forEach(function(elem) {
        match_group = elem.exec(text)
        if(match_group == null)
            return;
        link = match_group[0].replace(/%3A/g, ':').replace(/%2F/g, '/');
        actions = document.getElementById('mv_actions');

        a_dl = document.createElement('a');
        a_dl.setAttribute('href', link);
        a_dl.setAttribute('download', '');

        len = link.length
        a_dl.innerHTML = 'Скачать ' + link.substring(len - 7, len - 4) +"p"; 
        actions.appendChild(a_dl);
    });

}

function onScroll(event) {
    
    //If we overscroll, new content is loaded automatically
    if(window.pageYOffset > dHeight) {
        dHeight = document.body.offsetHeight;
        
        //no problem calling it several times
        //as this case is handled inside (checking for "info")
        getAudioElemList();

    }
}

function main() {
    dHeight = document.body.offsetHeight;
    window.onscroll = onScroll;
    getAudioElemList() ;
};

main();
