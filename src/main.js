require([
    "Colors",
    "SlideScene",
    "IntroScene",
    "SoundPlayer",
    "RoomScene",
    "CubeScrollerScene"
], function(
    Colors,
    SlideScene,
    IntroScene,
    SoundPlayer,
    RoomScene,
    CubeScrollerScene
) {
    var scene = null;

    SoundPlayer.load("sounds/demo-tech.mp3");

    var renderer = new THREE.WebGLRenderer( { antialias: false, clearAlpha: 1 } );
    renderer.autoClear = false;

    $(window).resize(resizeViewport);

    document.body.appendChild( renderer.domElement );

    resizeViewport();

    var renderModel = new THREE.RenderPass();

    setScene(CubeScrollerScene);

    var composer = InitializeComposer();

    $("body").keyup(function(event){ scene.keyEvent(event); event.preventDefault(); });

    SoundPlayer.addListener(function(bar){
        if(bar == 16){
            $("canvas").hide();
            $("body").css("background", "#000082");
            $("#bsod").show();
        }
        if(bar == 17){
            $("canvas").show();
            $("body").css("background", "black");
            $("#bsod").hide();
            setScene(RoomScene);
        }
        if(bar == 33){
            setScene(CubeScrollerScene);
        }
        if(bar == 49){
            setScene(SlideScene);
        }
    });

    startRenderer();

    function startRenderer(){
        var x = 0;

        function render() {
            SoundPlayer.update()
            scene.render();
            requestAnimationFrame(render);
            renderer.clear();
            composer.render(0.5);
        }
        render();
    }

    function InitializeComposer() {
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        var effectBloom = new THREE.BloomPass(1.3);
        var effectVignette = new THREE.ShaderPass(THREE.VignetteShader);
        var width = window.innerWidth || 2;
        var height = window.innerHeight || 2;
        effectFXAA.uniforms[ 'resolution' ].value.set(1 / width, 1 / height);
        effectCopy.renderToScreen = true;
        var composer = new THREE.EffectComposer(renderer);
        composer.addPass(renderModel);
        composer.addPass(effectFXAA);
        composer.addPass(effectBloom);
        composer.addPass(effectVignette);
        composer.addPass(effectCopy);
        return composer;
    }

    function resizeViewport() {
        var width = window.innerWidth;
        var height = width * (9 / 16);
        var position = (window.innerHeight - height) / 2;
        renderer.setSize(width, height);
        $("canvas").css("margin-top", position + "px");
    }

    function setScene(newScene) {
        if(scene && scene.destruct) {scene.destruct()}
        scene = newScene;
        if(scene.init) {scene.init()}
        renderModel.scene = scene.scene;
        renderModel.camera = scene.camera;
    }

});