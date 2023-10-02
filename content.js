console.log("I have been injected");

const recordVideo = async () => {
	// Get the rec id from the server
	const reqId = await fetch("http://archiflow.pythonanywhere.com/create/", {
		method: "POST",
	});

	const { video_id } = await reqId.json();

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

	mediaRecorder.addEventListener("dataavailable", async (e) => {
		chunks.push(e.data);

		// Send binary data to the backend

		
	});

	mediaRecorder.addEventListener("stop", async () => {
		let blob = new Blob(chunks, {
			type: chunks[0].type,
		});

		try {
			await fetch(
				`http://archiflow.pythonanywhere.com/complete_job/${video_id}/`,
				{
					method: "POST",
				}
			);
			console.log("Sent succesfully");
		} catch (error) {
			console.log("Error", error);
		}

		// let formData = new FormData();

		// formData.append("blob_data", blob, "video.webm");
		// formData.append("id", id);
		// formData.append("order", 0);
		// formData.append("last_chunk", true);

		// try {
		// 	const res = await fetch(
		// 		"https://hng-screen-recorder-api.azurewebsites.net/api/stop-recording",
		// 		{
		// 			method: "POST",
		// 			body: formData,
		// 		}
		// 	);

		// 	if (res.ok) {
		// 		console.log("Video has been uploaded successfully");
		// 		console.log(res);
		// 	} else {
		// 		console.error("cannot upload video right now");
		// 	}
		// } catch (error) {
		// 	console.error("Error uploading video ", error);
		// }

		// alert(formData);
		let url = URL.createObjectURL(blob);

		let a = document.createElement("a");
		a.href = url;
		a.download = "video.webm";
		a.click();
	});

	mediaRecorder.start();
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "request_rec") {
		console.log("recording");
		sendResponse(`Processed ${message.action}`);

		recordVideo();
	}
});
