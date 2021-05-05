<div align="center">
    <a name="logo" href="https://github.com/Karna98/Save-Tabs">
        <img src="icons/Save_Tabs_128.png" alt="Save Tabs">
    </a>
    <h1>Save Tabs</h1>
</div>

## About

Save Tab is a browser extension that helps to exports and imports tabs currently opened in the browser window.

## Browsers Supported
Save Tab currently supports Chrome, Firefox.

![Firefox](assets/firefox.png "Firefox")
![Chrome](assets/chrome.png "Chrome")

## For whom?

* One who open lots and lots of tabs in a single browser and want to revisit the same sets of tabs after a while.

## Features

1. **Cross Browser Support**
2. **Easy Export and Import of Tabs**
3. **Export tabs with custom name**
4. **Logs Section**

## How to set up this extension?

### From Repository

1. Clone this repository by executing `git clone https://github.com/Karna98/Save-Tabs.git` in cmd/terminal OR download zip from [here](https://github.com/Karna98/Save-Tabs/archive/refs/heads/main.zip).

2. Once succesfully cloned or extracted, open **Save Tabs** folder and based on browser follow : 

    - Firefox
        1. Create folder named `firefox` in **Save Tabs**.
        2. Copy following folder and files to newly created folder
            - *icons* (folder)
            - *manifest-firefox.json*
            - *saveTab.html*
            - *saveTab.css*
            - *saveTab.js*
            - *background.js*
        3. In **firefox**, rename `manifest-firefox.json` to `manifest.json`.
        2. Open Firefox browser and visit <a href="about:debugging#/runtime/this-firefox">`about:debugging#/runtime/this-firefox`</a>.
        3. Under **Temporary Extensions**, click on **Load Temporary Add-on..**. File explorer opens, navigate to *`Save-Tabs/firefox`* folder and select `manifest.json`.
        4. On successfully loading, **Save Tabs** extension will be listed under **Temporary Extensions**.
        5. Also, user can use extension by clicking on 'Save Tabs' extension icon listed on Browser ToolBar.

    - Chrome
        1. Create folder named `chrome` in **Save Tabs**.
        2. Copy following folder and files to newly created folder
            - *icons* (folder)
            - *manifest-chrome.json*
            - *saveTab.html*
            - *saveTab.css*
            - *saveTab-chrome.css*
            - *saveTab.js*
            - *background.js*
        3. In **chrome**, rename `manifest-chrome.json` to `manifest.json`.
        4. In ***saveTab.html***, update `<link rel="stylesheet" type="text/css" href="saveTab.css" />` to `<link rel="stylesheet" type="text/css" href="saveTab-chrome.css" />` and save updated file.
        5. Open Chrome browser and visit <a href="chrome://extensions/">`chrome://extensions`/</a>.
        6. Click on **Load Unpacked**. File explorer opens, navigate to *`Save-Tabs/chrome`* folder and select `manifest.json`.
        7. On successfully loading, **Save Tabs** extension will be listed.
        8. User can use extension by clicking on 'Save Tabs' extension icon listed on Browser ToolBar.

        Refer [*Manage your Extension*](https://support.google.com/chrome_webstore/answer/2664769?hl=en) to pin extension on the browser toolbar.

## Issues and Suggestions

Please create new [Issue](https://github.com/Karna98/Save-Tabs/issues/new) for :
* To report an issue.
* Proposing new features
* Discussion related to this project.

## Contributing

Contributions are always WELCOME! 

Before sending a Pull Request, please make sure that you're assigned the task on a GitHub issue.

- If a relevant issue already exists, discuss the issue and get it assigned to yourself on GitHub.
- If no relevant issue exists, open a new issue and get it assigned to yourself on GitHub.
- Please proceed with a Pull Request only after you're assigned.

## License
[MIT License](LICENSE)