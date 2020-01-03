'use strict';

/* API Includes */
var siteControllerName = dw.system.Site.getCurrent().getCustomPreferenceValue('ckoStorefrontController');
var guard = require(siteControllerName + '/cartridge/scripts/guard');
var ISML = require('dw/template/ISML');

/* Checkout.com Helper functions */
var CKOHelper = require('~/cartridge/scripts/helpers/CKOHelper');

/**
 * Get the transactions list
 */
function listTransactions() {	
    // Render the template
    ISML.renderTemplate('transactions/list');
}

/**
 * Get the transactions table data
 */
function getTransactionsData() {	
	// Prepare the output array
    var data = CKOHelper.getCkoTransactions();
    
    // Send the AJAX response
    ISML.renderTemplate('transactions/ajax', {data: JSON.stringify(data) });
}

/*
* Web exposed methods
*/
exports.ListTransactions = guard.ensure(['https'], listTransactions);
exports.GetTransactionsData = guard.ensure(['https'], getTransactionsData);