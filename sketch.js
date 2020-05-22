var net;
var video;
var currentResult;
var img;

function setup() {
  createCanvas(800, 600);

  video = createCapture(VIDEO);
  
  // The line below + the videoLoadedCallback were added 
  // after the video was shot to fix compability issues.
  video.elt.addEventListener('loadeddata', videoLoadedCallback);
  
  video.size(800, 600);
  video.hide();

  img = loadImage("glasses.png");
}

function draw() {
  background(255);
  image(video, 0, 0, 800, 600);

  if (currentResult) {
    var nose = currentResult.keypoints[0].position;
    var eye1 = currentResult.keypoints[1].position;
    var eye2 = currentResult.keypoints[2].position;

    var scale = (eye1.x - eye2.x) / 250;

    image(img,
      nose.x - 275 * scale,
      nose.y - 200 * scale,
      img.width * scale,
      img.height * scale);
  }
}

// The new callback
function videoLoadedCallback() {
  print("Video Loaded");
  posenet.load().then(loadedCallback);
}

function loadedCallback(model) {
  print("Model loaded!");
  net = model;
  net.estimateSinglePose(video.elt).then(estimateCallback);
}

function estimateCallback(result) {
  currentResult = result;
  net.estimateSinglePose(video.elt).then(estimateCallback);
}