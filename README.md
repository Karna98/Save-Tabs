<div align="center">
    <a name="logo" href="https://github.com/Karna98/Save-Tabs">
        <img src="extension/icons/Save_Tabs_128.png" alt="Save Tabs">
    </a>
    <h1>Save Tabs</h1>
</div>

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ljokfgphjbhjheflldgfmjligcmcmhmn.svg?style=plastic)](https://chrome.google.com/webstore/detail/detail/save-tabs/ljokfgphjbhjheflldgfmjligcmcmhmn) [![Firefox Add-ons](https://img.shields.io/amo/v/save-tabs.svg?style=plastic)](https://addons.mozilla.org/firefox/addon/save-tabs/)


## 💡 About

Save Tab is a browser extension that helps to exports and imports tabs currently opened in the browser window.

### For whom?
One who open lots and lots of tabs in a single browser and want to revisit the same sets of tabs after a while.


## 🎯 Features

◻️ **Easy Export and Import of Tabs**

◻️ **Export tabs with Custom Name**

◻️ **Cross Browser Support** _(as of now Chrome and Firefox)_

◻️ **Logs Section**

◻️ **Export and Import of Grouped Tabs** _(Chrome only)_


## 🌐 Browsers Supported

<img alt="Chrome" title="Chrome" src="assets/chrome.png">  <img alt="Firefox" title="Firefox" src="assets/firefox.png"> 


## ⚙️ Install

### From Web Store
<a title="Add from Chrome Web Store" href="https://chrome.google.com/webstore/detail/save-tabs/ljokfgphjbhjheflldgfmjligcmcmhmn" target="_blank" rel="noopener noreferrer" style="text-decoration: none"> <img src="assets/chrome_webstore.png" alt="Get it on Chrome Webstore" width="300px" height="85px"> </a>

<a title="Add from Firefox Add-Ons" href="https://addons.mozilla.org/en-US/firefox/addon/save-tabs/"
   target="_blank" rel="noopener noreferrer" style="text-decoration: none"> <img src="assets/firefox_addon.png" alt="Get it on Chrome Webstore" width="300px" height="85px"> </a>

### From Repository

1. Clone this repository by executing following command in cmd/terminal

    ```
    git clone https://github.com/Karna98/Save-Tabs.git
    ```

    OR  
    Download zip from [here](https://github.com/Karna98/Save-Tabs/archive/refs/heads/main.zip).

2. Once successfully cloned or extracted, open **Save-Tabs** folder.

    - **Using `setup.sh`**.

        1. Open a terminal in Ubuntu or Git Bash within Sa and execute
            ```
            ./setup.sh
            ```

        2. On successful execution, new folder 'firefox' and 'chrome' with the following structure will be created
            ```
            - Save-Tabs
                - ...
                - firefox
                    - manifest.json (original 'manifest-firefox.json')
                    - saveTab.html
                    - saveTab.css
                    - saveTab.js
                    - background.js
                    - icons
                - chrome
                    - manifest.json (original 'manifest-chrome.json')
                    - saveTab.html
                    - saveTab.css
                    - saveTab.js
                    - background.js
                    - icons
                    - saveTab-chrome.css
            ```

            **Note** (For Chrome only):  
            * Open **_chrome/saveTab.html_**, update  
                
                ```
                <link rel="stylesheet" type="text/css" href="saveTab.css" />
                ```
                to
                ```
                <link rel="stylesheet" type="text/css" href="saveTab-chrome.css" />
                ```
                Save the updated file.

        3. Then proceed with **Run Extension** (below) based on the browser.

    * **Run Extension**

        - _Firefox_

            1. Open _Firefox_ browser and visit <a href="about:debugging#/runtime/this-firefox">**_about:debugging#/runtime/this-firefox_**</a>.

            2. Under **Temporary Extensions**, click on **Load Temporary Add-on..**.  
               File Explorer opens, navigate to **_Save-Tabs/firefox_** folder and select **_manifest.json_**.

            3. On successfully loading, **Save Tabs** extension will be listed under **Temporary Extensions**.
            4. Also, the user can use the extension by clicking on the **Save Tabs** extension icon listed on browser toolbar.

        - _Chrome_

            1. Open _Chrome_ browser and visit <a href="chrome://extensions/">**_chrome://extensions/_**</a>.

            2. Click on **Load Unpacked**.  
               File Explorer opens, navigate to **_Save-Tabs/chrome_** folder and select **_manifest.json_**.

            3. On successfully loading, **Save Tabs** extension will be listed.

            4. User can use the extension by clicking on the **Save Tabs** extension icon listed on browser toolbar.

                Refer [_Manage your Extension_](https://support.google.com/chrome_webstore/answer/2664769?hl=en) to pin extension on the browser toolbar.


## 📝 Issues and Suggestions

Please create new [Issue](https://github.com/Karna98/Save-Tabs/issues/new) for :

-   To report an issue.
-   Proposing new features
-   Discussion related to this project.


## 💻 Contributing

Contributions are always WELCOME!

Before sending a Pull Request, please make sure that you're assigned the task on a GitHub issue.

-   If a relevant issue already exists, discuss the issue and get it assigned to yourself on GitHub.
-   If no relevant issue exists, open a new issue and get it assigned to yourself on GitHub.
-   Please proceed with a Pull Request only after you're assigned.


## ⚠️ License

[MIT License](LICENSE)
