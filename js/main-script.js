//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, renderer, scene;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    const backgroundColor = new THREE.Color('skyblue');

    scene = new THREE.Scene();
    scene.background = backgroundColor;
    scene.add(new THREE.AxisHelper(10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    /*camera = new THREE.OrtographicCamera(window.innerWidth / - 2, window.innerWidth / 2, 
                                            window.innerHeight / 2, window.innerHeight / - 2, 
                                            1, 1000 );*/
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}