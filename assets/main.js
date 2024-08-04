/* - - - - - - - - - - - Start of YouTube Song Selector Code - - - - - - - - - - - */
var playList = [
    "f73lv_ZUc90",
    "lWFpjs2OAyA",
];

var player = null;
var currentPlay = 0;
var subMap = null;
var currentSub = 0;
var nowPlaying = null;
function playV(yt_id, num){
    $("#btnArea").css("display", "none")
    if(player == null){
        $("#VidArea").css("height",$("#VidArea").width() / 16 * 9 + "px");
        player = new YT.Player("player",{
            videoId:yt_id,
            playerVars:{
                autoplay:1, //是否自動撥放
                controls:1, //是否顯示控制項
                //start:playTime[currentPlay][0],//開始秒數
                //end:playTime[currentPlay][1],//結束秒數
                iv_load_policy:3,
                suggestedQuality:"hd720",
            },
            events:{
                //onReady:onPlayerReady,
                onStateChange:onPlayerReady,
            }
        });
    }else if(nowPlaying != yt_id) {
        player.loadVideoById({
            videoId:yt_id,
            //startSeconds:playTime[currentPlay][0],
            //endSeconds:playTime[currentPlay][1],
            suggestedQuality:"hd720",
        });
    }
    jQuery.get('./subs/S1E'+num+'.mod.srt', function(data) {
        //console.log(data)
        subMap = parseSrt(data)
        //console.log(subMap)
    });
    setInterval(refreshSrt, 100)
    nowPlaying = yt_id
}
function refreshSrt()
{
    currentTime = player.getCurrentTime()
    if(currentSub >= subMap.length){
        $("#subArea").text("")
    }
    else if(currentTime < subMap[currentSub].start)
    {
        $("#subArea").text("")
    }
    else if(currentTime >= subMap[currentSub].start && currentTime <= subMap[currentSub].end)
    {
        $("#subArea").html(subMap[currentSub].text.replace('\n', '<br />'))
        //console.log(subMap[currentSub].text)
    }
    else if(currentTime > subMap[currentSub].end)
    {
        currentSub += 1
        if(currentSub >= subMap.length){
            $("#subArea").text("")
        }
        else if(currentTime < subMap[currentSub].start)
        {
            $("#subArea").text("")
        }
        else if(currentTime >= subMap[currentSub].start && currentTime <= subMap[currentSub].end)
        {
            $("#subArea").html(subMap[currentSub].text.replace('\n', '<br />'))
        }
    }
}

function onPlayerReady(){
    currentTime = player.getCurrentTime()
    for(var i = 0; i < subMap.length; ++i)
    {
        if(currentTime <= subMap[i].end)
        {
            currentSub = i;
            break;
        }
    }
    //console.log(player.getCurrentTime())
    // if(Math.floor(player.getCurrentTime())==playTime[currentPlay][1]){
    //     if(currentPlay<playList.length-1)
    //     {
    //         currentPlay++;
    //     }
    //     else
    //     {
    //         currentPlay=0;
    //     }
    //     player.loadVideoById({
    //         videoId:playList[currentPlay],
    //         startSeconds:playTime[currentPlay][0],
    //         endSeconds:playTime[currentPlay][1],
    //         suggestedQuality:"hd720",
    //     });
    // }
}

function srtTimeToSeconds(time) {
    var match = time.match(/(\d\d):(\d\d):(\d\d),(\d\d\d)/);
    var hours        = +match[1],
        minutes      = +match[2],
        seconds      = +match[3],
        milliseconds = +match[4];

    return (hours * 60 * 60) + (minutes * 60) + (seconds) + (milliseconds / 1000);
}

function parseSrtLine(line) {
    var match = line.match(/(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)\n([\S\s]*)/m);

    return {
        start: srtTimeToSeconds(match[1]),
        end:   srtTimeToSeconds(match[2]),
        text:  match[3].trim()
    };
}

function parseSrt(srt) {
    var lines = srt.replaceAll('\r', '').split(/(?:^|\n\n)\d+\n|\n+$/g).slice(1, -2);
    return $.map(lines, parseSrtLine);
}

function changeBtn(value, yt_id, num)
{
    if(player == null)
    {
        txt = "開始播放第"+value+"集"
        $("#btnArea").html('<input type="button" id="playBtn" value="'+txt+'" onclick="playV(\''+yt_id+'\', '+num+')"/>')
    }
    else
    {
        playV(yt_id, num)
    }
}
/* - - - - - - - - - - - End of YouTube Song Selector Code - - - - - - - - - - - */
