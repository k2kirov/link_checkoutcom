'use strict';

/* API Includes */
var SystemObjectMgr = require('dw/object/SystemObjectMgr');
var OrderMgr = require('dw/order/OrderMgr');
var PaymentMgr = require('dw/order/PaymentMgr');
var ServiceRegistry = require('dw/svc/ServiceRegistry');
var Util = require('dw/util');
var URLUtils = require('dw/web/URLUtils');

/**
 * Helper functions for the Checkout.com cartridge integration.
 */
var CKOHelper = {
    /**
     * Handles string translation with language resource files.
     */
    _: function (strValue, strFile) {
        return Resource.msg(strValue, strFile, null);
    },

    /**
     * Get the Checkout.com orders.
     */
    getCkoOrders: function () {
        // Prepare the output array
        var data = [];
    
        // Query the orders
        var result  = SystemObjectMgr.querySystemObjects('Order', '', 'creationDate desc');
        
        // Loop through the results
        for each (var item in result) {
            // Get the payment instruments
            var paymentInstruments = item.getPaymentInstruments();
            
            // Loop through the payment instruments
            for each (var instrument in paymentInstruments) {
                if (this.isCKo(instrument) && !this.containsObject(item, data)) {
                    data.push(item);	
                }
            }
        }

        return data;
    },

    /**
     * Get the Checkout.com transactions.
     */
    getCkoTransactions: function () {
        // Prepare the output array
        var data = [];

        // Query the orders
        var result  = this.getCkoOrders();

        // Loop through the results
        for each (var item in result) {
            // Get the payment instruments
            var paymentInstruments = item.getPaymentInstruments();
            
            // Loop through the payment instruments
            for each (var instrument in paymentInstruments) {
                if (this.isCKo(instrument)) {
                    // Get the payment transaction
                    var paymentTransaction = instrument.getPaymentTransaction();

                    // Add the payment transaction to the output
                    if (!this.containsObject(paymentTransaction, data) && this.isTransactionNeeded(paymentTransaction.transactionID)) {                    	
                    	// Build the row data
                    	var row = {
                	        order_no: '<a href="' + URLUtils.url('ViewOrder-FindByNumber', 'OrderID', item.orderNo) + '" target="_blank">' + item.orderNo + "</a>",
                	        transaction_id: paymentTransaction.transactionID,
                	        amount: paymentTransaction.amount.decimalValue + ' ' + paymentTransaction.amount.currencyCode,
                	        creation_date: paymentTransaction.getCreationDate().toDateString(),
                	        type: paymentTransaction.type.displayValue,
                	        processor: this.getProcessorId(instrument)
                    	};
                    	
                        // Add the transaction
                        data.push(row);
                    }
                }
            }
        } 
        
        return data;
    },

    /**
     * Checks if a transaction should be returned in the reaults.
     */
    isTransactionNeeded: function (transactionId) {
        // Get an optional transaction id
        var tid = request.httpParameterMap.get('tid').stringValue;

        if (tid && (transactionId == tid)) {
            return true;
        }
        else if (!tid) {
            return true;
        }

        return false;
    },

    /**
     * Checks if a payment instrument is Checkout.com.
     */
    isCKo: function (instrument) {
        return instrument.paymentMethod.indexOf('CHECKOUTCOM_') >= 0;
    },

    /**
     * Get the processor ID for a payment instrument.
     */
    getProcessorId: function (instrument) {
    	var paymentMethod = PaymentMgr.getPaymentMethod(instrument.getPaymentMethod());
    	if (paymentMethod) {
    		return paymentMethod.getPaymentProcessor().getID();
    	}
    	else {
    		return '';
    	}
    },
    
    /**
     * Checks if an object already exists in an array.
     */
    containsObject: function (obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    },

    /**
     * Loads an order by track id.
     */
    loadOrderFromRequest: function () {
        // Get the order from the request
        var trackId = request.httpParameterMap.get('trackId').stringValue;

        return OrderMgr.getOrder(trackId);
    },

    /**
     * Writes gateway information to the website's custom log files.
     */
    logThis: function (dataType, gatewayData) {
        if (this.getValue('ckoDebugEnabled') == 'true' && (gatewayData)) {
            var logger = Logger.getLogger('ckodebug');
            if (logger) {
                logger.debug(this._('cko.gateway.name', 'cko') + ' ' + dataType + ' : {0}', gatewayData);
            }
        }
    },

    /**
     * Creates an HTTP Client to handle gateway queries.
     */
    getGatewayClient: function (serviceId, requestData, method) { 
        var method = method || 'POST';     
        var responseData = false;
        var serv = ServiceRegistry.get(serviceId);
        
        // Prepare the request URL and data
        if (requestData.hasOwnProperty('chargeId')) {
            var requestUrl = serv.getURL().replace('chargeId', requestData.chargeId);
            serv.setURL(requestUrl);
            delete requestData['chargeId'];
        } 

        // Set the request method
    	
        // Send the call
        var resp = serv.call(requestData);
        if (resp.status == 'OK') {
            responseData = resp.object
        }
        
        return responseData;
    },
    
    /**
     * Returns a price formatted for processing by the gateway.
     */
    getFormattedPrice: function (price) {
        var orderTotalFormatted = price * 100;
        return orderTotalFormatted.toFixed();
    },

    /**
     * The cartridge metadata.
     */
    getCartridgeMeta: function (price) {
        return this.getValue('ckoUserAgent') + ' ' + this.getValue('ckoVersion');
    },

    /**
     * Build HTTP service Headers.
     */
    buildHttpServiceHeaders: function (serviceInstance, method, url) {
        // Set the method
        method = method || 'POST';

        // Set the URL
        url = url || null;
        if (url) serviceInstance.setURL(url);

        // Set the default headers
        serviceInstance.setRequestMethod(method);
        serviceInstance.addHeader("Authorization", this.getAccountKeys().privateKey);
        serviceInstance.addHeader("User-Agent", this.getCartridgeMeta());
        serviceInstance.addHeader("Content-Type", 'application/json;charset=UTF-8');

        return serviceInstance;
    },

    /**
     * Retrieves a custom preference value from the configuration.
     */
    getValue: function (fieldName) {
        return dw.system.Site.getCurrent().getCustomPreferenceValue(fieldName);
    },

    /**
     * Get live or sandbox account keys.
     */
    getAccountKeys: function () {
        var keys = {};
        var str = this.getValue('ckoMode') == 'live' ? 'Live' : 'Sandbox';

        keys.privateKey = this.getValue('cko' + str + 'PrivateKey');
        keys.publicKey = this.getValue('cko' + str + 'PublicKey');
        keys.privateSharedKey = this.getValue('cko' + str + 'PrivateSharedKey');

        return keys;
    }
};

/*
 * Module exports
 */

module.exports = CKOHelper;