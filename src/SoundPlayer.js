define([], function () {
    var listeners = [];
    var beatListeners = [];
    var audioElement = null;
    var lastBar = 0;
    var lastBeat = 0;

    return {
        load: function(file){
            audioElement = new Audio(file);
        },
        play: function(){
            audioElement.play()
        },
        addListener: function(callback){
            listeners.push(callback);
        },
        addBeatListener: function(callback){
            beatListeners.push(callback);
        },
        update: function(){
            if(audioElement && !audioElement.paused){
                var bar = Math.floor((audioElement.currentTime + 0.1) * (120 / 60) / 4 + 1);
                if(bar != lastBar){
                    lastBar = bar;
                    _.each(listeners, function(callback){
                        callback(bar);
                    })
                }
                var beat = Math.floor((audioElement.currentTime + 0.1) * (120 / 60)) % 4 + 1;
                if(beat != lastBeat){
                    lastBeat = beat;
                    _.each(beatListeners, function(callback){
                        callback(bar, beat);
                    })
                }

            }
        }
    }
});