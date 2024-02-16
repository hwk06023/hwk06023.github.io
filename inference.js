// 모델 로드 함수
let model;
async function loadModel(modelPath) {
    model = await tf.loadGraphModel(modelPath);
    console.log("Model loaded.");
}

// 모델 로드 호출
model_path_detect = "./model/yolov8n.onnx"
model_path_seg = "./model/yolov8n-seg.onnx"
model_path_pose = "./model/yolov8n-pose.onnx"

console.error("모델 로드 시작")
loadModel(model_path); // 실제 모델 경로로 교체 필요
console.error("모델 로드 완료")

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
