document.addEventListener("DOMContentLoaded", () => {
	const startVideoButton = document.querySelector("button#record-btn");

	startVideoButton.addEventListener("click", () => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ action: "request_rec" },
				function (response) {
					if (!chrome.runtime.lastError) {
						console.log(response);
					} else {
						console.log(chrome.runtime.lastError);
					}
				}
			);
		});
	});
});
