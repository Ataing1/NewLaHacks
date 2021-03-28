const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const teachGrid = document.getElementById('teacher-video')
const myPeer = new Peer();
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(stream => {
	addVideoStream(myVideo, stream)

	myPeer.on('call', call => {
		call.answer(stream)
		const video = document.createElement('video')
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
	})

	socket.on('user-connected', userId => {
		connectToNewUser(userId, stream)
	})
})

socket.on('user-disconnected', userId => {
	if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
	socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
	const call = myPeer.call(userId, stream)
	const video = document.createElement('video')
	call.on('stream', userVideoStream => {
		addVideoStream(video, userVideoStream)
	})
	call.on('close', () => {
		video.remove()
	})

	peers[userId] = call
}

function addVideoStream(video, stream) {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	if(!teachGrid.hasChildNodes()){
		console.log("teach has no child");
		teachGrid.appendChild(video);
	}else{
		console.log("adding  student");
		videoGrid.append(video)
	}


}