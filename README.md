# Clear Filters extension

This extensions enables you to add a "clear all filters" button and/or a "reset all fitlers" button directly into your Tableau dashboard. Great for embedded dashboards that do not have the toolbar showing or for a more intuitive interface

# Installing the Extension

### Download and install Tableau Desktop (with the Extensions API)

Download and install the Extensions API version of Tableau Desktop from the [Tableau Extensions API Developer Preview](https://prerelease.tableau.com) site. Under **Resources**, click **Extensions API Software Downloads**. 

Current version: 18.0227.0818

### Download and install the Clear Filter manifest file

Download the Clear Filter [manifest file](https://keshiarose.github.io/Clear-Filters/ClearFilters.trex) and save it wherever you want.

# Using the Extension
1.	Drag in a new Extension object to your dashboard
2.	Find the manifest (.trex) file you downloaded above
3.  Choose if you want to show a "clear all filters" button and/or a "reset all fitlers" button
4.  If you show the "reset all filters" button, make sure to set the default filter settings by clicking "Set current filters as default"
5.  Hit save to save settings

To change the default settings at any time you can open the context menu for the extension and click "Congifure". Pressing the button "Update default filters" again will set the default filters to whatever is currently set.
