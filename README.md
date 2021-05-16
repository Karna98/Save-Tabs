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

5. **Export and Import of Grouped Tabs** *(Chrome only)* 

## How to set up this extension?

### From Repository

1. Clone this repository by executing following command in cmd/terminal
    ```
    git clone https://github.com/Karna98/Save-Tabs.git
    ```
    OR  
    Download zip from [here](https://github.com/Karna98/Save-Tabs/archive/refs/heads/main.zip).

2. Once successfully cloned or extracted, open **Save-Tabs** folder.
    * **Using `setup.sh`**.
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
        3. Then proceed with **Run Extension** (below) based on the browser.

    * **Manual setup**
        - *Firefox*
            1. Create new folder named **firefox** in **Save-Tabs**.
            
            2. Copy following folder and files to newly created folder
                - *manifest-firefox.json*
                - *saveTab.html*
                - *saveTab.css*
                - *saveTab.js*
                - *background.js*
                - *icons* (folder)
            
            3. Rename ***firefox/manifest-firefox.json*** to ***firefox/manifest.json***.

            4. Then proceed with **Run Extension** (below) for Firefox.

        - *Chrome*
            1. Create new folder named **chrome** in **Save-Tabs**.

            2. Copy following folder and files to newly created folder
                - *manifest-chrome.json*
                - *saveTab.html*
                - *saveTab.css*
                - *saveTab.js*
                - *background.js*
                - *icons* (folder)
                - *saveTab-chrome.css*

            3. Rename ***chrome/manifest-chrome.json*** to ***chrome/manifest.json***.
            
            4. Open ***saveTab.html***, update 
                ```
                <link rel="stylesheet" type="text/css" href="saveTab.css" />
                ```
                to 
                ```
                <link rel="stylesheet" type="text/css" href="saveTab-chrome.css" />
                ```
                Save the updated file.
            
            5. Then proceed with **Run Extension** (below) for Chrome.

    - **Run Extension**
        - *Firefox*
            1. Open *Firefox* browser and visit <a href="about:debugging#/runtime/this-firefox">***about:debugging#/runtime/this-firefox***</a>.
            
            2. Under **Temporary Extensions**, click on **Load Temporary Add-on..**.  
            File Explorer opens, navigate to ***Save-Tabs/firefox*** folder and select ***manifest.json***.
            
            3. On successfully loading, **Save Tabs** extension will be listed under **Temporary Extensions**.
            4. Also, the user can use the extension by clicking on the **Save Tabs** extension icon listed on browser toolbar.
        
        - *Chrome*
            1. Open *Chrome* browser and visit <a href="chrome://extensions/">***chrome://extensions/***</a>.
            
            2. Click on **Load Unpacked**.  
            File Explorer opens, navigate to ***Save-Tabs/chrome*** folder and select ***manifest.json***.
            
            3. On successfully loading, **Save Tabs** extension will be listed.
            
            4. User can use the extension by clicking on the **Save Tabs** extension icon listed on browser toolbar.

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