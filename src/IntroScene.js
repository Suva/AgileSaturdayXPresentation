define(["Colors", "Keys", "SoundPlayer"], function(Colors, Keys, SoundPlayer){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.screen.availWidth / window.screen.availHeight, 0.1, 1000);
    var isStarted = false;
    var mars = null;

    var panelMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("images/intro_image.png"),
        transparent: true,
        opacity: 1
    });

    var panel = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        panelMaterial
    );

    panel.position.z = -5;

    (new THREE.JSONLoader()).load('objects/mars.js', function (geometry, materials) {
        mars = new THREE.Mesh(geometry, materials[0]);
        mars.position.x = -5;
        scene.add(mars);
    });

    scene.add(new THREE.PointLight(0xFFFFFF, 1, 100));

    createStarSystem();
    scene.add(panel);

    return {
        camera: camera,
        scene: scene,
        render: function () {
            if(isStarted){
                panel.position.z-=0.05;
                panel.rotation.x-=0.01;
                panel.rotation.y+=0.01;
                panel.material.opacity = Math.max(panel.material.opacity - 0.001, 0);
                panel.material.needsUpdate = true;
                camera.rotation.y +=0.001;
                camera.position.x -=0.002;
            }
            if(mars){
                mars.rotation.y += 0.001;
            }
        },
        keyEvent: handleKeyEvent
    };

    function startAnimation() {
        isStarted = true;
        SoundPlayer.play();
    }

    function handleKeyEvent(event){
        console.log(event.keyCode);
        switch(event.keyCode){
            case Keys.PAGE_UP:
                startAnimation();
                break;
        }
    }

    // TODO Refactor this to separate class
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

});