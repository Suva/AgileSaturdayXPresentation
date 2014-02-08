require(["Colors"], function(Colors){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.screen.availWidth / window.screen.availHeight, 0.1, 1000 );
    var cylinder = null;

    var renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.autoClear = false;

    var cube = new THREE.Mesh(
        new THREE.CubeGeometry(5, 5, 5),
        new THREE.MeshPhongMaterial({
            color: Colors.orange,
            emissive: 0x050505,
            specular: 0x666666
        })
    );
    cube.position.z = -10;
    scene.add(cube);

    var light = new THREE.PointLight(
        0xFFFFFF, 0.5, 100
    );
    light.position.x = 0;
    light.position.y = 15;
    scene.add(light);

    var light2 = new THREE.PointLight(
        0xFFFFFF, 0.5, 100
    );

    light2.position.x = -5;
    light2.position.y = -0;
    light2.position.z = 0;
    scene.add(light2)

    function createSurroundingCylinder() {
        (new THREE.JSONLoader()).load('objects/cylinder.js', function (geometry, materials) {
            var material = materials[0];
            cylinder = new THREE.Mesh(geometry, material);

            cylinder.position.x = 0;
            cylinder.position.y = -2;

            scene.add(cylinder);
        });
    }

    createSurroundingCylinder();

    $(window).resize(resizeViewport);

    document.body.appendChild( renderer.domElement );

    resizeViewport();
    var composer = InitializeComposer();
    startRenderer();

    function startRenderer(){
        var x = 0;
        function render() {
            cube.rotation.x = x+=0.01;
            cube.rotation.z = x;
            camera.rotation.y = x;

            if(false && cylinder){
                cylinder.rotation.x = x;
                cylinder.rotation.z = x;
            }

            requestAnimationFrame(render);

            renderer.clear();
            composer.render(0.5);
        }
        render();
    }

    function InitializeComposer() {
        var renderModel = new THREE.RenderPass(scene, camera);
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
});