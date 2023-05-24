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

/* Flag used for checking if the robot is in truck mode or not */
var isTruck = false;

/* Robot */
var robot, head, armLeft, armRight, legs, feet;

/* Trailer */
var trailer;

/* Waist */
const lWaist=10, hWaist=5, dWaist=5;
var waistMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: wireframing });

/* Abdomen */
const lAbdomen=4, hAbdomen=3, dAbdomen=5;
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
const rEye=0.5, hEye=0.2;

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
const lTrailer = 12, hTrailer = 18-5.5, dTrailer = 48;
var trailerMaterial = new THREE.MeshBasicMaterial({ color: 0x838383, wireframe: wireframing });

const lTrailerBase = 12, hTrailerBase = 5.5, dTrailerBase = 24;

/* Trailer Wheel */
const rTrailerWheel = 2, hTrailerWheel = 1;

/* Trailer Connector */
const rTrailerConnector = 1, hTrailerConnector = 2;

/* radialSegments */
const radialSegments = 32;

const rotationIncrement = Math.PI/4;
const translationIncrement = 1.38;

var truckMode = false;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    const backgroundColor = new THREE.Color('rgb(200, 255, 255)');

    scene = new THREE.Scene();
    scene.background = backgroundColor;
    scene.add(new THREE.AxisHelper(10));

    createTrailer(0, hTrailer/2 + hTrailerBase + rTrailerWheel, -50);
    createRobot(0, hWaist/2 + rWheel, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    
    const aspect = window.innerWidth / window.innerHeight;
    const left = -70;
    const right = 70;
    const top = 40;
    const down = -40;
    const fov = 70;
    const near = 1;
    const far = 1000;
    const distance = 30;
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
    robot = new THREE.Object3D();
    robot.position.set(x, y, z);

    addWaist(robot, 0, 0, 0);
    addAbdomen(robot, 0, hWaist/2 + hAbdomen/2, 0);
    addChest(robot, 0, hWaist/2 + hAbdomen + hChest/2, 0);
    addWheel(robot, lWaist/2 + hWheel/2, -hWaist/2, 0);
    addWheel(robot, -lWaist/2 - hWheel/2, -hWaist/2, 0);

    /* Head */
    head = new THREE.Object3D();
    head.userData = { rotatingUp: false, rotatingDown: false };
    head.add(new THREE.AxesHelper(5));
    robot.add(head);
    var xHead = 0;
    var yHead = hWaist/2 + hAbdomen + hChest - 0.1;
    var zHead = 0;
    head.position.set(xHead, yHead, zHead);

    addHead(head, 0, hHead/2 + 0.1, 0);
    addEye(head, lHead/2 - rEye, hHead-3*rEye + 0.1, dHead/2);
    addEye(head, -lHead/2 + rEye, hHead-3*rEye + 0.1, dHead/2);
    addAntena(head, lHead/2 - rAntena, hHead + hAntena/2 + 0.1, 0);
    addAntena(head, -lHead/2 + rAntena, hHead + hAntena/2 + 0.1, 0);

    /* Left Arm */
    armLeft = new THREE.Object3D();
    armLeft.userData = { movingIn: false, movingOut: false};
    armLeft.add(new THREE.AxesHelper(5));
    robot.add(armLeft);
    var xLeftArm = lWaist/2 + lArm/10;
    var yLeftArm = hWaist/2 + (hAbdomen+hChest)/2;
    var zLeftArm = -dWaist/2 - dArm/2;
    armLeft.position.set(xLeftArm, yLeftArm, zLeftArm);

    addArm(armLeft, 0, 0, 0);
    addForearm(armLeft, lArm/2 - lForearm/2, -hArm/2 + hForearm/2, dArm/2 + dForearm/2);
    addTube(armLeft, lArm/2 - 3*rTube, hArm/2 + 2*hTube/13 - hTube/2, -dArm/2 - rTube);

    /* Right Arm */
    armRight = new THREE.Object3D();
    armRight.userData = { movingIn: false, movingOut: false};
    armRight.add(new THREE.AxesHelper(5));
    robot.add(armRight);
    var xRightArm = -lWaist/2 - lArm/10;
    var yRightArm = hWaist/2 + (hAbdomen+hChest)/2;
    var zRightArm = -dWaist/2 - dArm/2;
    armRight.position.set(xRightArm, yRightArm, zRightArm);

    addArm(armRight, 0, 0, 0);
    addForearm(armRight, -lArm/2 + lForearm/2, -hArm/2 + hForearm/2, dArm/2 + dForearm/2);
    addTube(armRight, -lArm/2 + 3*rTube, hArm/2 + 2*hTube/13 - hTube/2, -dArm/2 - rTube);

    /* Legs */
    legs = new THREE.Object3D();
    legs.userData = { rotatingUp: false, rotatingDown: false};
    legs.add(new THREE.AxesHelper(5));
    robot.add(legs);
    /* Same Axis as Father */

    addThigh(legs, lWaist/4, -hWaist/2 - hThigh/2, 0);
    addThigh(legs, -lWaist/4, -hWaist/2 - hThigh/2, 0);
    addLeg(legs, lWaist/4, -hWaist/2 - hThigh - hLeg/2, 0);
    addLeg(legs, -lWaist/4, -hWaist/2 - hThigh - hLeg/2, 0);
    addWheel(legs, lWaist/2 + hWheel/2, -hWaist/2 - hThigh - hLeg + 2 + 2*rWheel + 2 + rWheel, dLeg/2);
    addWheel(legs, -lWaist/2 - hWheel/2, -hWaist/2 - hThigh - hLeg + 2 + 2*rWheel + 2 + rWheel, dLeg/2);
    addWheel(legs, lWaist/2 + hWheel/2, -hWaist/2 - hThigh - hLeg + 2 + rWheel, dLeg/2);
    addWheel(legs, -lWaist/2 - hWheel/2, -hWaist/2 - hThigh - hLeg +2 + rWheel, dLeg/2);

    /* Feet */
    feet = new THREE.Object3D();
    feet.userData = { rotatingUp: false, rotatingDown: false };
    feet.add(new THREE.AxesHelper(5));
    legs.add(feet);
    var xFeet = 0;
    var yFeet = -(hWaist/2 + hThigh + hLeg);
    var zFeet = dLeg/2;
    feet.position.set(xFeet, yFeet, zFeet);

    addFoot(feet, lFoot/2, hFoot/2, dFoot/2);
    addFoot(feet, -lFoot/2, hFoot/2, dFoot/2);

    scene.add(robot);
}

function addWaist(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lWaist, hWaist, dWaist);
    const mesh = new THREE.Mesh(geometry, waistMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAbdomen(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lAbdomen, hAbdomen, dAbdomen);
    const mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addChest(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lChest, hChest, dChest);
    const mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y, z) {
    'use strict';
    const geometry = new THREE.CylinderGeometry(rWheel, rWheel, hWheel, radialSegments);
    geometry.rotateZ(Math.PI/2);
    const mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lHead, hHead, dHead);
    const mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addEye(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.CylinderGeometry(rEye, rEye, hEye, radialSegments);
    geometry.rotateX(Math.PI/2);
    const mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAntena(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.CylinderGeometry(rAntena, rAntena, hAntena, radialSegments);
    const mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addArm(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lArm, hArm, dArm);
    const mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addForearm(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lForearm, hForearm, dForearm);
    const mesh = new THREE.Mesh(geometry, abdomenChestArmForearmMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTube(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.CylinderGeometry(rTube, rTube, hTube, radialSegments);
    const mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addThigh(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lThigh, hThigh, dThigh);
    const mesh = new THREE.Mesh(geometry, thighMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addLeg(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lLeg, hLeg, dLeg);
    const mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFoot(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lFoot, hFoot, dFoot);
    const mesh = new THREE.Mesh(geometry, headAntenaLegsFootMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/* Trailer */
function createTrailer(x, y, z) {
    trailer = new THREE.Object3D();
    trailer.position.set(x, y, z);

    addBox(trailer, 0, 0, 0);
    addTrailerBase(trailer, 0, -hTrailer/2-hTrailerBase/2, -dTrailer/2 + dTrailerBase/2);
    
    addTWheel(trailer, lTrailer/2, -hTrailer/2 - hTrailerBase, -dTrailer/2 + 2 + rTrailerWheel);
    addTWheel(trailer, lTrailer/2, -hTrailer/2 - hTrailerBase, -dTrailer/2 + 2 + 2*rTrailerWheel + 2 + rTrailerWheel);
    addTWheel(trailer, -lTrailer/2, -hTrailer/2 - hTrailerBase, -dTrailer/2 + 2 + rTrailerWheel);
    addTWheel(trailer, -lTrailer/2, -hTrailer/2 - hTrailerBase, -dTrailer/2 + 2 + 2*rTrailerWheel + 2 + rTrailerWheel);

    addConnector(trailer, 0, -hTrailer/2 - hTrailerConnector/2, dTrailer/2 - 3*rTrailerConnector);

    scene.add(trailer);
}

function addBox(obj, x, y, z) {
    'use strict';
    const geometry = new THREE.BoxGeometry(lTrailer, hTrailer, dTrailer);
    const mesh = new THREE.Mesh(geometry, trailerMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTrailerBase(obj, x, y, z) {
    'use strict';

    const geometry = new THREE.BoxGeometry(lTrailerBase, hTrailerBase, dTrailerBase);
    const mesh = new THREE.Mesh(geometry, trailerMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTWheel(obj, x, y, z) {
    const geometry = new THREE.CylinderGeometry(rTrailerWheel, rTrailerWheel, hTrailerWheel, radialSegments);
    geometry.rotateZ(Math.PI/2);
    const mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addConnector(obj, x, y, z) {
    'use strict';
    const geometry = new THREE.CylinderGeometry(rTrailerConnector, rTrailerConnector, hTrailerConnector, radialSegments);
    const mesh = new THREE.Mesh(geometry, wheelTubeEyeConnectorMaterial);

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    const margin = 0;
    const trailerXMin = trailer.position.x - lTrailer/2 - margin;
    const trailerXMax = trailer.position.x + lTrailer/2 + margin;
    const trailerYMin = trailer.position.y - hTrailer/2 - margin;
    const trailerYMax = trailer.position.y + hTrailer/2 + margin;
    const trailerZMin = trailer.position.z - dTrailer/2 - margin;
    const trailerZMax = trailer.position.z + dTrailer/2 + margin;
    const truckXMax = robot.position.x + lChest/2 + margin;
    const truckXMin = robot.position.x - lChest/2 - margin;
    const truckYMax = robot.position.y + hWaist/2 + + hAbdomen + hChest + margin;
    const truckYMin = robot.position.y - hWaist/2 - rWheel/2 - margin;
    const truckZMax = robot.position.z + dChest/2 + margin;
    const truckZMin = robot.position.z - dChest/2 - hThigh - hLeg - margin;
    const xMatch = (trailerXMin < truckXMin && truckXMin < trailerXMax) || (trailerXMin < truckXMax && truckXMax < trailerXMax);
    const yMatch = (trailerYMin < truckYMin && truckYMin < trailerYMax) || (trailerYMin < truckYMax && truckYMax < trailerYMax);
    const zMatch = (trailerZMin < truckZMin && truckZMin < trailerZMax) || (trailerZMin < truckZMax && truckZMax < trailerZMax); 
    return xMatch && yMatch && zMatch;
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';
    const translation = step;
    if (trailer.position.x < 0) {
        trailer.translateX(translation*deltaTime);
    }
    if (trailer.position.x > 0) {
        trailer.translateX(-translation*deltaTime);
    }
    if (trailer.position.z < -33) {
        trailer.translateZ(translation*deltaTime);
    }
    if (trailer.position.z > -33) {
        trailer.translateZ(-translation*deltaTime);
    }
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    var velocityValue = step;
    if ((leftArrowPressed ? !rightArrowPressed : rightArrowPressed) && (upArrowPressed ? !downArrowPressed : downArrowPressed)) // normalize if move is diagonal
        velocityValue = (velocityValue / Math.sqrt(velocityValue ** 2 + velocityValue ** 2)) * velocityValue;
    if (leftArrowPressed) trailer.position.x -= velocityValue * deltaTime;
    if (rightArrowPressed) trailer.position.x += velocityValue * deltaTime;
    if (upArrowPressed) trailer.position.z -= velocityValue * deltaTime;
    if (downArrowPressed) trailer.position.z += velocityValue * deltaTime;

    for (let i = 0; i < materials.length; i++) {
        materials[i].wireframe = wireframing;
    }
    const isCollision = isTruck && checkCollisions();
    if (!isCollision) {
        if(legs.userData.rotatingUp){
            if(legs.rotation.x + rotationIncrement * deltaTime <= Math.PI/2)
                legs.rotateX(rotationIncrement * deltaTime);
            else
                legs.rotation.x = Math.PI/2;
        }
    
        if(legs.userData.rotatingDown){
            if(legs.rotation.x -rotationIncrement * deltaTime >= 0)
                legs.rotateX(-rotationIncrement * deltaTime);
            else
                legs.rotation.x = 0;
        }
    
        if(armRight.userData.movingIn && armLeft.userData.movingIn){
            if(armRight.position.x + translationIncrement * deltaTime <= -lArm/2 
                && armLeft.position.x + translationIncrement * deltaTime >= lArm/2){
                armRight.translateX(translationIncrement * deltaTime);
                armLeft.translateX(-translationIncrement * deltaTime);
            }
            else{
                armRight.position.x = -lArm/2;
                armLeft.position.x = lArm/2;
            }
        }
        if(armRight.userData.movingOut && armLeft.userData.movingOut){
            if(armRight.position.x + translationIncrement * deltaTime >= -lArm 
                && armLeft.position.x + translationIncrement * deltaTime <= lArm){
                armRight.translateX(-translationIncrement * deltaTime);
                armLeft.translateX(translationIncrement * deltaTime);
            }
            else{
                armRight.position.x = -lArm;
                armLeft.position.x = lArm;
            }
        }
    
        if (feet.userData.rotatingUp) {
            if (feet.rotation.x - rotationIncrement * deltaTime >= -Math.PI/2)
                feet.rotateX(-rotationIncrement * deltaTime);
            else
                feet.rotation.x = -Math.PI/2;
        }
    
        if (feet.userData.rotatingDown) {
            if(feet.rotation.x + rotationIncrement * deltaTime <= 0)
                feet.rotateX(rotationIncrement * deltaTime);
            else
                feet.rotation.x = 0;
        }
    
        if (head.userData.rotatingUp) {
            if(head.rotation.x + rotationIncrement * deltaTime <= Math.PI 
                && head.rotation.x + rotationIncrement * deltaTime>= 0)
                head.rotateX(2*rotationIncrement * deltaTime);
            else
                head.rotation.x = Math.PI;
        }
    
        if (head.userData.rotatingDown) {
            if(head.rotation.x - rotationIncrement * deltaTime >= 0)
                head.rotateX(-2*rotationIncrement * deltaTime);
            else
                head.rotation.x = 0;
        }
    }
    else
        handleCollisions();
    if (legs.rotation.x == Math.PI/2 && feet.rotation.x == -Math.PI/2 && head.rotation.x == Math.PI && armRight.position.x == -lArm/2 && armLeft.position.x == lArm/2) 
        isTruck = true;
    else 
        isTruck = false;
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

    materials = [waistMaterial, abdomenChestArmForearmMaterial, headAntenaLegsFootMaterial, thighMaterial, trailerMaterial, wheelTubeEyeConnectorMaterial];
    
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    deltaTime = globalClock.getDelta();

    update();
    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        mainCamera.aspect = window.innerWidth / window.innerHeight;
        mainCamera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    console.log(e.keyCode);
    // number 1 to 5
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
        case 54:    // number 6
            wireframing = !wireframing;
            break;
        case 55:
             trailer.position.set(0, hTrailer/2 + hTrailerBase + rTrailerWheel, -50);
             break;
        case 65:    // letter A/a
            feet.userData.rotatingDown = true;
            break;
        case 68:    // letter D/d
            armLeft.userData.movingOut = true;
            armRight.userData.movingOut = true;
            break;
        case 69:    // letter E/e
            armLeft.userData.movingIn = true;
            armRight.userData.movingIn = true;
            break;
        case 70:    // letter F/f
            head.userData.rotatingDown = true;
            break;
        case 76:    // letter L/l
            head.userData.rotatingDown = true;
            feet.userData.rotatingDown = true;
            legs.userData.rotatingDown = true;
            armLeft.userData.movingOut = true;
            armRight.userData.movingOut = true;
            break;
        case 79:    // letter O/o
            head.userData.rotatingUp = true;
            feet.userData.rotatingUp = true;
            legs.userData.rotatingUp = true;
            armLeft.userData.movingIn = true;
            armRight.userData.movingIn = true;
            break;
        case 81:    // letter Q/q
            feet.userData.rotatingUp = true;
            break;
        case 82:    // letter R/r 
            head.userData.rotatingUp = true;
            break;
        case 83:    // letter E/e
            legs.userData.rotatingDown = true;
            break;
        case 87:    // letter W/w
            legs.userData.rotatingUp = true;
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
        case 65:    // letter A/a
            feet.userData.rotatingDown = false;
            break;
        case 68:    // letter D/d
            armLeft.userData.movingOut = false;
            armRight.userData.movingOut = false;
            break;
        case 69:    // letter E/e
            armLeft.userData.movingIn = false;
            armRight.userData.movingIn = false;
            break;
        case 70:    // letter F/f
            head.userData.rotatingDown = false;
            break;
        case 76:    // letter L/l
            head.userData.rotatingDown = false;
            feet.userData.rotatingDown = false;
            legs.userData.rotatingDown = false;
            armLeft.userData.movingOut = false;
            armRight.userData.movingOut = false;
            break;
        case 79:    // letter O/o
            head.userData.rotatingUp = false;
            feet.userData.rotatingUp = false;
            legs.userData.rotatingUp = false;
            armLeft.userData.movingIn = false;
            armRight.userData.movingIn = false;
            break;
        case 81:    // letter Q/q
            feet.userData.rotatingUp = false;
            break;
        case 82:    // letter R/r 
            head.userData.rotatingUp = false;
            break;
        case 83:    // letter E/e
            legs.userData.rotatingDown = false;
            break;
        case 87:    // letter W/w
            legs.userData.rotatingUp = false;
            break;
    }
}