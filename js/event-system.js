let iText, jData, prevBtn, nextBtn;
let boxHelper;
let worldPos;
//console.log(document.getElementById('leftHand').object3D);
Start();
function Start() {
    var scene = document.querySelector('a-scene').object3D;
    var body = scene.getObjectByName('Body');
    console.log(body);
}

document.getElementById('cRed').addEventListener('click', function(){
    console.log("Clicked Red");
    bodyColor(.2, 0, 0);
});

document.getElementById('cGreen').addEventListener('click', function(){
    console.log("Clicked Green");
    bodyColor(0, .2, 0);
});

document.getElementById('cBlue').addEventListener('click', function(){
    console.log("Clicked Blue");
    bodyColor(0.05, 0.1, 0.2);
});

function bodyColor(r, g, b){
    var scene = document.querySelector('a-scene').object3D;
    var body = scene.getObjectByName('Body');
    console.log(body);
    body.material.color.r = r;
    body.material.color.g = g;
    body.material.color.b = b;
}