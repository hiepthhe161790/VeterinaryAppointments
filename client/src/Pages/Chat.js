// import React, { useEffect, useRef, useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import { Peer } from 'peerjs';
// import io from 'socket.io-client';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../styles/chat.css';

// const Chat = () => {
//   const videoDivRef = useRef(null);
//   const hideARef = useRef(null);
//   const hideVRef = useRef(null);
//   const [userStream, setUserStream] = useState(null);
//   const userConnected = useRef({});
//   const myPeer = useRef(null);
//   const socket = useRef(null);
//   const navigate = useHistory();

//   useEffect(() => {
//     myPeer.current = new Peer();
//     socket.current = io('https://melted-video-chat-server.onrender.com');

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         setUserStream(stream);
//         addStream(createVideoElement(), stream);

//         myPeer.current.on('call', call => {
//           call.answer(stream);
//           call.on('stream', userStream => addStream(createVideoElement(), userStream));
//         });

//         socket.current.on('user-join', userID => {
//           connectNewUser(userID, stream);
//         });
//       })
//       .catch(err => console.error('Media Error:', err));

//     myPeer.current.on('open', id => {
//       const RoomID = localStorage.getItem("RoomID");
//       socket.current.emit('join-room', RoomID, id);
//     });

//     socket.current.on('user-disconnected', userID => {
//       if (userConnected.current[userID]) {
//         userConnected.current[userID].close();
//       }
//     });

//     return () => {
//       socket.current.disconnect();
//       myPeer.current.destroy();
//     };
//   }, []);

//   const createVideoElement = () => {
//     const video = document.createElement('video');
//     video.muted = true;
//     return video;
//   };

//   const addStream = (video, stream) => {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => video.play());
//     videoDivRef.current.append(video);
//   };

//   const connectNewUser = (userID, stream) => {
//     const call = myPeer.current.call(userID, stream);
//     const video = createVideoElement();

//     call.on('stream', userStream => addStream(video, userStream));
//     call.on('close', () => video.remove());

//     userConnected.current[userID] = call;
//   };

//   const toggleVideo = () => {
//     if (userStream) {
//       const videoTrack = userStream.getTracks().find(track => track.kind === 'video');
//       videoTrack.enabled = !videoTrack.enabled;
//       hideVRef.current.style.backgroundColor = videoTrack.enabled ? 'white' : 'black';
//     }
//   };

//   const toggleAudio = () => {
//     if (userStream) {
//       const audioTrack = userStream.getTracks().find(track => track.kind === 'audio');
//       audioTrack.enabled = !audioTrack.enabled;
//       hideARef.current.style.backgroundColor = audioTrack.enabled ? 'white' : 'black';
//     }
//   };

//   return (
//     <div>
//       <div id="logoDiv">
//         <img id="logo" src="https://mdbootstrap.com/img/Photos/new-templates/animal-shelter/logo.png" alt="logo" />
//       </div>
//       <div id="videoDiv" ref={videoDivRef}></div>
//       <div id="controls">
//         <p id="hangup" className="icon-color" onClick={() => navigate('/index')}>
//           <img width="50px" className="icon" src="https://icons.veryicon.com/png/o/miscellaneous/cloud-call-center/hang-up.png" alt="hangup" />
//         </p>
//         <p id="hideV" className="icon-color" ref={hideVRef} onClick={toggleVideo}>
//           <img width="50px" className="icon" src="./images/cam.png" alt="toggle video" />
//         </p>
//         <p id="hideA" className="icon-color" ref={hideARef} onClick={toggleAudio}>
//           <img className="icon" src="./images/mike.png" alt="toggle audio" />
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Chat;
