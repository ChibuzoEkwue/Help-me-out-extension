console.log('I have been injected');
const recordVideo = async () => {


    let stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: true,
		});
	//needed for better browser support
	const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
		? "video/webm; codecs=vp9"
		: "video/webm";

	let mediaRecorder = new MediaRecorder(stream, {
		mimeType: mime,
	});

	let chunks = [];
	mediaRecorder.addEventListener("dataavailable", function (e) {
		chunks.push(e.data);
	});

	mediaRecorder.addEventListener("stop", function () {
		let blob = new Blob(chunks, {
			type: chunks[0].type,
		});
		console.log(blob);
		let url = URL.createObjectURL(blob);

		let a = document.createElement("a");
		a.href = url;
		a.download = "video.webm";
		a.click();
	});

	//start the recorder manually
	mediaRecorder.start();
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.action === "request_rec") {
		console.log("recording");
		sendResponse(`Processed ${message.action}`);
		
		recordVideo();
	}
});
