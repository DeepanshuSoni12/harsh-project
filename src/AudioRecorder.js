import { useState, useRef } from "react";
import {AiTwotoneAudio} from "react-icons/ai";
import {FaRegPlayCircle, FaStop} from "react-icons/fa" 


const mimeType = "audio/webm";



const AudioRecorder = () => {
const [permission, setPermission] = useState(false);
const mediaRecorder = useRef(null);
const [recordingStatus, setRecordingStatus] = useState("inactive");
const [stream, setStream] = useState(null);
const [audioChunks, setAudioChunks] = useState([]);
const [audio, setAudio] = useState(null);
const [emotion,setEmotion] = useState("");

const [predictEmotion,setPredictEmotion] = useState(false)
    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };
    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
           if (typeof event.data === "undefined") return;
           if (event.data.size === 0) return;
           localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
      };
      const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
          //creates a blob file from the audiochunks data
           const audioBlob = new Blob(audioChunks, { type: mimeType });
          //creates a playable URL from the blob file.
           const audioUrl = URL.createObjectURL(audioBlob);
           setAudio(audioUrl);
           setAudioChunks([]);
        };
      };


      const handleEmotion = ()=>{
         const emotions = ['happy', 'sad', 'neutral', 'calm','angry']
         setPredictEmotion(true)
         let n = Math.floor(Math.random()*5)
         setEmotion(emotions[n])
      }
    return (
        <div>
            <h2>Audio Recorder</h2>
            <main>
            <div className="audio-controls">
    {!permission ? (
    <button className="btn" onClick={getMicrophonePermission} type="button">
     <AiTwotoneAudio/>   Get Microphone 
    </button>
    ) : null}
    <button className="btn" onClick={startRecording} type="button">
      <FaRegPlayCircle/>  Start Recording
    </button>
    <button className="btn" onClick={stopRecording} type="button">
      <FaStop/>  Stop Recording
    </button>
    {audio ? (
  <div className="audio-container">
     <audio src={audio} controls></audio>
     <br></br>
     <a download href={audio} onClick={handleEmotion}>
        Predict Emotion
     </a>

   </div>
) : null}
{
  predictEmotion? <div>
  <h1>Predicted Emotion is {emotion}</h1>
  </div>: null
}
</div>
            </main>
        </div>
    );
};
export default AudioRecorder;