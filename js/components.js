import { RGBELoader } from './RGBELoader.js';
import { OrbitControls } from './OrbitControls.js';

AFRAME.registerComponent('hdri-map', {
    schema: {
        hdr: { default: '../../glbs/hdri/room.hdr' },
        exposure: {default: 1}
    },

    init: function () {
        this.sceneEl = this.el.sceneEl;
        console.log(THREE);
        var hdri = this.data.hdr;
        new RGBELoader()
            .load(hdri, function (texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                document.querySelector('a-scene').object3D.background = texture;
                document.querySelector('a-scene').object3D.environment = texture;
            });
        this.el.sceneEl.renderer.toneMapping = 3;
        this.el.sceneEl.renderer.toneMappingExposure = this.data.exposure;
    }
});

AFRAME.registerComponent('debug-model', {
    schema: {
        
    },

    init: function () {
        var gltf = this.el.object3D;
        console.log(gltf);
    }
});

AFRAME.registerComponent('button', {
    schema: {
        pinchDistance: { default: 0.05 },
        label: { default: 'label' },
        width: { default: 0.11 },
        actionbutton: { default: "nextB" }
    },

    init: function () {
        var el = this.el;
        var sceneEl = this.el.sceneEl;
        this.worldPosition = new THREE.Vector3();
        this.pinched = false;
        this.wasPinched = false;
        //var labelEl = this.labelEl = document.createElement('a-entity');
        this.bindMethods();


        var labelEl = this.labelEl = document.createElement('a-entity');
        this.color = '#1f3f5f';
        el.setAttribute('geometry', {
            primitive: 'box',
            width: this.data.width,
            height: 0.05,
            depth: 0.005
        });

        labelEl.setAttribute('position', '0 0 0.0025');
        labelEl.setAttribute('text', {
            value: this.data.label,
            color: 'white',
            align: 'center'
        });
        labelEl.setAttribute('scale', '0.5 0.5 0.5');
        this.el.appendChild(labelEl);
        el.setAttribute('material', { color: this.color });
        sceneEl.addEventListener('pinchstarted', this.onPinchStarted);
        sceneEl.addEventListener('pinchended', this.onPinchEnded);
        sceneEl.addEventListener('pinchmoved', this.onPinchMoved);
        sceneEl.addEventListener('pointingstart', this.onPointingstart);
        sceneEl.addEventListener('pointingend', this.onPointingEnd);
    },

    bindMethods: function () {
        this.onPinchStarted = this.onPinchStarted.bind(this);
        this.onPinchEnded = this.onPinchEnded.bind(this);
        this.onPinchMoved = this.onPinchMoved.bind(this);
        this.onPointingstart = this.onPointingstart.bind(this);
        this.onPointingEnd = this.onPointingEnd.bind(this);
    },

    onPointingstart: function (evt) {
        var ent = this.el;
        ent.setAttribute('material', { color: '#1f5f3f' });
        document.getElementById('handText').setAttribute('value', evt.detail);
    },

    onPointingEnd: function(evt){
        var ent = this.el;
        ent.setAttribute('material', { color: this.color });
        document.getElementById('handText').setAttribute('value', 'Point End!');
    },

    onPinchStarted: function (evt) {
        var ent = this.el;
        var distance = this.calculatePinchDistance(evt.detail.position);
        if (distance <= this.data.pinchDistance) {
            this.pinched = true;
            //document.getElementById('dText').setAttribute('value', "Pinched!");
            var btn = document.getElementById(this.data.actionbutton);
            btn.click();
            ent.setAttribute('material', { color: '#5f1f3f' });
        }
    },

    onPinchEnded: function (evt) {
        var ent = this.el;
        //document.getElementById('dText').setAttribute('value', "Cick end!");
        this.pinched = false;
        this.wasPinched = false;
        ent.setAttribute('material', { color: this.color });
    },

    onPinchMoved: function (evt) {
        if (this.pinched) {
        }
    },

    calculatePinchDistance: function (pinchWorldPosition) {
        var el = this.el;
        var worldPosition = this.worldPosition;
        var pinchDistance;

        worldPosition.copy(el.object3D.position);
        el.object3D.parent.updateMatrixWorld();
        el.object3D.parent.localToWorld(worldPosition);

        pinchDistance = worldPosition.distanceTo(pinchWorldPosition);
        worldPosition
        return pinchDistance;
    }

});

AFRAME.registerComponent('gui-box', {
    schema: {
        pinchDistance: { default: 0.05 }/*,
        width: { default: .4 },
        height: { default: .3 },
        depth: { default: 0.005 },
        color: { default: '#0f0f0f' }*/
    },

    init: function () {
        var el = this.el;
        var sceneEl = this.el.sceneEl;
        this.pinched = false;
        this.worldPosition = new THREE.Vector3();
        //var labelEl = this.labelEl = document.createElement('a-entity');
        this.bindMethods();

        el.setAttribute('geometry', {
            primitive: 'box',
            width: this.data.width,
            height: this.data.height,
            depth: this.data.depth
        });

        el.setAttribute('material', {
            color: this.data.color,
            transparent: true,
            opacity: 0.9
        });
        sceneEl.addEventListener('pinchstarted', this.onPinchStarted);
        sceneEl.addEventListener('pinchended', this.onPinchEnded);
        sceneEl.addEventListener('pinchmoved', this.onPinchMoved);
    },

    bindMethods: function () {
        this.onPinchStarted = this.onPinchStarted.bind(this);
        this.onPinchEnded = this.onPinchEnded.bind(this);
        this.onPinchMoved = this.onPinchMoved.bind(this);
    },

    onPinchStarted: function (evt) {
        //document.getElementById('dText').setAttribute('value', "Cicked!");
        var ent = this.el;
        var distance = this.calculatePinchDistance(evt.detail.position);
        if (distance <= this.data.pinchDistance) {
            this.pinched = true;
        }
    },

    onPinchEnded: function (evt) {
        //document.getElementById('dText').setAttribute('value', "Cick end!");
        this.pinched = false;
    },

    onPinchMoved: function (evt) {
        var ent = this.el;
        //document.getElementById('dText').setAttribute('value', this.pinched);
        if (this.pinched) {

            var pos = evt.detail.position.x + " " + evt.detail.position.y + " " + evt.detail.position.z;
            ent.setAttribute('position', pos);
            var hanRotation = evt.target.object3D.children[0].rotation;
            var rot = "-15 " + THREE.Math.radToDeg(-hanRotation.z) + " 0";
            this.el.setAttribute('rotation', rot);
            //this.el.object3D.rotation.set();
        }
    },

    calculatePinchDistance: function (pinchWorldPosition) {
        var el = this.el;
        var worldPosition = this.worldPosition;
        var pinchDistance;

        worldPosition.copy(el.object3D.position);
        /*el.object3D.parent.updateMatrixWorld();
        el.object3D.parent.localToWorld(worldPosition);*/

        pinchDistance = worldPosition.distanceTo(pinchWorldPosition);

        return pinchDistance;
    }
});

AFRAME.registerComponent('drag-box', {
    schema: {
        pinchDistance: { default: 0.1 },
        width: { default: .25 },
        height: { default: .25 },
        depth: { default: 0.25 },
        color: { default: '#0f0f0f' }
    },

    init: function () {
        var el = this.el;
        var sceneEl = this.el.sceneEl;
        this.pinched = false;
        this.worldPosition = new THREE.Vector3();
        //var labelEl = this.labelEl = document.createElement('a-entity');
        this.bindMethods();

        el.setAttribute('geometry', {
            primitive: 'box',
            width: this.data.width,
            height: this.data.height,
            depth: this.data.depth
        });

        el.setAttribute('material', {
            color: this.data.color,
            transparent: true,
            opacity: 0.9
        });
        sceneEl.addEventListener('pinchstarted', this.onPinchStarted);
        sceneEl.addEventListener('pinchended', this.onPinchEnded);
        sceneEl.addEventListener('pinchmoved', this.onPinchMoved);
    },

    bindMethods: function () {
        this.onPinchStarted = this.onPinchStarted.bind(this);
        this.onPinchEnded = this.onPinchEnded.bind(this);
        this.onPinchMoved = this.onPinchMoved.bind(this);
    },

    onPinchStarted: function (evt) {

        this.pinched = this.isInside(evt.detail.position);

    },

    onPinchEnded: function (evt) {
        //document.getElementById('dText').setAttribute('value', "Cick end!");
        this.pinched = false;
    },

    onPinchMoved: function (evt) {
        var ent = this.el;
        //document.getElementById('dText').setAttribute('value', this.pinched);
        if (this.pinched) {
            var pos = evt.detail.position.x + " " + evt.detail.position.y + " " + evt.detail.position.z;
            ent.setAttribute('position', pos);
            var hanRotation = evt.target.object3D.children[0].rotation;
            //var rot = "-15 " + THREE.Math.radToDeg(-hanRotation.z) + " 0";
            //this.el.setAttribute('rotation', rot);
        }
    },

    isInside: function (pinchWorldPosition) {
        var el = this.el;
        var localPosition = el.object3D.worldToLocal(pinchWorldPosition);
        const nx = -this.data.width / 2;
        const px = this.data.width / 2;

        const ny = -this.data.height / 2;
        const py = this.data.height / 2;

        const nz = -this.data.depth / 2;
        const pz = this.data.depth / 2;

        let ix = localPosition.x > nx && localPosition.x < px;
        let iy = localPosition.y > ny && localPosition.y < py;
        let iz = localPosition.z > nz && localPosition.z < pz;

        let pos = localPosition.x + " " + localPosition.y + " " + localPosition.z;
        //document.getElementById('dText').setAttribute('value', "X: " + ix + " Y: " + iy + " Z: " + iz);
        if (ix && iy && iz) {
            return true;
        } else {
            return false;
        }
    },

    calculatePinchDistance: function (pinchWorldPosition) {
        var el = this.el;
        var worldPosition = this.worldPosition;
        var pinchDistance;

        worldPosition.copy(el.object3D.position);
        /*el.object3D.parent.updateMatrixWorld();
        el.object3D.parent.localToWorld(worldPosition);*/

        pinchDistance = worldPosition.distanceTo(pinchWorldPosition);

        return pinchDistance;
    }
});

AFRAME.registerComponent('pressable', {
    schema: {
        defaultColor: { default: '#ff00ff' },
        pressedColor: { default: '#00ff00' }
    },

    init: function () {
        //this.pressedColor = '#00ff00';
        this.pressed = false;
        this.worldPosition = new THREE.Vector3();
        this.handEls = document.querySelectorAll('[hand-tracking-controls]');
        console.log(this.handEls);
        this.radius = this.el.getAttribute("radius");
        this.el.setAttribute('material', {
            color: this.data.defaultColor,
            metalness: 1,
            transparent: true,
            opacity: 0.9
        });
    },

    tick: function () {
        var handEls = this.handEls;

        var hand1 = handEls[0];
        var hand2 = handEls[1];

        var distance1 = this.calculateFingerDistance(hand1.components['hand-tracking-controls'].indexTipPosition);
        var distance2 = this.calculateFingerDistance(hand2.components['hand-tracking-controls'].indexTipPosition);

        if (distance1 < this.radius || distance2 < this.radius) {
            this.pressed = true;
        } else {
            this.pressed = false;
        }

        if (this.pressed) {
            document.getElementById('dText').setAttribute('value', "Done!");
            this.el.setAttribute('material', {
                color: this.data.pressedColor,
                metalness: 1,
                transparent: true,
                opacity: 0.9
            });
        } else {
            document.getElementById('dText').setAttribute('value', "Press the\nButton!");
            this.el.setAttribute('material', {
                color: this.data.defaultColor,
                metalness: 1,
                transparent: true,
                opacity: 0.9
            });
        }
    },

    calculateFingerDistance: function (fingerPosition) {
        var el = this.el;
        return fingerPosition.distanceTo(el.object3D.position);
    }
});

AFRAME.registerComponent('orbit-control', {
    schema: {

    },

    init: function () {
        this.el.setAttribute("look-controls", "enabled:false");
        this.el.setAttribute("wasd-controls", "enabled:false");
        console.log(this.el.object3D);
        this.mainCamera = this.el.object3D.children[0];
        const controls = new OrbitControls(this.mainCamera, this.el.sceneEl.renderer.domElement);
        controls.target.set(0, 0, -2);
        //controls.enablePan = false;
        //controls.enableZoom = false;
        controls.minDistance = 0.01;
        controls.maxDistance = 200;

        controls.update();
        console.log(controls);
    },

    update: function () { },
    tick: function () { },
    remove: function () { },
    pause: function () { },
    play: function () { }
});

AFRAME.registerComponent('debug-entity', {
    schema: {

    },

    init: function () {
        var customHand = this.el.components['hand-tracking-controls'].data.modelStyle;
        console.log(customHand);
    },

    update: function () { },
    tick: function () { },
    remove: function () { },
    pause: function () { },
    play: function () { }
});