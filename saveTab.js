/**
 * @file Script for Exporting and Importing Tabs.
 * @author Vedant Wakalkar <vedantwakalkar@gmail.com>
 */

`use strict`;

window.addEventListener(`DOMContentLoaded`, () => {
	/**
	 * Firefox			1
	 * Google Chrome	2
	 */
	let browserDetected = 1;

	// Browser's API Object. 
	let browserAPI;

	try {
		// Firefox
		browserAPI = browser;
	} catch (error) {
		// Chrome
		browserDetected = 2;
		browserAPI = chrome;
	}

	/**
	 * Store logs in local storage.
	 * @version    1.1.0
	 * @param    {String} message	Logged Message.
	 */
	const logger = (message) => {
		const logObject = {
			time: new Date().valueOf(),
			message: message,
		};

		// Check if 'saveTabs' in present or not.
		browserAPI.storage.local.get(`saveTabs`, (object) => {
			// Latest logged message time.
			const updated_at = logObject.time;
			let FinalLogsQueue;
			if (
				object &&
				Object.keys(object).length === 0 &&
				object.constructor === Object
			) {
				FinalLogsQueue = [logObject];
			} else {
				object.saveTabs.logs.unshift(logObject);
				FinalLogsQueue = object.saveTabs.logs;
			}

			// Store logs to local storage and then empty LoggerQueue.
			browserAPI.storage.local.set(
				{
					saveTabs: {
						logs: FinalLogsQueue,
						updated_at: updated_at,
					},
				});
		});
	};

	/**
	 * Populates Logs Section of Extension by logs stored in local storage.
	 * @version    1.1.0
	 */
	const populateLogs = () => {
		// DOM of log section.
		const logSection = document.getElementById(`logs`);

		// Get logs from local storage
		browserAPI.storage.local.get(`saveTabs`, (object) => {
			if (object.saveTabs !== undefined) {
				logSection.innerHTML = object.saveTabs.logs
					.map(
						(log) =>
							`<p> ${new Date(log.time).toLocaleTimeString().bold()} - ${log.message
							} </p>`
					)
					.join(`<br>`);
			}
		});
	};

	/**
	 * Logging error or success message.
	 * @version	1.0.0
	 * @param	{Object}	delta		Object returned from Promise.
	 * @param	{String} 	messageType Type of Message
	 */
	const logErrorOrSuccess = (messageType, delta) => {
		switch (messageType) {
			case `error`:
				logger(delta.message || delta);
				break;
			case `readyForDownload`:
				logger(`Ready for download - ${delta.fileName.italics()}`);
				break;
			case `downloadedStatus`:
				logger(`Download ${delta.state} - ${delta.fileName.italics()}`);
				break;
		}
	};

	/**
	 * Read the uploaded file and open corresponding URLs in new tabs.
	 * @version    1.1.0
	 * @param    {Object} fileInput	Event Object of File Input when a file is uploaded.
	 */
	const importTabs = (fileInput) => {
		// Read the data from uploaded file.
		const file = fileInput.target.files[0];

		const reader = new FileReader();
		reader.readAsText(file, `UTF-8`);
		reader.onload = (e) => {
			const fileContent = JSON.parse(e.target.result);

			// Send Message to background.js to run creation of tabs any group.
			browserAPI.runtime.sendMessage(
				{
					type: `imported_file_content`,
					data: fileContent,
				},
				(response) => {
					try {
						console.log(response);
					} catch (error) {
						console.log(error);
					}
				}
			);
		};
	};

	/**
	 * Returns default or user input file name.
	 * Default File Name Format : "Save_Tabs_DD-MM-YYYY-hh-mm-ss-*M.json"
	 * @version    1.0.0
	 * @return   	{String}	Name of the file.
	 */
	const getFilename = () => {
		const filenameElement = document.getElementById(`file-name`);

		const fileName = filenameElement.value
			.trim()
			.replace(/[^\w\s_\(\)\-]/gi, ``);

		if (fileName == ``) {
			// Default File Name.
			return `Save_Tabs_${new Date()
				.toLocaleString()
				.replaceAll(/(, )| /g, '_')
				.replaceAll(/[,://]/g, '-')}.json`;
		} else {
			// User Input File Name.
			return `${fileName}.json`;
		}
	};

	/**
	 * Download file (in JSON format) containing list of all open tabs.
	 * @version    1.1.0
	 * @param    {Object} tabs	Detailed array of all open Tabs.
	 */
	const downloadFile = (tabs) => {
		// Download Queue to keep track of each download event.
		const downloadQueue = new Map();

		// Group Tabs Promise Queue to keep track of completion of tabGroups promise.
		const groupTabsQueue = new Map();

		// Promise array to keep track of all promises requested.
		let promiseArray = [];

		// Structure of file which will be downloaded
		let fileContent = Object({
			tabs: [],
		});

		/**
		 * To check if file has completed download or not.
		 * @version    1.0.0
		 * @param    {Object} delta		Object of download intiated file.
		 */
		const onChangedListener = (delta) => {
			if (
				downloadQueue.has(delta.id) &&
				delta.state &&
				delta.state.current !== `in_progress`
			) {
				// Check if the download ID present in download queue. If present then check status.
				const mappedValueForID = downloadQueue.get(delta.id);

				// Delete entry for download ID from download queue.
				downloadQueue.delete(delta.id);

				// Revoke File URL created.
				window.URL.revokeObjectURL(mappedValueForID.url);

				logErrorOrSuccess(`downloadedStatus`, {
					state: delta.state.current,
					fileName: mappedValueForID.fileName,
				});

				// Remove Listener
				browserAPI.downloads.onChanged.removeListener(onChangedListener);
			}
		};

		/**
		 * Convert File Content Object to blob and downloads file.
		 * @version    1.0.0
		 * @param    {Object} fileContent	Object containing data related to tabs.
		 */
		const initiateDownload = (fileContent) => {
			// Create Blob of file content
			const file = new Blob([JSON.stringify(fileContent)], {
				type: `plain/text`,
			});

			// Get file name
			const fileName = getFilename();

			// Create URL of Blob file
			const url = window.URL.createObjectURL(file);

			const metaData = {
				url: url,
				filename: fileName,
				saveAs: true,
				conflictAction: `uniquify`,
			};

			logErrorOrSuccess(`readyForDownload`, {
				fileName: fileName,
			});

			try {
				// Firefox
				browserAPI.downloads.download(metaData).then(
					(id) => {
						downloadQueue.set(id, { url, fileName });

						// Add Listener to keep track of download
						browserAPI.downloads.onChanged.addListener(onChangedListener);
					},
					() => {
						logErrorOrSuccess(`downloadedStatus`, {
							state: `interrupted`,
							fileName: fileName,
						});
					}
				);
			} catch (error) {
				// Chrome
				browserAPI.downloads.download(metaData, (id) => {
					downloadQueue.set(id, { url, fileName });

					// Add Listener to keep track of download
					browserAPI.downloads.onChanged.addListener(onChangedListener);
				});
			}
		};

		// Restructuring tabs with required details (url and groupId)
		tabs.map((tab) => {
			if (tab.groupId === undefined || tab.groupId == -1) {
				fileContent.tabs.push({
					url: tab.url,
				});
			} else {
				fileContent.tabs.push({
					url: tab.url,
					groupId: tab.groupId,
				});

				if (tab.groupId != -1 && !groupTabsQueue.has(tab.groupId)) {
					groupTabsQueue.set(tab.groupId, 1);
					promiseArray.push(browserAPI.tabGroups.get(tab.groupId));
				}
			}
		});

		if (!groupTabsQueue.size || promiseArray.length) {
			// if group details are requested
			Promise.allSettled(promiseArray).then((results) => {
				results.forEach((result) => {
					groupTabsQueue.delete(result.value.id);

					if (fileContent.groups === undefined) {
						fileContent[`groups`] = {};
					}

					fileContent.groups[result.value.id] = {
						title: result.value.title,
					};

					// If all promises are fulfilled then intiate download.
					if (groupTabsQueue.size == 0) {
						initiateDownload(fileContent);
					}
				});
			}, logErrorOrSuccess.bind(null, `error`));
		} else {
			// If no group details request initiated.
			initiateDownload(fileContent);
		}
	};

	/**
	 * Query browser window to get list of all open tabs.
	 * On successfull query, file is downloaded or error is logged on failure.
	 * @version    1.0.0
	 */
	const exportTabs = () => {
		// Get list all tabs open in current browser window
		browserAPI.tabs
			.query({
				currentWindow: true,
			})
			.then(downloadFile, logErrorOrSuccess.bind(null, `error`));
	};

	/**
	 * Checks and deletes (older than 10 mins) data stored in localstorage
	 * @version    1.0.0
	 */
	const localStorageExpiryCheck = () => {
		// Check if 'saveTabs' in present or not.
		browserAPI.storage.local.get(`saveTabs`, (object) => {
			if (object.saveTabs !== undefined)
				(Date.now() - object.saveTabs.updated_at > 600000) ?
					browserAPI.storage.local.clear() : populateLogs();
		});
	};

	/**
	 * Intializes required checks and listeners.
	 * @version    1.0.0
	 */
	const init = () => {
		// Check and Clear (old than 10 minutes) data stored.
		localStorageExpiryCheck();

		// Detect if file is selected using HTML input file.
		document.getElementById(`file`).addEventListener(`change`, importTabs);

		// Listen on clicking Export button.
		document.getElementById(`export`).addEventListener(`click`, exportTabs);

		// Sync updated storage under Logs section
		browserAPI.storage.onChanged.addListener((changes, area) => {
			if (area === `local` && changes.saveTabs !== undefined) {
				populateLogs();
			}
		});
	};

	init();
});
