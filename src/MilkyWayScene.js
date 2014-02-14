define(["SoundPlayer"], function(SoundSystem){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 70, window.screen.availWidth / window.screen.availHeight, 0.5, 1000);
    var skySphere = null;

    camera.position.y = 20;
    camera.position.z = 20;



    (new THREE.JSONLoader()).load('objects/milkyway.js', function (geometry, materials) {
        skySphere = new THREE.Mesh(geometry, materials[0]);
        skySphere.scale = new THREE.Vector3(20, 20, 20);
        scene.add(skySphere);
    });

    var sandTexture = THREE.ImageUtils.loadTexture("images/sand.jpg");

    sandTexture.wrapS = THREE.RepeatWrapping;
    sandTexture.wrapT = THREE.RepeatWrapping;

    sandTexture.repeat = new THREE.Vector2(5,5);


    var groundPlane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 20, 20), new THREE.MeshLambertMaterial({
        map: sandTexture,
        normalMap: sandTexture
    }));

    groundPlane.rotation.x = -(Math.PI / 2);
    groundPlane.scale = new THREE.Vector3(10, 10, 10);
    scene.add(groundPlane);
    groundPlane.position.y = 10;

    var light = new THREE.PointLight(0xFFFFFF, 1, 30);
    scene.add(light);

    light.position.y = 20;



    var lookHeight = 20;
    var lookdirection = 0;
    return {
        camera: camera,
        scene: scene,
        render: function () {
            sandTexture.offset.y += 0.001;
            sandTexture.needsUpdate = true;
            camera.lookAt(new THREE.Vector3(lookdirection+=0.01, lookHeight+=0.01, 0));

        },
        init: function(){

        },
        keyEvent: function(){}
    };

})