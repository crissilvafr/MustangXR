import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/GLTFLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.143.0/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/RGBELoader.js';
import { GLTFExporter } from 'https://unpkg.com/three@0.143.0/examples/jsm/exporters/GLTFExporter.js';
//===== XR =====\\
import { VRButton } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/XRControllerModelFactory.js';
import { OculusHandModel } from './OculusHandModel.js';
import { OculusHandPointerModel } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/OculusHandPointerModel.js';
//import { createText } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/Text2D.js';

//import { World, System, Component, TagComponent, Types } from 'https://unpkg.com/three@0.143.0/examples/jsm/libs/ecsy.module.js';

let camera, scene, renderer, camLight;
const SceneExposure = 2;
let boxHelper;

init();
animate();

let currentStep = 0;
let bodyMat;

function init() {
    boxHelper = new THREE.BoxHelper();
    boxHelper.material.linewidth = 3;
    boxHelper.material.color.r = 1;
    boxHelper.material.color.g = 0;
    boxHelper.material.color.b = 1;



    let viewer = document.getElementById('viewer');
    var width = viewer.clientWidth; // Ancho de ventana
    var height = viewer.clientHeight; // Altura de la ventana
    console.log(viewer);
    camera = new THREE.PerspectiveCamera(70, viewer.clientWidth / viewer.clientHeight, .01, 1000);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = 5;
    camera.position.y = 1;

    scene = new THREE.Scene();
    scene.add(boxHelper);
    /*const loader = new GLTFLoader().setPath('glbs/');
    loader.load('smg.glb', function (gltf) {

        gltf.scene.position.z = -1.5;
        gltf.scene.rotation.y = -Math.PI;
        scene.add(gltf.scene);
        console.log(scene);
    });*/
    new MTLLoader()
        .setPath('glbs/castle/')
        .load('Castle.mtl', function (materials) {

            materials.preload();

            new OBJLoader()
                .setMaterials(materials)
                .setPath('glbs/castle/')
                .load('Castle.obj', function (object) {

                    console.log(object);
                    scene.add(object);

                });

        });

    new RGBELoader()
        .setPath('glbs/hdri/')
        .load('cloudy.hdr', function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
        });

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-5, 5, 0);
    //scene.add(directionalLight);
    const sky = 0xffffff;
    const ground = 0x000000;
    const light = new THREE.HemisphereLight(sky, ground, 5);
    //scene.add(light);
    const boxIntensity = 2;
    const lDistance = 150;

    camLight = new THREE.SpotLight(0xffffff, 0, 0, 2, 0, 0);
    camLight.focus = 0;
    scene.add(camLight);

    const floorGeometry = new THREE.PlaneGeometry(20, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x2f2f2f });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.position.z = - 1.5;
    floor.receiveShadow = true;
    //scene.add(floor);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(viewer.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = SceneExposure;
    renderer.setClearColor(0x000000);
    console.log(renderer.domElement);
    viewer.appendChild(renderer.domElement);
    renderer.xr.enabled = true;
    renderer.xr.cameraAutoUpdate = false;
    renderer.xr.setReferenceSpace(XRReferenceSpace.viewer);
    console.log(renderer.xr);
    //
    let vrButton = VRButton.createButton(renderer);
    vrButton.style.position = "relative";
    vrButton.style.bottom = "75px";
    viewer.appendChild(vrButton);

    // controllers
    const controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', TapColor);
    scene.add(controller1);

    const controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', TapColor);
    scene.add(controller2);

    const controllerModelFactory = new XRControllerModelFactory();

    // Hand 1
    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    const hand1 = renderer.xr.getHand(0);
    hand1.add(new OculusHandModel(hand1));
    const handPointer1 = new OculusHandPointerModel(hand1, controller1);
    hand1.add(handPointer1);

    scene.add(hand1);

    // Hand 2
    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    const hand2 = renderer.xr.getHand(1);
    hand2.add(new OculusHandModel(hand2));
    const handPointer2 = new OculusHandPointerModel(hand2, controller2);
    hand2.add(handPointer2);
    scene.add(hand2);
    //

    //
    const controls = new OrbitControls(camera, renderer.domElement);
    //controls.enablePan = false;
    //controls.enableZoom = false;
    controls.target.set(0, 1, -1.5);
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    let viewer = document.getElementById('viewer');
    console.log(viewer);
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    //labelRenderer.setSize(viewer.clientWidth, viewer.clientHeight);
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();

}

function animate() {
    camLight.position.set(camera.position.x, camera.position.y, camera.position.z);
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.xr.updateCamera(camera);
    renderer.render(scene, camera);
    //labelRenderer.render(scene, camera);
}

function setBodyColor(r, g, b) {
    bodyMat = scene.getObjectByName("Body", true);
    bodyMat.material.color.setRGB(r, g, b);
    console.log(bodyMat);
}

function TapColor() {
    currentStep++;
    if (currentStep > 2) {
        currentStep = 0;
    }
    if (currentStep == 0) {
        setBodyColor(.05, .1, .2);
    }
    if (currentStep == 1) {
        setBodyColor(.2, 0, 0);
    }
    if (currentStep == 2) {
        setBodyColor(0, .1, 0);
    }
}

document.getElementById('dglb').addEventListener('click', function(){
    exportGLTF(scene);
})

function exportGLTF(input) {
    const gltfExporter = new GLTFExporter();
    const options = {
      trs: true,
      onlyVisible: false,
      binary: true
    };
    gltfExporter.parse(input, function (result) {
        const output = JSON.stringify(result, null, 2);
        console.log(output);
        saveString(output, 'scene.gltf');
    }, options);
  }
  
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link); // Firefox workaround, see #6594
  
  function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
  }
  
  function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
  }
  
  function saveArrayBuffer(buffer, filename) {
    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
  }