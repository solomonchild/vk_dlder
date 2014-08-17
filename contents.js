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

function getAudioElemList() {
    play_buttons = document.getElementsByClassName('play_btn_wrap');
    Array.prototype.forEach.call(play_buttons, function(play_btn) {
            url = getAudioUrl(play_btn);
            dl_a = document.createElement('a');
            dl_a.setAttribute('href', url);
            dl_a.setAttribute('download', "");
            dl_a.setAttribute("style", "padding: 8px; padding-top:0px;");
            dl_a.onclick = onDlClick;

            dl_div = document.createElement('div');
            iconUrl = chrome.extension.getURL("images/play.gif"); 
            dl_div.setAttribute("style", "background:url('" + iconUrl + "') no-repeat 0px 0px !important;");
            dl_div.className = 'play_new';
            dl_div.appendChild(dl_a);



            tr = play_btn.parentNode.parentNode;
            before_ins = tr.childNodes[3]; //third one is "info" td, insert before it

            fresh_td = document.createElement('td');
            fresh_td.setAttribute('style', 'padding-top:6px; padding-right:6px; ');
            fresh_td.appendChild(dl_div);
            tr.insertBefore(fresh_td, before_ins);
    });
}

function getVideoElem() {
    return document.getElementsByName('video_player');
}
getAudioElemList() ;
