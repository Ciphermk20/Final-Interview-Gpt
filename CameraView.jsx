import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

const CameraView = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [chunks, setChunks] = useState([]);
  const [stream, setStream] = useState(null);

  // Expose functions to the Parent (InterviewSession)
  useImperativeHandle(ref, () => ({
    startRecording: () => {
      if (!stream) {
        console.error("No stream available to record");
        return;
      }
      
      setChunks([]);
      
      // Check if audio tracks exist in the stream
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.warn("No audio tracks found! Check microphone permissions.");
      }

      // Use a standard container that includes both VP8 (video) and Opus (audio)
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      
      try {
        mediaRecorderRef.current = new MediaRecorder(stream, options);
        
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setChunks((prev) => [...prev, e.data]);
          }
        };

        mediaRecorderRef.current.start(1000); // Record in 1-second timeslices
        console.log("Recording started (Video + Audio)...");
      } catch (err) {
        console.error("MediaRecorder Error:", err);
      }
    },

    stopRecording: async () => {
      return new Promise((resolve) => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
          resolve({ filename: "no-video.webm" });
          return;
        }

        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          console.log("Video Blob created, size:", blob.size);
          const uploadResult = await uploadVideo(blob);
          resolve(uploadResult); 
        };

        mediaRecorderRef.current.stop();
      });
    }
  }));

  const uploadVideo = async (videoBlob) => {
    const formData = new FormData();
    formData.append('video', videoBlob);

    try {
      const response = await fetch('http://localhost:5000/api/upload/video', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data; // returns { message, filename }
    } catch (err) {
      console.error("Upload Error:", err);
      return { filename: "error-upload.webm" };
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        // Requesting BOTH audio and video explicitly
        const userStream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: true 
        });
        
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Camera/Mic Access Denied:", err);
        alert("Please allow Camera and Microphone access in your browser settings.");
      }
    };
    
    setupCamera();

    // Cleanup: Stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center">
      <video 
        ref={videoRef} 
        autoPlay 
        muted // Muted only locally so you don't hear your own echo
        playsInline
        className="w-full h-full object-cover scale-x-[-1]" 
      />
      
      {/* Visual Mic Indicator */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/20">
        <div className={`w-2 h-2 rounded-full ${stream?.getAudioTracks()[0]?.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Mic Active</span>
      </div>
    </div>
  );
});

export default CameraView;