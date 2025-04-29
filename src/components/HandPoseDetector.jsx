import { useEffect, useRef } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const HandDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    };

    const detectHands = async () => {
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detector = await handPoseDetection.createDetector(model, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'lite',
        maxHands: 1,
      });

      const detect = async () => {
        if (
          videoRef.current.readyState === 4 &&
          canvasRef.current
        ) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');

          // espejo
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          const hands = await detector.estimateHands(video);
          hands.forEach((hand) => {
            hand.keypoints.forEach(({ x, y }) => {
              ctx.beginPath();
              ctx.arc(canvas.width - x, y, 5, 0, 2 * Math.PI); // invertimos X para que coincida con el espejo
              ctx.fillStyle = 'red';
              ctx.fill();
            });
          });
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    setupCamera().then(detectHands);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <canvas ref={canvasRef} className="absolute" />
      <video
        ref={videoRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default HandDetection;
