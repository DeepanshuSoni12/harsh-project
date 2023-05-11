import "./App.css";
import { useState, useRef } from "react";
import AudioRecorder from "../src/AudioRecorder";
import {MdAudiotrack} from "react-icons/md"
const App = () => {
    let [recordOption, setRecordOption] = useState("video");
    const toggleRecordOption = (type) => {
        return () => {
            setRecordOption(type);
        };
    };
    return (
        <div className="bordered">
           <AudioRecorder />
        </div>
    );
};
export default App;