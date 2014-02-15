require([
    "Colors",
    "SlideScene",
], function(
    Colors,
    SlideScene
) {
    var scene = null;

    var renderer = new THREE.WebGLRenderer( { antialias: false, clearAlpha: 1 } );
    renderer.autoClear = false;

    $(window).resize(resizeViewport);

    document.body.appendChild( renderer.domElement );

    resizeViewport();

    var renderModel = new THREE.RenderPass();

    setScene(SlideScene);

    var composer = InitializeComposer();

    $("body").keyup(function(event){ scene.keyEvent(event); event.preventDefault(); });

    startRenderer();

    function startRenderer(){
        var x = 0;

        function render() {
            scene.render();
            requestAnimationFrame(render);
            renderer.clear();
            composer.render(0.5);
        }
        render();
    }

    function InitializeComposer() {
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        var effectBloom = new THREE.BloomPass(0.7);
        var effectVignette = new THREE.ShaderPass(THREE.VignetteShader);
        var width = window.innerWidth || 2;
        var height = window.innerHeight || 2;
        effectCopy.renderToScreen = true;
        var composer = new THREE.EffectComposer(renderer);
        composer.addPass(renderModel);
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