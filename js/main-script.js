//////////////////////tempcam
/* GLOBAL VARIABLES */
//////////////////////
var mainCamera, cameras;
var renderer, scene;


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
    const trailer = new THREE.Object3D();
    addBox(trailer, 0, 0, 0);
    
    addWheel(trailer, 19 ,-9, 6)
    addWheel(trailer, 10, -9, 6);
    addWheel(trailer, 19, -9, -6);
    addWheel(trailer, 10, -9, -6);

    addConnector(trailer, -19, -9 - 1 , 0);

    scene.add(trailer);
}

function addBox(obj, x, y, z) {
    'use strict';
    const box = new THREE.BoxGeometry(48, 18, 12);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new THREE.Mesh(box, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y, z) {
    'use strict';
    const wheel = new THREE.CylinderGeometry(4, 4, 1);
    wheel.rotateX(Math.PI/2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new THREE.Mesh(wheel, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addConnector(obj, x, y, z) {
    'use strict';
    const connector = new THREE.CylinderGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new THREE.Mesh(connector, material);
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