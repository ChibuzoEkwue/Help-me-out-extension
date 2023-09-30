chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete") {
		chrome.scripting
			.executeScript({
				target: { tabId },
				files: ["./content.js"],
			})
			.then(() => {
				console.log("we have injected the content script");
			})
			.catch((err) => console.log(err));
	}
});