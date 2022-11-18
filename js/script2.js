import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.143.0/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://unpkg.com/three@0.143.0/examples/jsm/loaders/RGBELoader.js';
import { CSS2DRenderer, CSS2DObject } from 'https://unpkg.com/three@0.143.0/examples/jsm/renderers/CSS2DRenderer.js';
//===== Outline =====\\
/*import { EffectComposer } from 'https://unpkg.com/three@0.143.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.143.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.143.0/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'https://unpkg.com/three@0.143.0/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.143.0/examples/jsm/shaders/FXAAShader.js';*/
//===== XR =====\\
import { VRButton } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/XRControllerModelFactory.js';
import { OculusHandModel } from './OculusHandModel.js';
import { OculusHandPointerModel } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/OculusHandPointerModel.js';
import { createText } from 'https://unpkg.com/three@0.143.0/examples/jsm/webxr/Text2D.js';

import { World, System, Component, TagComponent, Types } from 'https://unpkg.com/three@0.143.0/examples/jsm/libs/ecsy.module.js';

let camera, scene, renderer, camLight;
let iText, jData, prevBtn, nextBtn;
const SceneExposure = 2;
let boxHelper, labelRenderer, earthDiv;

init();
animate();

let currentStep = 0;

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
    const loader = new GLTFLoader().setPath('glbs/');
    loader.load('Mustang.glb', function (gltf) {

        gltf.scene.position.z = -2;
        gltf.scene.position.z = -1;
        gltf.scene.rotation.y = - Math.PI;
        scene.add(gltf.scene);
    });

    new RGBELoader()
        .setPath('glbs/hdri/')
        .load('autoshop_01_1k.hdr', function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            //scene.background = texture;
            scene.environment = texture;
        });
    const sky = 0x98A2C0;
    const ground = 0x98A2C0;
    const light = new THREE.HemisphereLight(sky, ground, 2);
    //scene.add(light);
    const boxIntensity = 2;
    const lDistance = 150;

    camLight = new THREE.SpotLight(0xffffff, 0, 0, 2, 0, 0);
    camLight.focus = 0;
    scene.add(camLight);

    /*const floorGeometry = new THREE.PlaneGeometry(20, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1f1f1f });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);*/

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(viewer.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = SceneExposure;
    renderer.setClearColor(0x000000, 0);
    console.log(renderer.domElement);
    viewer.appendChild(renderer.domElement);
    renderer.xr.enabled = true;
    renderer.xr.cameraAutoUpdate = false;
    renderer.xr.setReferenceSpaceType("viewer");
    console.log(renderer.xr);
    //
    
    let arButton = ARButton.createButton(renderer);
    arButton.style.position = "relative";
    arButton.style.bottom = "75px";
    viewer.appendChild(arButton);
    //a
    // controllers
    const controller1 = renderer.xr.getController(0);
    //controller1.addEventListener('selectstart', nextStep);
    scene.add(controller1);

    const controller2 = renderer.xr.getController(1);
    //controller2.addEventListener('selectstart', prevStep);
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
    controls.target.set(0, 1, 0);
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