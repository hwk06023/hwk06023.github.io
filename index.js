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

// 모델 로드 함수
let model;
async function loadModel(modelPath) {
    model = await tf.loadGraphModel(modelPath);
    console.log("Model loaded.");
}

// 모델 로드 호출
model_path = "~~~"
loadModel(model_path); // 실제 모델 경로로 교체 필요

async function performInference() {
    if (!model) {
        console.log("Model not loaded yet");
        return;
    }

    const tensor = tf.browser.fromPixels(video).resizeNearestNeighbor([224, 224]).toFloat().expandDims(0);
    const prediction = await model.predict(tensor).data();
    console.log(prediction);

    // 예측 데이터 처리 (예: 결과 표시 또는 비디오 위에 경계 상자 그리기)
    displayPrediction(prediction);
}

setInterval(performInference, 1000); // 1초마다 추론 실행

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', event => {
        const modelFile = event.target.getAttribute('data-model');
        modelInference(modelFile);
    });
});

function modelInference(modelFile) {
    alert(`Model inference with ${modelFile}`);
}

function displayPrediction(prediction) {
    // 예측 결과를 해석하는 로직이 여기에 들어갑니다.
    // 예시로, 가장 높은 확률을 가진 클래스의 인덱스를 찾습니다.
    const highestPredictionIndex = prediction.indexOf(Math.max(...prediction));
    
    // 결과를 표시할 div 요소를 선택합니다.
    const predictionElement = document.getElementById('prediction');

    // 결과를 div에 표시합니다.
    predictionElement.innerText = `Predicted class: ${highestPredictionIndex} with probability ${prediction[highestPredictionIndex].toFixed(2)}`;
}

// p5.js 관련 코드
let nodes = [];
const nodeCount = 150;
const maxDistance = 150;
const mouseInfluenceSize = 100;
const minBrightness = 0;
const maxBrightness = 250;
const brightnessStep = 1;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
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