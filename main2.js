// const THREE = require("./three.min copy");

Physijs.scripts.worker = 'js/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js'

var container,
    projector,
    camera, controls, scene, renderer,
    light, objects;


objects =[];
function initScene() {
    console.log( '[START] initScene' );
    projector = new THREE.Projector();

    container = document.getElementById( 'container' );

    /* Init the camera */
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 1000 );
    camera.position.set(0,2,0);
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0,0,0));




    /* Init the scene */
    scene = new Physijs.Scene();
    scene.setGravity( new THREE.Vector3( 0, -8.0, 0 ));
    scene.addEventListener( 'update', function() {
        scene.simulate( undefined, 1 );
    } );


    /* Create our immovable platform */
    var ground_material = Physijs.createMaterial(
        new THREE.MeshPhongMaterial( {
            // ambient : 0x999999,
            color   : 0xFFFFFF,
            specular: 0x101010
        } ),
        1.0, 1.0
    );






// Light
light = new THREE.DirectionalLight( 0xFFFFFF );
light.position.set( 20, 40, -15 );
light.target.position.copy( scene.position );
light.castShadow = true;
light.shadowCameraLeft = -60;
light.shadowCameraTop = -60;
light.shadowCameraRight = 60;
light.shadowCameraBottom = 60;
light.shadowCameraNear = 20;
light.shadowCameraFar = 200;
light.shadowBias = -.0001
light.shadowMapWidth = light.shadowMapHeight = 2048;
light.shadowDarkness = .7;
scene.add( light );




var ground = new Physijs.BoxMesh( new THREE.BoxGeometry( 4, 0.01, 8 ), ground_material, 0 );
    ground.position.set( 0, -0.5, 0 );
    ground.receiveShadow = true;
    ground.castShadow = true;


    scene.add( ground );
    // Bumpers
    var bumper,
        bumper_geom = new THREE.BoxGeometry(0.01, 0.5, 5);

    bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    bumper.position.y = -0.2;
    bumper.position.x = -1.5;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add( bumper );

    bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    bumper.position.y = -0.2;
    bumper.position.x = 1.5;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add( bumper );

    bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    bumper.position.y = -0.2;
    bumper.position.z = -2.2;
    bumper.rotation.y = Math.PI / 2;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add( bumper );

    bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    bumper.position.y = -0.2;
    bumper.position.z = 2.2;
    bumper.rotation.y = Math.PI / 2;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add( bumper );



        var lastfew = 0;
    /* Create drops */
    for ( var i = 0; i < 3; i++ )  {

        scene.add( createDrop() );
        if(i == 2){
            lastThree();
        }
    }

    function lastThree(){
        for (let index = 0; index < 3; index++) {

            scene.add( createDrop(lastfew) );
            lastfew++;

        }

    }




    /* Init the renderer */
    renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput  		= true;
    renderer.gammaOutput 		= true;
    renderer.shadowMap.Enabled 	= true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.CullFace 	= THREE.CullFaceBack;

    container.appendChild( renderer.domElement );

    scene.simulate();
    console.log( '[END] initScene' );
    console.log( objects );



    //  hover over the last 3 balls and scale up
    // const domEvents = new THREEx.DomEvents(camera, renderer.domElement)
    // objects.forEach(element => {
    //     domEvents.addEventListener(element, "mouseover", event =>{
    //         console.log(element.position);
    //         container.style.cursor = "pointer";
    //         element.scale.y = 1.2;
    //         element.scale.x = 1.2;
    //         element.scale.z = 1.2;
    //     })
    //     domEvents.addEventListener(element, "mouseout", event =>{
    //         console.log(element.position);
    //         container.style.cursor = "default";
    //         element.scale.y = 1;
    //         element.scale.x = 1;
    //         element.scale.z = 1;
    //     })
    // });







    function moveThreeBalls(element, x , y , z) {
        setTimeout(() => {
            var tween = new TWEEN.Tween(element.position)
            .to(element.position.clone().setX(x).setY(y).setZ(z), 2000)
            tween.start();
            // element.__dirtyPosition = undefined;
            tween.onComplete(function(element) {
                console.log('done!')
                scene.setGravity(new THREE.Vector3(0, 8, 0));
                // element.__dirtyPosition = true;
              setTimeout(() => {
                scene.setGravity(new THREE.Vector3(0, 0, 0));
              },100 )

            });}, 1000);


      }


    //  var  testing = function (){
    // 	moveThreeBalls(objects[0],0,1,0);
    // 	moveThreeBalls(objects[1],1,0,0);
    // 	moveThreeBalls(objects[2],0,0,1);
    //   }
        moveThreeBalls(objects[0],-0.5,0.2,1.2);
        moveThreeBalls(objects[1],-0.5,0.2,0);
        moveThreeBalls(objects[2],-0.5,0.2,-1.2);


}

//  mover the 3 balls into position





function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();
}

/* Create object that drops from the heaven! */
function createDrop(lastfew) {
    // var color = new THREE.Color( Math.random() * 1.0, Math.random() * 1.0, Math.random() * 1.0 );

    var color = new THREE.Color( 0x5b5b5b);
    var material = Physijs.createMaterial(
        new THREE.MeshPhongMaterial( {
            // ambient  : color,
            color    : color,
            specular : 0xAAAAAA,
            shininess: 30
        } ),
        0.4, 0.5
    );

    /* Create spheres */
    var drop = new Physijs.SphereMesh(
        new THREE.SphereGeometry( 0.12, 15, 15 ),
        material, 1.0
    );

    /* Randomly position drops in the sky */
    drop.position.set(
        Math.random() * 2 - 1.0,
        Math.random() * 4 + 1.5,
        Math.random() * 2 - 1.0
    );

    /* Uncomment this, if you want to use cubes */
    // drop.rotation.set(
    // 	Math.random() * Math.PI * 2,
    // 	Math.random() * Math.PI * 2,
    // 	Math.random() * Math.PI * 2
    // );
    drop.__dirtyPosition = true;
    drop.receiveShadow = true;
    drop.castShadow = true;
    // objects.push(drop);
    if (lastfew !== undefined){
        console.log("hi");
        drop.material = Physijs.createMaterial(
            new THREE.MeshPhongMaterial( {
                // ambient  : color,
                color    : 0xff0000,
                specular : 0xAAAAAA,
                shininess: 30
            } ),
            0.4, 0.5
        );
        drop.position.set(
            Math.random(),
            6,
            Math.random()
        );
        objects.push(drop);
    }
    return drop
}

/* Create the directional light that casts shadows */
// function createShadowedLight( x, y, z, color, intensity ) {
// 	var directional_light = new THREE.DirectionalLight( color, intensity );
// 	directional_light.position.set( x, y, z );
// 	directional_light.castShadow = true;

    /* Parameters for shadow casting */
    // var d = 1.5;
    // directional_light.shadowCameraLeft   = -d;
    // directional_light.shadowCameraRight  =  d;
    // directional_light.shadowCameraTop    =  d;
    // directional_light.shadowCameraBottom = -d;

    // directional_light.shadowCameraNear 	= 0.01;
    // directional_light.shadowCameraFar 	= 5;

    // directional_light.shadowMapWidth 	= 1024;
    // directional_light.shadowMapHeight 	= 1024;

    // directional_light.shadowBias 	 	= -0.0001;
    // directional_light.shadowDarkness 	= 0.55;

    // return directional_light;
// }

async function animate() {
    requestAnimationFrame( animate );
    // render();
    // controls.update();

    await renderer.render( scene, camera );

    TWEEN.update();
}

// function render() {
    /* Rotate the directional lights */
// 	light_1.position.x = 1.0 * Math.cos( light_rotation_1 );
// 	light_1.position.z = 2.0 * Math.sin( light_rotation_1 );

// 	light_2.position.x = 0.5 * Math.cos( light_rotation_2 );
// 	light_2.position.z = 0.8 * Math.sin( light_rotation_2 );

// 	light_rotation_1 += 0.001;
// 	light_rotation_2 += 0.01;

// 	renderer.render( scene, camera );
// }


initScene();
animate();




// light place holder


				// light_1
                let   light_1 = new THREE.DirectionalLight( redlight );
                // buggy light shadow
                             light_1.position.set(0, 528, 495 );
                             light_1.castShadow = true;
                             light_1.intensity = 0.74;
                            //  was 0.74
                            //  light_1.intensity = 0;

                            //  light_1.shadow.mapSize.width = 5500;
                            //  light_1.shadow.mapSize.height = 5500;

                            //  light_1.shadow.camera.near = 10;
                            //  light_1.shadow.camera.far = 2000;
                            //  light_1.shadow.camera.left = 2500;
                            //  light_1.shadow.camera.right = -2500;
                            //  light_1.shadow.camera.top = 2500;
                            //  light_1.shadow.camera.bottom = -2500;
                                scene.add( light_1 );

                                // light shadow working
                              let  light = new THREE.DirectionalLight( redlight );

                                light.position.set(0, 528, -614 );

                    light.castShadow = true;
                    // light.intensity = 0;
                    light.intensity = 0.54;

                    // light.shadow.mapSize.width = 1900;
                    // light.shadow.mapSize.height = 1900;

                    // light.shadow.camera.near = 1;
                    // light.shadow.camera.far =1500;
                    // light.shadow.camera.left = 1500;
                    // light.shadow.camera.right = -1500;
                    // light.shadow.camera.top = 1500;
                    // light.shadow.camera.bottom = -1500;
                                // scene.add( light );

                                // light_4 working shadow bit off on platform
                              let  light_4 = new THREE.DirectionalLight(whitelight);

                                light_4.position.set(0, 414, 444);
                                light_4.castShadow = true;
                                light_4.intensity = 0.66;
                                // light_4.intensity = 0;

                                light_4.shadow.mapSize.width = 2048;
                                light_4.shadow.mapSize.height = 2048;

                                light_4.shadow.camera.near = 1;
                                light_4.shadow.camera.far = 1500;
                                // light_4.shadow.camera.left = 600;
                                // light_4.shadow.camera.right = -600;
                                // light_4.shadow.camera.top = 500;
                                // light_4.shadow.camera.bottom = 50;
                                // scene.add( light_4 );




                            let light_3 = new THREE.DirectionalLight( redlight );

                            light_3.position.set(0, 0, 177 );
                            light_3.castShadow = true;
                            light_3.intensity = 0.52;
                            // light_3.intensity = 0;

                // light_3.shadow.mapSize.width = 5500;
                // light_3.shadow.mapSize.height = 5500;

                // light_3.shadow.camera.near = 1;
                // light_3.shadow.camera.far = 5500;
                // light_3.shadow.camera.left = 500;
                // light_3.shadow.camera.right = -500;
                // light_3.shadow.camera.top = 500;
                // light_3.shadow.camera.bottom = -500;
                            // scene.add( light_3 );