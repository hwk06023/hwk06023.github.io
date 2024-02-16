// 이전 자바스크립트 코드 유지
var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err0r) {
            console.log("Something went wrong!");
        });
}

// p5.js 관련 코드
let nodes = [];
const nodeCount = 150;
const maxDistance = 150;
const mouseInfluenceSize = 100;
const minBrightness = 0;
const maxBrightness = 250;
const brightnessStep = 1;

window.addEventListener('resize', () => {
    nodes = [];
    setup();
});

function setup() {
    let canvas = createCanvas(document.body.clientWidth, document.body.clientHeight);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            position: createVector(random(width), random(height)),
            velocity: createVector(random(-0.3, 0.3), random(-0.3, 0.3)),
            brightness: random(50, 150),
            increasing: true,
            size: random(2, 15)
        });
    }
}

function draw() {
    background(0);
    nodes.forEach((node, i) => {
        let mouseDistance = dist(node.position.x, node.position.y, mouseX, mouseY);
        if (mouseDistance < mouseInfluenceSize) {
            let attraction = p5.Vector.sub(createVector(mouseX, mouseY), node.position);
            attraction.setMag(0.5);
            node.velocity.lerp(attraction, 0.2);
        }
        let lineAlpha = map(mouseDistance, 0, mouseInfluenceSize, 255, 220);
        stroke(140, 0, 140, lineAlpha);
        strokeWeight(1);
        for (let j = i + 1; j < nodes.length; j++) {
            let otherNode = nodes[j];
            let distance = dist(node.position.x, node.position.y, otherNode.position.x, otherNode.position.y);
            if (distance < maxDistance) {
                line(node.position.x, node.position.y, otherNode.position.x, otherNode.position.y);
            }
        }
        if (mouseDistance < maxDistance) {
            line(node.position.x, node.position.y, mouseX, mouseY);
        }
        let alpha = map(node.brightness, 50, 150, 100, 200);
        fill(140, 0, 140, alpha);
        noStroke();
        ellipse(node.position.x, node.position.y, node.size, node.size);
        if (node.increasing) {
            node.brightness += brightnessStep;
            if (node.brightness >= maxBrightness) {
                node.increasing = false;
            }
        } else {
            node.brightness -= brightnessStep;
            if (node.brightness <= minBrightness) {
                node.increasing = true;
            }
        }
        node.position.add(node.velocity);
        if (node.position.x < 0 || node.position.x > width) node.velocity.x *= -1;
        if (node.position.y < 0 || node.position.y > height) node.velocity.y *= -1;
    });
}