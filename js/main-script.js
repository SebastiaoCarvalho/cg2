//////////////////////tempcam
/* GLOBAL VARIABLES */
//////////////////////
var mainCamera, renderer, scene, cameras;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    const backgroundColor = new THREE.Color('rgb(200, 255, 255)');

    scene = new THREE.Scene();
    scene.background = backgroundColor;
    scene.add(new THREE.AxisHelper(10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    cameras = [];
    /*camera = new THREE.OrtographicCamera(window.innerWidth / - 2, window.innerWidth / 2, 
                                            window.innerHeight / 2, window.innerHeight / - 2, 
                                            1, 1000 );*/
    var tempCamera;
    tempCamera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    tempCamera.position.x = 50;
    tempCamera.position.y = 50;
    tempCamera.position.z = 50;
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);

    mainCamera = tempCamera;

    tempCamera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    tempCamera.position.x = 70;
    tempCamera.position.y = 50;
    tempCamera.position.z = 50;
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);

    tempCamera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    tempCamera.position.x = 90;
    tempCamera.position.y = 50;
    tempCamera.position.z = 50;
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);

    tempCamera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    tempCamera.position.x = 30;
    tempCamera.position.y = 50;
    tempCamera.position.z = 50;
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);

    tempCamera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    tempCamera.position.x = 10;
    tempCamera.position.y = 50;
    tempCamera.position.z = 50;
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);
    console.log(cameras)
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
    renderer.render(scene, mainCamera);
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

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);
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
    if (49 <= e.keyCode && e.keyCode <= 53) {
        mainCamera = cameras[e.keyCode - 49];
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}