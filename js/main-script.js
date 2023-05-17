//////////////////////tempcam
/* GLOBAL VARIABLES */
//////////////////////
var mainCamera, cameras;
var renderer, scene;
var materials

var globalClock, deltaTime;

var leftArrowPressed, upArrowPressed, rightArrowPressed, downArrowPressed;

var trailer;

const step = 10;

var wireframing = true;

/* Waist */
const lWaist=10, hWaist=5, dWaist=5;
var waistMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: wireframing });

/* Abdomen */
const lAbdomen=4, hAbdomen=3, dAbdomen=3;
var abdomenChestArmForearmMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: wireframing });

/* Chest */
const lChest=10, hChest=9, dChest=5;

/* Wheel */
const rWheel=1.5, hWheel=1;
var wheelTubeEyeConnectorMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: wireframing });

/* Arm */
const lArm=5, hArm=12, dArm=3;

/* Forearm */
const lForearm=3, hForearm=3, dForearm=5;

/* Tube */
const rTube=0.5, hTube=13;

/* Head */
const lHead=4, hHead=4, dHead=3;
var headAntenaLegsFootMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: wireframing });

/* Eye */
const rEye=0.5;

/* Antena */
const rAntena=0.5, hAntena=1;

/* Thigh */
const lThigh=3, hThigh=4, dThigh=3;
var thighMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, wireframe: wireframing });

/* Leg */
const lLeg=5, hLeg=13, dLeg=5;

/* Foot */
const lFoot=5, hFoot=3, dFoot=3;

/* Trailer */
const lTrailer = 48, hTrailer = 18, dTrailer = 12;
var trailerMaterial = new THREE.MeshBasicMaterial({ color: 0x838383, wireframe: wireframing });

/* Trailer Wheel */
const rTrailerWheel = 2, hTrailerWheel = 1;

/* Trailer Connector */
const rTrailerConnector = 1, hTrailerConnector = 2;

/* radialSegments */
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

    createTrailer(0, 0, -40);
    createRobot(0, 0, 0);
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

/* Create Robot */
function createRobot(x, y, z){
    'use strict'
    var robot = new THREE.Object3D();
    robot.position.set(x, y, z);
    robot.rotateY(Math.PI);

    addWaist(robot, 0, 0, 0);
    addAbdomen(robot, 0, hWaist/2 + hAbdomen/2, 0);
    addChest(robot, 0, hWaist/2 + hAbdomen + hChest/2, 0);
    addWheel(robot, lWaist/2 + hWheel/2, 0, 0);
    addWheel(robot, -lWaist/2 - hWheel/2, 0, 0);

    /* Head */
    var head = new THREE.Object3D();
    head.add(new THREE.AxesHelper(5));
    robot.add(head);
    var xHead = 0;
    var yHead = hWaist/2 + hAbdomen + hChest;
    var zHead = 0;
    head.position.set(xHead, yHead, zHead);

    addHead(head, 0, hHead/2, 0);
    addEye(head, lHead/2 - rEye, hHead-3*rEye, -dHead/2);
    addEye(head, -lHead/2 + rEye, hHead-3*rEye, -dHead/2);
    addAntena(head, lHead/2 - rAntena, hHead + hAntena/2, 0);
    addAntena(head, -lHead/2 + rAntena, hHead + hAntena/2, 0);

    /* Left Arm */
    var armLeft = new THREE.Object3D();
    armLeft.add(new THREE.AxesHelper(5));
    robot.add(armLeft);
    var xLeftArm = x + (lWaist/2 + lArm/10);
    var yLeftArm = y + (hWaist/2 + (hAbdomen+hChest)/2);
    var zLeftArm = z + (dWaist/2 + dArm/2);
    armLeft.position.set(xLeftArm, yLeftArm, zLeftArm);

    addArm(armLeft, 0, 0, 0);
    addForearm(armLeft, lArm/2 - lForearm/2, -hArm/2 + hForearm/2, -dArm/2 - dForearm/2);
    addTube(armLeft, lArm/2 - 3*rTube, hArm/2 + 2*hTube/13 - hTube/2, dArm/2 + rTube);

    /* Right Arm */
    var armRight = new THREE.Object3D();
    armRight.add(new THREE.AxesHelper(5));
    robot.add(armRight);
    var xRightArm = x - (lWaist/2 + lArm/10);
    var yRightArm = y + (hWaist/2 + (hAbdomen+hChest)/2);
    var zRightArm = z + (dWaist/2 + dArm/2);
    armRight.position.set(xRightArm, yRightArm, zRightArm);

    addArm(armRight, 0, 0, 0);
    addForearm(armRight, -lArm/2 + lForearm/2, -hArm/2 + hForearm/2, -dArm/2 - dForearm/2);
    addTube(armRight, -lArm/2 + 3*rTube, hArm/2 + 2*hTube/13 - hTube/2, dArm/2 + rTube);

    /* Legs */
    var legs = new THREE.Object3D();
    legs.add(new THREE.AxesHelper(5));
    robot.add(legs);
    /* Same Axis as Father */

    addThigh(legs, lWaist/4, -hWaist/2 - hThigh/2, 0);
    addThigh(legs, -lWaist/4, -hWaist/2 - hThigh/2, 0);
    addLeg(legs, lWaist/4, -hWaist/2 - hThigh - hLeg/2, 0);
    addLeg(legs, -lWaist/4, -hWaist/2 - hThigh - hLeg/2, 0);
    addWheel(legs, lWaist/2 + hWheel/2, -hWaist/2 - hThigh - hLeg + 2 + 2*rWheel + 2 + rWheel, 0);
    addWheel(legs, -lWaist/2 - hWheel/2, -hWaist/2 - hThigh - hLeg + 2 + 2*rWheel + 2 + rWheel, 0);
    addWheel(legs, lWaist/2 + hWheel/2, -hWaist/2 - hThigh - hLeg + 2 + rWheel, 0);
    addWheel(legs, -lWaist/2 - hWheel/2, -hWaist/2 - hThigh - hLeg +2 + rWheel, 0);

    /* Feet */
    var feet = new THREE.Object3D();
    feet.add(new THREE.AxesHelper(5));
    legs.add(feet);
    var xFeet = x;
    var yFeet = y - (hWaist/2 + hThigh + hLeg);
    var zFeet = z - (dLeg/2);
    feet.position.set(xFeet, yFeet, zFeet);

    addFoot(feet, lFoot/2, hFoot/2, -dFoot/2);
    addFoot(feet, -lFoot/2, hFoot/2, -dFoot/2);

    scene.add(robot);
}

function addWaist(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lWaist, hWaist, dWaist);
    mesh = new THREE.Mesh(geometry, waistMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAbdomen(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lAbdomen, hAbdomen, dAbdomen);
    mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addChest(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lChest, hChest, dChest);
    mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(rWheel, rWheel, hWheel, radialSegments);
    geometry.rotateZ(Math.PI/2);
    mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lHead, hHead, dHead);
    mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addEye(obj, x, y, z) {
    'use strict';

    geometry = new THREE.SphereGeometry(rEye, radialSegments, radialSegments);
    mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAntena(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(rAntena, rAntena, hAntena, radialSegments);
    mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addArm(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lArm, hArm, dArm);
    mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addForearm(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lForearm, hForearm, dForearm);
    mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTube(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(rTube, rTube, hTube, radialSegments);
    mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addThigh(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lThigh, hThigh, dThigh);
    mesh = new THREE.Mesh(geometry, thighMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lLeg, hLeg, dLeg);
    mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFoot(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(lFoot, hFoot, dFoot);
    mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

// TODO: rotate
function createTrailer(x, y, z) {
    const trailer = new THREE.Object3D();
    trailer.position.set(x, y, z);
    trailer.rotateY(Math.PI/2);

    addBox(trailer, 0, 0, 0);
    
    addTWheel(trailer, lTrailer/2 - 5 ,-hTrailer/2, dTrailer/2)
    addTWheel(trailer, lTrailer/2 - 14, -hTrailer/2, dTrailer/2);
    addTWheel(trailer, lTrailer/2 - 5, -hTrailer/2, -dTrailer/2);
    addTWheel(trailer, lTrailer/2 - 14, -hTrailer/2, -dTrailer/2);

    addConnector(trailer, -19, -9 - 1 , 0);

    scene.add(trailer);
}

function addBox(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(lTrailer, hTrailer, dTrailer);
    mesh = new THREE.Mesh(geometry, trailerMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTWheel(obj, x, y, z) {
    geometry = new THREE.CylinderGeometry(rTrailerWheel, rTrailerWheel, hTrailerWheel, radialSegments);
    geometry.rotateX(Math.PI/2);
    mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addConnector(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(rTrailerConnector, rTrailerConnector, hTrailerConnector, radialSegments);
    mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

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
    deltaTime = globalClock.getDelta();
    var velocityValue = step;
    if ((leftArrowPressed || rightArrowPressed) && (upArrowPressed || downArrowPressed)) // normalize if move is diagonal
        velocityValue = (velocityValue / Math.sqrt(velocityValue ** 2 + velocityValue ** 2)) * velocityValue;
    if (leftArrowPressed) trailer.position.x -= velocityValue * deltaTime;
    if (rightArrowPressed) trailer.position.x += velocityValue * deltaTime;
    if (upArrowPressed) trailer.position.z -= velocityValue * deltaTime;
    if (downArrowPressed) trailer.position.z += velocityValue * deltaTime;
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

    materials = [waistMaterial, abdomenChestArmForearmMaterial, headAntenaLegsFootMaterial, thighMaterial, trailerMaterial];
    
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