let dashboard, parameter, dataSource;

$(document).ready(function() {
    tableau.extensions.initializeAsync({ 'configure': configure }).then(() => {
        console.log(tableau.extensions.settings.getAll());
        dashboard = tableau.extensions.dashboardContent.dashboard;
        let configured = tableau.extensions.settings.get('configured');
        if (configured != 'true') {
            configure();
        } else {
            show();
        }
    });
});

// Pops open the configure page
function configure(payload) {
    const popupUrl = `${window.location.origin}/Clear-Filters/config.html`
    tableau.extensions.ui.displayDialogAsync(popupUrl, payload, { height: 400, width: 500 }).then((closePayload) => {
        console.log("Dialog was closed.");
        console.log(closePayload);
        show();
    }).catch((error) => {
        switch (error.errorCode) {
            case tableau.ErrorCodes.DialogClosedByUser:
                console.log("Dialog was closed by user.");
                break;
            default:
                console.error(error.message);
        }
    });
}

// Shows or hides buttons based on settings
function show() {
    if (tableau.extensions.settings.get('showClear') == 'true') {
        document.getElementById('clearbutton').style.display = 'inline';
    } else {
        document.getElementById('clearbutton').style.display = 'none';
    }
    if (tableau.extensions.settings.get('showReset') == 'true') {
        document.getElementById('resetbutton').style.display = 'inline';
    } else {
        document.getElementById('resetbutton').style.display = 'none';
    }
}

// Clears all filters on a dashboard
function clearFilters() {
    dashboard.worksheets.forEach(function(worksheet) {
        worksheet.getFiltersAsync().then(function(filtersForWorksheet) {
            let filterClearPromises = [];
            filtersForWorksheet.forEach(function(filter) {
                filterClearPromises.push(worksheet.clearFilterAsync(filter.fieldName));
            });
        });
    });
}

// Resets al filters on dashboard to defaults
function resetFilters() {
    if (tableau.extensions.settings.get('defaults_set') == 'true') {
        defaults = JSON.parse(tableau.extensions.settings.get('defaults'));
        console.log(defaults);
        dashboard.worksheets.forEach(function(worksheet) {
            for (d of defaults) {
                if (worksheet.name == d['worksheetName']) {
                    // Categorical filters
                    if (d['filterType'] == 'categorical') {
                        worksheet.applyFilterAsync(d['fieldName'], d['appliedValues'], d['updateType'], { isExcludeMode: d['isExcludeMode'] });
                    }
                    if (d['filterType'] == 'range') {
                        worksheet.applyRangeFilterAsync(d['fieldName'], { min: d['min'], max: d['max'] });
                    }
                }
            }
        });
    } else {
        configure('No default filters set');
    }
}