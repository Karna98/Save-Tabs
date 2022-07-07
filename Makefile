# Files that will be Generated:
# 1. manifest.json (manifest-firefox.json / manifest-chrome.json)
# 2. saveTab.html
# 3. saveTab.css
# 4. saveTab.js
# 5. background.js
# 6. icons/

SRCDIR:=extension/
FDIR:=firefox/
CDIR:=chrome/
COMMONFILES:=saveTab.html saveTab.css saveTab.js background.js
ICONS:=${SRCDIR}/icons/

.PHONY: all firefox chrome clean

# Generate both firefox and chrome files.
all: clean firefox chrome

# Creates firefox folder and copy all required files and folders to it.
firefox:
	-mkdir firefox
	cp -v $(addprefix ${SRCDIR},${COMMONFILES}) ${FDIR}
	cp -v -R ${ICONS} ${FDIR}
	cp -v extension/manifest-firefox.json ${FDIR}/manifest.json

# Creates chrome folder and copy all required files and folders to it.
chrome:
	-mkdir chrome
	cp -v $(addprefix ${SRCDIR},${COMMONFILES}) ${CDIR}
	cp -v -R ${ICONS} ${FDIR}
	cp -v extension/manifest-chrome.json ${CDIR}/manifest.json



clean:
	-rm -v -r ${FDIR} ${CDIR}
