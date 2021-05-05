/**
 * @file Script for Exporting and Importing Tabs.
 * @author Vedant Wakalkar <vedantwakalkar@gmail.com>
 */

 `use strict`;

 /**
  * Extract values (ss, mm, hh, DD, MM, YYYY) from current timestamp.
  * @version    1.0.0
  * @return    {Array}    Array of extracted values from timestamps.
  */
 const extractDateComponents = () => {
   const currentTime = new Date();
 
   return [
	 currentTime.getSeconds().toString().padStart(2, `0`), // seconds
	 currentTime.getMinutes().toString().padStart(2, `0`), // minutes
	 currentTime.getHours().toString().padStart(2, `0`), // hours
	 currentTime.getDate().toString().padStart(2, `0`), // date
	 currentTime.getMonth().toString().padStart(2, `0`), // month
	 currentTime.getFullYear().toString().padStart(2, `0`), // year
   ];
 };
 
 /**
  * Populates received message in Logs Section of Extension.
  * @version    1.0.0
  * @param    {Object} newLogObject	Object containing log time and message.
  */
 const populateLogs = (newLogObject) => {
   const logSection = document.getElementById(`logs`);
 
   if (logSection.innerText === ``) {
	 const localStorageSaveTab = window.localStorage.getItem(`saveTabs`);
 
	 if (localStorageSaveTab != null) {
	   const localStorageSaveTabObject = JSON.parse(localStorageSaveTab);
 
	   logSection.innerHTML = localStorageSaveTabObject.logs
		 .map((log) => `<p> ${log.time.bold()} - ${log.message} </p>`)
		 .join(`<br>`);
	 }
   } else {
	 const p = document.createElement(`p`);
	 p.innerHTML = `${newLogObject.time.bold()} - ${newLogObject.message} <br>`;
	 logSection.insertBefore(p, logSection.firstChild);
   }
 };
 
 /**
  * Logs and Populate received message.
  * @version    1.0.0
  * @param    {String} message	Message to be logged.
  */
 const logger = (message) => {
   const timeStamp = extractDateComponents();
   const unixTmeStamp = Date.now();
   const newLogTime = `${timeStamp[2]}:${timeStamp[1]}:${timeStamp[0]}`;
   const newLogMessage = `{ "time" : "${newLogTime}", "message" : "${message}" }`;
   const newLogObject = JSON.parse(newLogMessage);
 
   // Get 'saveTabs' from LocalStorage.
   const localStorage = window.localStorage.getItem(`saveTabs`);
 
   if (localStorage == null) {
	 // If 'saveTabs' not found in LocalStorage
	 window.localStorage.setItem(
	   `saveTabs`,
	   `{ "updated_at": ${unixTmeStamp}, "logs" : [ ${newLogMessage} ] }`
	 );
   } else {
	 const JSONObject = JSON.parse(localStorage);
	 JSONObject.logs.unshift(newLogObject);
	 JSONObject.updated_at = unixTmeStamp;
	 window.localStorage.setItem(`saveTabs`, JSON.stringify(JSONObject));
   }
 
   populateLogs(newLogObject);
 };
 
 /**
  * Logging unexpected error
  * @version    1.0.0
  * @param    {String} error   Error message
  */
 const reportError = (error) => {
   logger(error);
 };
 
 /**
  * Logging successful creation of tab for provided url.
  * @version    1.0.0
  * @param    {Object} tab	Newly create tab object.
  */
 const newTabOnCreated = (tab) => {
   logger(
	 `Created new tab for ${(tab.status === "loading"
	   ? tab.pendingUrl
	   : tab.title
	 ).italics()}`
   );
 };
 
 /**
  * Read the uploaded file and open corresponding URLs in new tabs.
  * @version    1.0.0
  * @param    {Object} fileInput	Event Object of File Input when a file is uploaded.
  */
 const importTabs = (fileInput) => {
   // Read the data from uploaded file.
   const file = fileInput.target.files[0];
 
   const reader = new FileReader();
   reader.readAsText(file, `UTF-8`);
   reader.onload = (e) => {
	 const listOfTabs = JSON.parse(e.target.result).tabs;
 
	 for (const url of listOfTabs) {
	   try {
		 // For Firefox
		 const newTab = browser.tabs.create({
		   url: url,
		 });
 
		 newTab.then(newTabOnCreated, reportError);
	   } catch (error) {
		 try {
		   // For Chrome
		   const newTab = chrome.tabs.create({
			 url: url,
		   });
 
		   newTab.then(newTabOnCreated, reportError);
		 } catch (error) {
		   console.log(error);
		 }
	   }
	 }
   };
 };
 
 /**
  * Returns default or user input file name.
  * Default File Name Format : "Save_Tabs_DD-MM-YYYY-hh-mm-ss.json"
  * @version    1.0.0
  * @return   	{String}	Name of the file.
  */
 const getFilename = () => {
   const filenameElement = document.getElementById(`file-name`);
 
   const fileName = filenameElement.value.trim().replace(/[^\w\s_\(\)\-]/gi, ``);
 
   if (fileName == ``) {
	 // Default File Name.
	 const currentTime = extractDateComponents();
	 return `Save_Tabs_${currentTime[3]}-${currentTime[4]}-${currentTime[5]}-${currentTime[2]}-${currentTime[1]}-${currentTime[0]}.json`;
   } else {
	 // User Input File Name.
	 return `${fileName}.json`;
   }
 };
 
 /**
  * Download file (in JSON format) containing list of all open tabs.
  * @version    1.0.0
  * @param    {Object} tabs	Detailed array of all open Tabs.
  */
 const downloadFile = (tabs) => {
   // Download Queue to keep track of each download event.
   const downloadQueue = new Map();
 
   const fileContent = `{ "tabs" : [ ${tabs
	 .map((tab) => '"' + tab.url + '"')
	 .join(",")} ] }`;
 
   // Create a Blob of fileContent
   const file = new Blob([fileContent], {
	 type: `plain/text`,
   });
 
   const fileName = getFilename();
   const url = window.URL.createObjectURL(file);
 
   const metaData = {
	 url: url,
	 filename: fileName,
	 saveAs: true,
	 conflictAction: `uniquify`,
   };
 
   logger(`Ready for download - ${fileName.italics()}`);
 
   try {
	 browser.downloads.download(metaData).then(
	   (id) => {
		 downloadQueue.set(id, { url, fileName });
		 browser.downloads.onChanged.addListener(onChangedListener);
	   },
	   (error) => {
		 logger(`Download interrupted - ${fileName.italics()}`);
	   }
	 );
   } catch (error) {
	 chrome.downloads.download(metaData, (id) => {
	   downloadQueue.set(id, { url, fileName });
	   chrome.downloads.onChanged.addListener(onChangedListener);
	 });
   }
 
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
 
	   logger(
		 `Download ${
		   delta.state.current
		 } - ${mappedValueForID.fileName.italics()}`
	   );
 
	   try {
		 browser.downloads.onChanged.removeListener(onChangedListener);
	   } catch (error) {
		 chrome.downloads.onChanged.removeListener(onChangedListener);
	   }
	 }
   };
 };
 
 /**
  * Query browser window to get list of all open tabs.
  * On successfull query, file is downloaded or error is logged on failure.
  * @version    1.0.0
  */
 const exportTabs = () => {
   try {
	 browser.tabs
	   .query({
		 currentWindow: true,
	   })
	   .then(downloadFile, reportError);
   } catch (error) {
	 try {
	   chrome.tabs
		 .query({
		   currentWindow: true,
		 })
		 .then(downloadFile, reportError);
	 } catch (error) {
	   console.log(error);
	 }
   }
 };
 
 /**
  * Checks and deletes (older than 10 mins) data stored in localstorage
  * @version    1.0.0
  */
 const localStorageExpiryCheck = () => {
   const localStorageSaveTab = window.localStorage.getItem(`saveTabs`);
 
   if (localStorageSaveTab != null) {
	 const JSONObject = JSON.parse(localStorageSaveTab);
 
	 // Calculate age of stored data.
	 const timeDifference = (Date.now() - JSONObject.updated_at) / 60000;
 
	 if (timeDifference > 10.0) window.localStorage.removeItem(`saveTabs`);
   }
 };
 
 /**
  * Intializes required checks and listeners.
  * @version    1.0.0
  */
 const init = () => {
   // Check and Clear (old than 10 minutes) data stored.
   localStorageExpiryCheck();
 
   // Sync logs with data in local storage.
   populateLogs(``);
 
   // Detect if file is selected using HTML input file.
   document.getElementById(`file`).addEventListener(`change`, importTabs);
 
   // Listen on clicking Export button.
   document.getElementById(`export`).addEventListener(`click`, exportTabs);
 };
 
 init();
 