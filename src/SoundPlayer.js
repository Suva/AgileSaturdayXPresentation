define([], function () {
    var listeners = [];
    var audioElement = null;
    var lastBar = 0;

    return {
        load: function(file){
            audioElement = new Audio(file);
            return {
                audioElement: audioElement,
                play: function(){
                    audioElement.play()
                }

            }
        },
        addListener: function(callback){
            listeners.push(callback);
        },
        update: function(){
            if(audioElement && !audioElement.paused){
                var bar = Math.floor(audioElement.currentTime * (120 / 60) / 4 + 1);
                if(bar != lastBar){
                    lastBar = bar;
                    _.each(listeners, function(callback){
                        callback(bar);
                    })
                }
            }
        }
    }
});