/**
 * @file Background Script for toggling Side Panel (Firefox).
 * @author Vedant Wakalkar <vedantwakalkar@gmail.com>
 */

try {
	browser.browserAction.onClicked.addListener(() => {
		browser.sidebarAction.toggle();
	});	
} catch (error) {
	console.log(error);
}
