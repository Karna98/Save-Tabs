# Creates chrome folder and copy all required files and folders to it.
# 1. manifest.json (manifest-chrome.json)
# 2. saveTab.html
# 3. saveTab.css
# 4. saveTab.js
# 5. background.js
# 6. icons/
# 7. saveTab-chrome.css
mkdir chrome
cp background.js saveTab.css saveTab-chrome.css saveTab.js saveTab.html chrome/
cp -R icons chrome
cp manifest-chrome.json chrome/manifest.json
# Creates firefox folder and copy all required files and folders to it.
# 1. manifest.json (manifest-firefox.json)
# 2. saveTab.html
# 3. saveTab.css
# 4. saveTab.js
# 5. background.js
# 6. icons/
mkdir firefox
cp background.js saveTab.css saveTab.js saveTab.html firefox/
cp -R icons firefox
cp manifest-firefox.json firefox/manifest.json