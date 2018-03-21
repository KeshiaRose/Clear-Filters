let dashboard, dataSource, pset, dsnames, dslist, pdatatype;

$(document).ready(function() {
    tableau.extensions.initializeDialogAsync().then(function(openPayload) {
        console.log(tableau.extensions.settings.getAll());
        dashboard = tableau.extensions.dashboardContent.dashboard;
        document.getElementById('nodefaults').innerHTML = openPayload;
        load();
    });
});

// Sets up correct options when config loads
function load() {
    if (tableau.extensions.settings.get('showClear') == 'true') {
        document.getElementById('clearcheck').checked = true;
    }
    if (tableau.extensions.settings.get('showReset') == 'true') {
        document.getElementById('resetcheck').checked = true;
        document.getElementById('setdefaults').className = 'btn btn-warning';
        if (tableau.extensions.settings.get('defaults_set') == 'true') {
            document.getElementById('setdefaults').className = 'btn btn-secondary';
            document.getElementById('setdefaults').innerHTML = 'Update default filters';
        }
    }
}

// Toggles showing the clear filters button
function toggleClear() {
    if (document.getElementById('clearcheck').checked == true) {
        tableau.extensions.settings.set('showClear', 'true');
    } else {
        tableau.extensions.settings.set('showClear', 'false');
    }
}

// Toggles showing the reset filters button
function toggleReset() {
    if (document.getElementById('resetcheck').checked == true) {
        tableau.extensions.settings.set('showReset', 'true');
        document.getElementById('setdefaults').className = 'btn btn-warning';
        // setDefaults();
    } else {
        tableau.extensions.settings.set('showReset', 'false');
        document.getElementById('setdefaults').className = 'btn btn-light';
    }
}

// Sets the default filters for all worksheets
function setDefaults() {
    let filterFetchPromises = [];
    let dashboardfilters = [];
    let defaults = [];
    dashboard.worksheets.forEach(function(worksheet) {
        filterFetchPromises.push(worksheet.getFiltersAsync());
    });
    Promise.all(filterFetchPromises).then(function(fetchResults) {
        fetchResults.forEach(function(filtersForWorksheet) {
            filtersForWorksheet.forEach(function(filter) {
                dashboardfilters.push(filter);
            });
        });
        console.log(dashboardfilters);
        for (f of dashboardfilters) {

            let updateType = 'replace';
            let values = [];
            let min, max, nulls;
            if (f['filterType'] == 'categorical') {
                for (v of f['appliedValues']) {
                    values.push(v['value'])
                }
            }
            if (f['filterType'] == 'range') {
                min = f['minValue']['value'];
                max = f['maxValue']['value'];
                if (!min && !max) {
                    continue;
                }
                if (f['includeNullValues']) {
                    nulls = 'all-values';
                } else {
                    nulls = 'non-null-values';
                }
            }
            if (values.length == 0) {
                updateType = 'all';
            }
            defaults.push({
                worksheetName: f['worksheetName'],
                filterType: f['filterType'],
                fieldName: f['fieldName'],
                isExcludeMode: f['isExcludeMode'],
                appliedValues: values,
                min: min,
                max: max,
                updateType: updateType,
                nulls: nulls
            });
        }
        tableau.extensions.settings.set('defaults_set', 'true');
        tableau.extensions.settings.set('defaults', JSON.stringify(defaults));
        document.getElementById('setdefaults').className = 'btn btn-secondary';
        document.getElementById('setdefaults').innerHTML = 'Update default filters';
        document.getElementById('nodefaults').innerHTML = '';
        $("#setd").fadeIn();
        setTimeout(function() {
            $("#setd").fadeOut();
        }, 1000);
        console.log('Defaults set.')
        console.log(defaults)
    });
}

// Closes config window
function submit() {
    tableau.extensions.settings.set('configured', 'true');
    tableau.extensions.settings.saveAsync().then(result => {
        tableau.extensions.ui.closeDialog('Settings saved.');
    });
}