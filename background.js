/**
 * @file Background Script for toggling Side Panel (Firefox).
 * @author Vedant Wakalkar <vedantwakalkar@gmail.com>
 */

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

// Save Tabs Settings Object
let saveTabsSettingsObject;

// Keep track of all Logs and emptied when stored in local storage. 
let LoggerQueue;

/**
 * Logging error or success message.
 * @version	1.0.0
 * @param	{Object}	delta		Object returned from Promise.
 * @param	{String} 	messageType Type of Message
 */
const logErrorOrSuccess = (messageType, delta) => {
    // Object containing metadata related to error or success
    let logObject = {
        // type 	: {error, success}
        // message	: {Message}				If type is 'error'
        // subType 	: {tab, group} 			If type is 'success'
        // url 		: {url_link} 			If subType is 'tab'
        // groupName: {Name of the Group} 	If subType is 'group'
    };

    // If logging enabled.
    if (saveTabsSettingsObject.logsState) {
        switch (messageType) {
            case `error`:
                logObject = {
                    type: `error`,
                    message: (delta.message || delta)
                };
                break;
            case `newTabCreated`:
                logObject = {
                    type: `success`,
                    subType: `tab`,
                    url: (delta.status === "loading" ? delta.pendingUrl : delta.title)
                };
                break;
            case `newGroupCreated`:
                logObject = {
                    type: `success`,
                    subType: `group`,
                    groupName: delta.title
                };
                break;
        }

        LoggerQueue.unshift({
            time: new Date().valueOf(),
            data: logObject
        });
    }
};

/**
 * Functionality to parse and create tabs and groups from recevied list of metadata of tabs and groups.
 * @version    1.0.0
 * @param    {Object} fileContent	Contains list of meta data of tabs and groups (if any).
 */
const importTabs = (fileContent) => {
    // Extract list of tabs
    const listOfTabs = fileContent.tabs;

    // Group Tabs Queue to keep track of completion of tabGroups promise.
    const groupTabsQueue = new Map();

    // Array of Promises requested.
    const groupedTabsPromiseArray = [];

    for (const tab of listOfTabs) {
        if (browserDetected == 1 || tab.groupId === undefined || tab.groupId == -1) {
            // 1. If tabs are opened in FireFox
            // 2. For Tabs which are not grouped.

            // Create new tab and log outcome.
            browserAPI.tabs
                .create({
                    url: tab.url,
                    active: false
                })
                .then(
                    logErrorOrSuccess.bind(null, `newTabCreated`),
                    logErrorOrSuccess.bind(null, `error`)
                );
        } else {
            // Check if URL to be grouped.
            if (groupTabsQueue.has(tab.url)) {
                const getGroup = groupTabsQueue.get(tab.url);

                getGroup.set(
                    tab.groupId,
                    getGroup.has(tab.groupId) ? getGroup.get(tab.groupId) + 1 : 1
                );

                groupTabsQueue.set(tab.url, getGroup);
            } else {
                groupTabsQueue.set(tab.url, new Map([[tab.groupId, 1]]));
            }

            groupedTabsPromiseArray.push(
                // Create new tab 
                browserAPI.tabs.create({
                    url: tab.url,
                    active: false,
                })
            );
        }
    }

    /**
     * Store all logs from LoggerQueue to Local Storage.
     * @version    1.0.0
     */
    const insertNewLogs = () => {
        // If logging enabled.
        if (saveTabsSettingsObject.logsState) {
            // Check if 'saveTabs' in present or not.
            browserAPI.storage.local.get(`saveTabs`, (object) => {

                setTimeout(() => {
                    let FinalLogsQueue = [];

                    // Latest logged message time.
                    const updated_at = LoggerQueue[0].time;

                    if (
                        object &&
                        Object.keys(object).length === 0 &&
                        object.constructor === Object
                    ) {
                        FinalLogsQueue = LoggerQueue;
                    } else {
                        object.saveTabs.logs.unshift(...LoggerQueue);
                        FinalLogsQueue = object.saveTabs.logs;
                    }

                    // Store logs to local storage and then empty LoggerQueue.
                    browserAPI.storage.local.set(
                        {
                            saveTabs: {
                                logs: FinalLogsQueue,
                                updated_at: updated_at,
                            },
                        },
                        () => {
                            LoggerQueue = [];
                        }
                    );
                }, 1000);
            });
        }
    };

    /**
     * Store all logs from LoggerQueue to Local Storage.
     * @version    1.0.0
     * @param    {Object} metaData	Meta data of groups with list of respective tabs to be grouped. 
     */
    const moveTabsToGroups = (metaData) => {
        metaData.forEach((group) => {
            // Create new Group with tabs listed. 
            browserAPI.tabs.group({
                tabIds: group.tabs
            })
                .then((delta) => {
                    browserAPI.tabGroups
                        .update(delta, {
                            title: group.title,
                            collapsed: true,
                        })
                        .then(
                            logErrorOrSuccess.bind(null, `newGroupCreated`),
                            logErrorOrSuccess.bind(null, `error`)
                        );
                }, logErrorOrSuccess.bind(null, `error`));
        });

        // To store all logs in local storage.
        insertNewLogs();
    };

    if (browserDetected == 1 || fileContent.groups === undefined) {
        // 1. If FireFox.
        // 2. If no grouped tabs are present.

        // To store all logs in local storage.
        insertNewLogs();
    } else {
        // Meta Data of newly created tabs to be grouped.
        const groupMetaData = new Map();

        // To check if all promised are fulfilled.
        Promise.allSettled(groupedTabsPromiseArray).then((results) => {
            results.forEach((result) => {
                // Get URL
                const url = result.value.url || result.value.pendingUrl;

                // URL to be grouped in.
                const groupsRelatedToURL = groupTabsQueue.get(url);

                // Group Id
                const groupIdForTab = groupsRelatedToURL.keys().next().value;

                const groupIdCount = groupsRelatedToURL.get(groupIdForTab);

                if (groupIdCount == 1) {
                    ((groupsRelatedToURL.size == 1) ?
                        groupTabsQueue.delete(url) :
                        groupsRelatedToURL.delete(groupIdForTab));
                } else {
                    groupsRelatedToURL.set(groupIdForTab, groupIdCount - 1);
                    groupTabsQueue.set(url, groupsRelatedToURL);
                }

                const metaData = {
                    title: fileContent.groups[groupIdForTab].title,
                };

                if (!groupMetaData.has(groupIdForTab)) {
                    metaData[`tabs`] = [result.value.id];
                } else {
                    metaData[`tabs`] = groupMetaData.get(groupIdForTab).tabs;
                    metaData.tabs.push(result.value.id);
                }

                // Set meta data for respective Group.
                groupMetaData.set(groupIdForTab, metaData);

                // Log sucessful creation of tab.
                logErrorOrSuccess(`newTabCreated`, result.value);

                // If all promises are fulfilled then group tabs.
                if (groupTabsQueue.size == 0) {
                    moveTabsToGroups(groupMetaData);
                }
            });
        }, logErrorOrSuccess.bind(null, `error`));
    }
};

/**
 * Interpret message received.
 * @version    1.0.0
 * @param    {Object} message		Message Object containing request and data.
 * @param    {Object} sendResponse	Function to respond recevier with parameters as Message Object.
 */
const interpretRequest = (message, sender, sendResponse) => {
    // Check if requesting for import tabs functionality
    if (message.type === `imported_file_content`) {
        LoggerQueue = [];
        saveTabsSettingsObject = message.saveTabsSettings;
        importTabs(message.data);
        sendResponse(`Request Submitted Successfully!`);
    }
};

// Sync updated local storage changes
browserAPI.storage.onChanged.addListener((changes, area) => {
    if (area === `local` && changes.saveTabsSettings !== undefined) {
        browserAPI.storage.local.get(`saveTabsSettings`, (object) => {
            saveTabsSettingsObject = object.saveTabsSettings;
        });
    }
});

// Listener to listen message received from saveTabs.js
browserAPI.runtime.onMessage.addListener(interpretRequest);

if (browserDetected == 1)
    try {
        // To toggle sidebar of Firefox browser 
        browserAPI.browserAction.onClicked.addListener(() => {
            browserAPI.sidebarAction.toggle();
        });
    } catch (error) {
        console.log(error);
    }
