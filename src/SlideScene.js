define(["Colors", "Slides"], function(Colors, Slides){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.screen.availWidth / window.screen.availHeight, 0.1, 1000);
    var frame = null;
    var currentSlide = 0;

    var panelMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("slides/" + Slides[currentSlide]),
        transparent: true,
        opacity: 0.9
    });

    var frameMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0xFFFFFF,
        shininess: 20
    });

    var lightContainer = createLightSystem();
    var particles = createStarSystem();
    createImageFrame();

    var particleRot = 0;
    var framerot = 0;
    var camrot = 0;
    var lightRot = 0;

    return {
        camera: camera,
        scene: scene,
        render: function () {
            if (frame) {
                frame.position.y =
                frame.rotation.x =
                frame.rotation.y =
                     (Math.sin(framerot += THREE.Math.randFloat(-0.01, 0.03)) * 0.01);

            }

            lightContainer.rotation.z =
            lightContainer.rotation.y = lightRot +=0.003;

            particles.rotation.x =
            particles.rotation.y =
            particles.rotation.z =
                particleRot += 0.0001;

            camera.rotation.y =
            camera.rotation.x =
                (Math.sin(camrot += THREE.Math.randFloat(-0.01, 0.03)) * 0.01);

        },
        keyEvent: handleKeyEvent

    };

    function handleKeyEvent(event){
        const KEY_SPACE = 32;
        const KEY_BACKSPACE = 8;

        switch(event.keyCode){
            case KEY_SPACE:
                switchToNextSlide();
                break;
            case KEY_BACKSPACE:
                switchToPreviousSlide();
                break;
        }
    }

    function switchToNextSlide() {
        if(Slides[currentSlide + 1]){
            panelMaterial.map = THREE.ImageUtils.loadTexture("slides/" + Slides[++currentSlide]);
            panelMaterial.map.needsUpdate = true;
        }
    }

    function switchToPreviousSlide() {
        if (Slides[currentSlide - 1]) {
            panelMaterial.map = THREE.ImageUtils.loadTexture("slides/" + Slides[--currentSlide]);
            panelMaterial.map.needsUpdate = true;
        }
    }

    function createImageFrame() {
        (new THREE.JSONLoader()).load('objects/image_frame.js', function (geometry, materials) {
            var object = new THREE.Mesh(geometry, frameMaterial);

            panelMaterial.map.needsUpdate = true;

            var slidePlane = new THREE.Mesh(
                new THREE.PlaneGeometry(16 / 7, 9 / 7),
                panelMaterial
            );

            var slideObject = new THREE.Object3D();
            slideObject.add(object);
            slideObject.add(slidePlane);

            slideObject.position.x = 0;
            slideObject.position.y = 0;
            slideObject.position.z = -1.3;

            frame = slideObject;
            scene.add(slideObject);
        });
    }

    function getRandomStarPosition() {
        return (THREE.Math.randInt(0, 1) ? 1 : -1) * Math.random() * 900 + 100;
    }

    function createStarSystem() {
        var geo = new THREE.Geometry();
        var colors = [];
        _.each(_.range(1, 5000), function () {
            geo.vertices.push(new THREE.Vector3(
                getRandomStarPosition(),
                getRandomStarPosition(),
                getRandomStarPosition()
            ));
            var color = new THREE.Color(0xffffff);
            color.setHSL(Math.random(), 0.5, 0.9);
            colors.push(color);
        });
        geo.colors = colors;
        var sprite = THREE.ImageUtils.loadTexture("images/star.png");
        var particleSystemMaterial = new THREE.ParticleSystemMaterial({
            map: sprite,
            size: 15,
            blending: THREE.AdditiveBlending,
            transparent: true,
            vertexColors: true
        });
        var particles = new THREE.ParticleSystem(geo, particleSystemMaterial);
        scene.add(particles);
        return particles;
    }

    function createLightSystem() {
        var light = new THREE.PointLight(0xccccFF, 1, 100);
        var light2 = new THREE.PointLight(0xFFFFcc, 1, 100);
        var light3 = new THREE.PointLight(0xFFFFFF, 1, 100);
        light.position = new THREE.Vector3(30, 0, 0);
        light2.position = new THREE.Vector3(-30, 0, 0);
        light3.position = new THREE.Vector3(0, 60, 0);
        var lightContainer = new THREE.Object3D();
        lightContainer.add(light);
        lightContainer.add(light2);
        lightContainer.add(light3);
        scene.add(lightContainer);
        return lightContainer;
    }
});