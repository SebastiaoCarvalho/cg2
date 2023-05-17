//////////////////////tempcam
/* GLOBAL VARIABLES */
//////////////////////
var mainCamera, cameras;
var renderer, scene;
var materials
var trailerBoxMaterial, trailerWheelMaterial;
var globalClock, deltaTime;

var leftArrowPressed, upArrowPressed, rightArrowPressed, downArrowPressed;

var trailer;

const step = 10;

/* Size constants */
const lTrailer = 48, hTrailer = 18, dTrailer = 12;
const rTrailerWheel = 4, hTrailerWheel = 1;
const rTrailerConnector = 2, hTrailerConnector = 2;
const radialSegments = 32;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    const backgroundColor = new THREE.Color('rgb(200, 255, 255)');

    scene = new THREE.Scene();
    scene.background = backgroundColor;
    scene.add(new THREE.AxisHelper(10));

    createTrailer();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    
    const aspect = window.innerWidth / window.innerHeight;
    const left = -100;
    const right = 100;
    const top = 50;
    const down = -50;
    const fov = 70;
    const near = 1;
    const far = 1000;
    const distance = 20;
    var tempCamera;
    cameras = [];
    
    tempCamera = new THREE.OrthographicCamera(left, right, top, 
                                                down, near, far);
    tempCamera.position.set(0,0,distance);
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);
    
    mainCamera = tempCamera;
    
    tempCamera = new THREE.OrthographicCamera(left, right, top, 
                                                down, near, far);
    tempCamera.position.set(distance,0,0);
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);

    tempCamera = new THREE.OrthographicCamera(left, right, top, 
                                                down, near, far);
    tempCamera.position.set(0,distance,0);
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);
    
    tempCamera = new THREE.OrthographicCamera( - distance * aspect, 
                                                    distance * aspect, 
                                                    distance, - distance, near, far);
    tempCamera.position.set(distance, distance, distance); 
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera);

    tempCamera = new THREE.PerspectiveCamera(fov,
                                            aspect,
                                            near,
                                            far); 
    tempCamera.position.set(distance,distance,distance);
    tempCamera.lookAt(scene.position);
    cameras.push(tempCamera); 
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createTrailer() {
    trailer = new THREE.Object3D();
    addBox(trailer, 0, 0, 0);
    
    addWheel(trailer, lTrailer/2 - 5 ,-hTrailer/2, dTrailer/2)
    addWheel(trailer, lTrailer/2 - 14, -hTrailer/2, dTrailer/2);
    addWheel(trailer, lTrailer/2 - 5, -hTrailer/2, -dTrailer/2);
    addWheel(trailer, lTrailer/2 - 14, -hTrailer/2, -dTrailer/2);

    addConnector(trailer, -19, -9 - 1 , 0);
    scene.add(trailer);
}

function addBox(obj, x, y, z) {
    'use strict';
    const box = new THREE.BoxGeometry(lTrailer, hTrailer, dTrailer);
    trailerBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new THREE.Mesh(box, trailerBoxMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y, z) {
    'use strict';
    const wheel = new THREE.CylinderGeometry(rTrailerWheel, rTrailerWheel, hTrailerWheel, radialSegments);
    wheel.rotateX(Math.PI/2);
    trailerWheelMaterial= new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const mesh = new THREE.Mesh(wheel, trailerWheelMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addConnector(obj, x, y, z) {
    'use strict';
    const connector = new THREE.CylinderGeometry(rTrailerConnector, rTrailerConnector, hTrailerConnector, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const mesh = new THREE.Mesh(connector, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}
//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    const margin = 2;
    const trailerXMin = trailer.position.x - lTrailer/2 - margin;
    console.log(trailerXMin);
    const trailerXMax = trailer.position.x + lTrailer/2 + margin;
    console.log(trailerXMax);
    const trialerYMin = trailer.position.y - hTrailer/2 - margin;
    const trailerYMax = trailer.position.y + hTrailer/2 + margin;
    const trailerZMin = trailer.position.z - dTrailer/2 - margin;
    const trailerZMax = trailer.position.z + dTrailer/2 + margin;
    
    
    
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
    deltaTime = globalClock.getDelta();
    var velocityValue = step;
    if ((leftArrowPressed || rightArrowPressed) && (upArrowPressed || downArrowPressed)) // normalize if move is diagonal
        velocityValue = (velocityValue / Math.sqrt(velocityValue ** 2 + velocityValue ** 2)) * velocityValue;
    if (leftArrowPressed) trailer.position.x -= velocityValue * deltaTime;
    if (rightArrowPressed) trailer.position.x += velocityValue * deltaTime;
    if (upArrowPressed) trailer.position.z -= velocityValue * deltaTime;
    if (downArrowPressed) trailer.position.z += velocityValue * deltaTime;

    checkCollisions();
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
    
    trailerVelocityX = 0;
    trailerVelocityZ = 0;

    globalClock = new THREE.Clock(true);
    deltaTime = globalClock.getDelta();
    render();

    leftArrowPressed = false, rightArrowPressed = false, downArrowPressed = false, upArrowPressed = false;

    materials = [trailerBoxMaterial, trailerWheelMaterial];
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
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
        return;
    }
    switch(e.keyCode) {
        case 37:    // left arrow
            leftArrowPressed = true;
            break;
        case 38:    // up arrow
            upArrowPressed = true;
            break;
        case 39:    // right arrow
            rightArrowPressed = true;
            break;
        case 40:    // down arrow
            downArrowPressed = true;
            break;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch(e.keyCode) {
        case 37:    // left arrow
            leftArrowPressed = false;
            break;
        case 38:    // up arrow
            upArrowPressed = false;
            break;
        case 39:    // right arrow
            rightArrowPressed = false;
            break;
        case 40:    // down arrow
            downArrowPressed = false;
            break;
    }
}