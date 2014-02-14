define(["SoundPlayer", "Colors", "Greetings"], function (SoundSystem, Colors, Greetings) {
    var scene = new THREE.Scene();
    var intensity = 0.5;
    var distance = 50;

    var camera = new THREE.PerspectiveCamera(70, window.screen.availWidth / window.screen.availHeight, 0.5, 2000);
    camera.position.z = 1;
    camera.lookAt(new THREE.Vector3());

    // Create cube grid

    var cubeWidth = 1.2;
    var screenHeight = 9;
    var screenWidth = 200;
    var cubes = [];

    console.log(Greetings);



    var lightSystem = new THREE.Object3D();
    var light = new THREE.PointLight(0xAAAAFF, intensity, distance);
    light.position.z = -15;


    var light2 = new THREE.PointLight(0xAAAAFF, intensity, distance);
    light.position.z = 15;


    lightSystem.add(light);
    lightSystem.add(light2);

    scene.add(lightSystem);



    var litMaterial = new THREE.MeshBasicMaterial({
        color: Colors.orange
    });

    var unlitMaterial = new THREE.MeshPhongMaterial({
        color: Colors.darkOrange
    });

    var cubeSystem = new THREE.Object3D();
    _.each(_.range(0, screenHeight), function(y){
        cubes[y] = [];
        _.each(_.range(0, screenWidth), function(x){
            var cube = new THREE.Mesh(
                new THREE.CubeGeometry(1, 1, 0.3),
                Greetings[y][x] ? litMaterial : unlitMaterial
            );

            cube.position.x = -(screenWidth * cubeWidth / 2 - cubeWidth) + x * cubeWidth;
            cube.position.y = (screenHeight * cubeWidth / 2 - cubeWidth) - y * cubeWidth;
            cubeSystem.add(cube);
            cubes[y][x] = cube;
        })
    });

    scene.add(cubeSystem);

    var offset = -200;
    var cameraMoveSpeed = 0.1;
    var cubeSystemRotation = 0;
    var cubeSystemTilt = 0;
    var orangeColor = new THREE.Color(Colors.orange);
    return {
        camera: camera,
        scene: scene,
        render: function () {
            camera.position.z += cameraMoveSpeed;

            offset +=1;
            _.each(_.range(0, screenHeight), function(y){
                _.each(_.range(0, screenWidth), function(x){
                    var cube = cubes[y][x];
                    cube.material = Greetings[y][x+Math.floor(offset)] ? litMaterial : unlitMaterial;
                })
            });
            if(camera.position.z > 15){
                cameraMoveSpeed *= 0.99;
            }

            lightSystem.rotation.y += 0.01;
            lightSystem.rotation.x += 0.01;

            cubeSystem.rotation.y = Math.sin(cubeSystemRotation += 0.005) * 0.6;
            cubeSystem.rotation.x = Math.sin(cubeSystemTilt += 0.003) * 0.3;

        },
        init: function(){
        },
        keyEvent: function(){}
    };



});