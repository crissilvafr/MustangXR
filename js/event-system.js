// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
let iText, jData, prevBtn, nextBtn;
let boxHelper;
let worldPos;
console.log(document.getElementById('leftHand').object3D);
Start();
function Start() {
    worldPos = new THREE.Vector3();
    boxHelper = new THREE.BoxHelper();
    boxHelper.material.linewidth = 1;
    boxHelper.material.color.r = 1;
    boxHelper.material.color.g = 1;
    boxHelper.material.color.b = 1;
    //boxHelper.material.visible = false;
    document.querySelector('a-scene').object3D.add(boxHelper);
    console.log(document.querySelector('a-scene').object3D);
    //let process = document.getElementById('processList').value;
    iText = document.getElementById('instructionTxt');
    /*try {
        fetch('/glbs/json/' + process)

            .then((response) => response.json())
            .then((json) => generateData(json));
    } catch { }*/

}
let currentStep = 0;
let procesDropdown = document.getElementById('processList');
procesDropdown.addEventListener('change', function (event) {
    console.log(this.value);
    if (this.value !== '0') {
        currentStep = 0;
        let process = document.getElementById('processList').value;
        console.log(process);
        try {
            fetch('/glbs/json/' + process)

                .then((response) => response.json())
                .then((json) => generateData(json));

            iText = document.getElementById('instructionTxt');
        } catch { }
    } else {
        iText = document.getElementById('instructionTxt');
        iText.innerHTML = "";
        let stepT = document.getElementById('sText');
        stepT.setAttribute('text', "value:");
    }
});

function generateData(json) {
    try {
        console.log(document.querySelector('a-scene').object3D);
        jData = json;
        console.log(Object.keys(jData));
        console.log(Object.keys(jData.NAKAMURA_TOME_150II.encendido.paso).length);
        console.log(jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction);
        iText.innerHTML = jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction;
        let stepT = document.getElementById('sText');
        stepT.setAttribute('text', "value:" + jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction);
        prevStep();
    } catch { }
}

prevBtn = document.getElementById('prevB');
prevBtn.addEventListener('click', function () {
    prevStep();
});

function prevStep() {
    try {
        //let world = new Vector3();
        if (jData.NAKAMURA_TOME_150II.encendido.paso !== "undefined" && procesDropdown.value !== '0') {
            currentStep--;
            if (currentStep < 0) currentStep = 0;

            iText.innerHTML = jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction;
            //props.cStep = jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction;
            //console.log(props.cStep);
            let text = jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].objects[Object.keys(jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].objects).length].replace(/ /gi, "_");
            let stepT = document.getElementById('sText');
            stepT.setAttribute('text', "value:" + jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction);
            //console.log(document.querySelector('a-scene').object3D.getObjectByName(text, true));
            //gui.open();

            boxHelper.setFromObject(document.querySelector('a-scene').object3D.getObjectByName(text, true));
            let sobj = document.querySelector('a-scene').object3D.getObjectByName(text, true);
            var localPos = sobj.position;
            let pos = localPos.x + " " + localPos.y + " " + localPos.z;
            let dummy = document.querySelector('a-dodecahedron').object3D;
            dummy.parent = sobj.parent;
            dummy.position.set(localPos.x, localPos.y, localPos.z);
            console.log(dummy);
        }
    } catch { }
}

nextBtn = document.getElementById('nextB');
nextBtn.addEventListener('click', function () {
    nextStep();
});

function nextStep() {
    try {
        if (jData.NAKAMURA_TOME_150II.encendido.paso !== "undefined" && procesDropdown.value !== '0') {
            currentStep++;
            if (currentStep >= Object.keys(jData.NAKAMURA_TOME_150II.encendido.paso).length) currentStep = 0;

            iText.innerHTML = jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction;
            //props.cStep = jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction;
            //console.log(props.cStep);
            //gui.open();
            let text = jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].objects[Object.keys(jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].objects).length].replace(/ /gi, "_");
            let stepT = document.getElementById('sText');
            stepT.setAttribute('text', "value:" + jData.NAKAMURA_TOME_150II.encendido.paso[currentStep].instruction);
            //console.log(scene.getObjectByName(text, true));
            boxHelper.setFromObject(document.querySelector('a-scene').object3D.getObjectByName(text, true));
            let sobj = document.querySelector('a-scene').object3D.getObjectByName(text, true);
            var localPos = sobj.position;
            let pos = localPos.x + " " + localPos.y + " " + localPos.z;
            let dummy = document.querySelector('a-dodecahedron').object3D;
            dummy.parent = sobj.parent;
            dummy.position.set(localPos.x, localPos.y, localPos.z);
            console.log(dummy);
        }
    } catch { }
}