define(["SoundPlayer"], function(SoundSystem){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.screen.availWidth / window.screen.availHeight, 0.1, 1000);
    var room = null;

    camera.position.y = 2;
    camera.position.z = 5;

    (new THREE.JSONLoader()).load('objects/room.js', function (geometry, materials) {
        room = new THREE.Mesh(geometry, materials[0]);
        room.scale = new THREE.Vector3(2, 2, 2);
        scene.add(room);
    });

    var lightSystem = new THREE.Object3D();

    var distance = 6;
    var intensity = 1;

    var spriteMaterial = new THREE.SpriteMaterial({
        map: THREE.ImageUtils.loadTexture('images/star.png')
    });

    var position = 2;

    var light = new THREE.PointLight(0xFFAAAA, intensity, distance);
    light.position = new THREE.Vector3(-position, 0, 0);
    var lightObject = new THREE.Sprite(spriteMaterial)
    lightObject.position = new THREE.Vector3(-position, 0, 0);
    lightSystem.add(light);
    lightSystem.add(lightObject);

    var light2 = new THREE.PointLight(0xAAAAFF, intensity, distance);
    light2.position = new THREE.Vector3(position, 0, 0);
    var lightObject2 = new THREE.Sprite(spriteMaterial)
    lightObject2.position = new THREE.Vector3(position, 0, 0);

    lightSystem.add(light2);
    lightSystem.add(lightObject2);
    lightSystem.position.y = 2;

    scene.add(lightSystem);

    var spriteMaterials = loadSpriteMaterials([
        "just-kidding",
        "hope-i-didnt-scare-you",
        'it-would-be-quite-shameful',
        'if-it-actually-crashed'
    ]);
    var spriteMaterialNumber = 0;


    var sign = new THREE.Sprite(spriteMaterials[spriteMaterialNumber]);

    sign.scale = new THREE.Vector3(3, 2, 2);
    sign.position = new THREE.Vector3(0, 2, 0);
    scene.add(sign);

    var axis = new THREE.Vector3(0,2,0);
    var radius = 5;
    var camrot = 0;
    var turnLeft = true;
    var skipNextTurn = true;

    function changeSpriteMaterial() {
        if (spriteMaterials[++spriteMaterialNumber]) {
            sign.material = spriteMaterials[spriteMaterialNumber];
        } else {
            scene.remove(sign);
        }
    }

    var hue = 0;
    return {
        camera: camera,
        scene: scene,
        render: function () {
            lightSystem.rotation.y += 0.01;
            lightSystem.rotation.z += 0.01;
            lightSystem.rotation.x += 0.01;
            light.position.x = Math.sin(camrot);
            camrot += turnLeft?0.001:-0.001;
            camera.position.x = axis.x + radius * Math.cos( camrot );
            camera.position.z = axis.z + radius * Math.sin( camrot );
            camera.lookAt( axis );

            light.intensity = Math.max(intensity, light.intensity - 0.03);
            light.distance = Math.max(distance, light.distance - 0.03);

            light2.intensity = Math.max(intensity, light2.intensity - 0.03);
            light2.distance = Math.max(distance, light2.distance - 0.03);

            lightObject.scale.y = light.intensity;
            lightObject.scale.x = light.intensity;

            lightObject2.scale.y = light2.intensity;
            lightObject2.scale.x = light2.intensity;

            hue = hue+0.01
            if(hue > 1) hue -= 1;
            light.color.setHSL(hue, 1, 0.9);
            lightObject.material.color.setHSL(hue, 1, 0.9);

            light2.color.setHSL(1 - hue, 1, 0.9);
            lightObject2.material.color.setHSL(hue, 1, 0.9);

        },
        init: function(){
            SoundSystem.addListener(function(bar){
                if((bar - 1) % 2) return;
                if(skipNextTurn){
                    skipNextTurn = false;
                    return;
                }

                changeSpriteMaterial();

                radius = Math.random() * 3 + 2;
                camrot += Math.PI / 2;
                turnLeft = !turnLeft;
            });
            SoundSystem.addBeatListener(function(bar, beat){
                console.log(beat);
                var hue = Math.random();
                if(beat%2){
                    light.intensity = intensity + 1;
                    light.distance = distance + 2;
                } else {
                    light2.intensity = intensity + 1;
                    light2.distance = distance + 2;
                }
            })
        },
        keyEvent: function(){}
    };

    function loadSpriteMaterials(fnames) {
        return _.map(fnames, function(fname){
            return new THREE.SpriteMaterial({
                map: THREE.ImageUtils.loadTexture('images/'+fname+'.png')
            });
        })
    }
});