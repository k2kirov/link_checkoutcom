"use strict"

/* API Includes */
var PaymentMgr = require('dw/order/PaymentMgr');
var PaymentTransaction = require('dw/order/PaymentTransaction');
var Transaction = require('dw/system/Transaction');
var ISML = require('dw/template/ISML');
var OrderMgr = require('dw/order/OrderMgr');

/* Utility */
var ckoHelper = require('~/cartridge/scripts/helpers/ckoHelper');

/*
* Utility functions for my cartridge integration.
*/
var apmHelper = {
    /*
     * Creates Site Genesis Transaction Object
     * @return object
     */
    apmAuthorization: function (payObject, args) {        
        // Perform the charge
        var apmResponse = this.handleApmRequest(payObject, args);
        
        // Handle APM result
        if (apmResponse) {
            return apmResponse;
        } 
        
        return false;
    },
        
    /*
     * Handle APM charge Response from CKO API
     */
    handleApmChargeResponse: function (gatewayResponse) {
        // Clean the session
        session.privacy.redirectUrl = null;
        
        // Logging
        ckoHelper.doLog('response', gatewayResponse);
        
        // Update customer data
        ckoHelper.updateCustomerData(gatewayResponse);
        
        // Get the response links
        var gatewayLinks = gatewayResponse._links;

        // Get the response type
        var type = gatewayResponse.type;
        
        // Add redirect to sepa source reqeust
        if (type == 'Sepa') {
            session.privacy.redirectUrl = "${URLUtils.url('CKOSepa-Mandate')}";
            session.privacy.sepaResponseId = gatewayResponse.id;
        }
        
        // Add redirect URL to session if exists
        if (gatewayLinks.hasOwnProperty('redirect')) {
            session.privacy.redirectUrl = gatewayLinks.redirect.href
            return true;
        } else {
            ckoHelper.paymentSuccess(gatewayResponse);
        }  
    },
    
    /*
     * Apm Request
     */
    handleApmRequest: function (payObject, args) {
        // Gateway response
        var gatewayResponse = false;
        
        // Load the card and order information
        var order = OrderMgr.getOrder(args.OrderNo);
        
        // Creating billing address object
        var gatewayRequest = this.getApmRequest(payObject, args);
        
        // Test SEPA
        if (payObject.type == "sepa") {
            // Prepare the charge data
            var chargeData = {
                "customer"              : ckoHelper.getCustomer(args),
                "amount"                : ckoHelper.getFormattedPrice(order.totalGrossPrice.value.toFixed(2), payObject.currency),
                "type"                  : payObject.type,
                "currency"              : payObject.currency,
                "billing_address"       : ckoHelper.getBillingObject(args),
                "source_data"           : payObject.source_data,
                "reference"             : args.OrderNo,
                "payment_ip"            : ckoHelper.getHost(args),
                "metadata"              : ckoHelper.getMetadataObject(payObject, args),
                "billing_descriptor"    : ckoHelper.getBillingDescriptorObject()
            };
            
            // Perform the request to the payment gateway
            gatewayResponse = ckoHelper.gatewayClientRequest("cko.card.sources." + ckoHelper.getValue('ckoMode').value + ".service", chargeData);
        } else {
            // Perform the request to the payment gateway
            gatewayResponse = ckoHelper.gatewayClientRequest("cko.card.charge." + ckoHelper.getValue('ckoMode').value + ".service", gatewayRequest);
        }

        // Logging
        ckoHelper.doLog('response', gatewayResponse);
        
        // If the charge is valid, process the response
        if (gatewayResponse) {
            if (this.handleApmChargeResponse(gatewayResponse)) {
                return gatewayResponse;
            } else {
                return false;
            }
        } else {
            // Update the transaction
            Transaction.wrap(function () {
                OrderMgr.failOrder(order, true);
            });
        }
    },
    
    /*
     * Return the APM request data
     */
    getApmRequest: function (payObject, args) {
        // Charge data
        var chargeData = false;
        
        // Load the order information
        var order = OrderMgr.getOrder(args.OrderNo);
        
        // Load the currency and amount
        var currency = ckoHelper.getCurrency(payObject.currency);
        var amount = ckoHelper.getFormattedPrice(order.totalGrossPrice.value.toFixed(2), currency);
        
        // Object APM is SEPA
        if (payObject.type == 'klarna') {
            // Prepare chargeData object
            chargeData = {
                "customer"              : ckoHelper.getCustomer(args),
                "amount"                : amount,
                "currency"              : currency,
                "capture"               : false,
                "source"                : payObject.source,
                "reference"             : args.OrderNo,
                "payment_ip"            : ckoHelper.getHost(args),
                "metadata"              : ckoHelper.getMetadataObject(payObject, args),
                "billing_descriptor"    : ckoHelper.getBillingDescriptorObject()
            };
        } else {
            // Prepare chargeData object
            chargeData = {
                "customer"              : ckoHelper.getCustomer(args),
                "amount"                : amount,
                "currency"              : currency,
                "source"                : payObject.source,
                "reference"             : args.OrderNo,
                "payment_ip"            : ckoHelper.getHost(args),
                "metadata"              : ckoHelper.getMetadataObject(payObject, args),
                "billing_descriptor"    : ckoHelper.getBillingDescriptorObject()
            };
        }
        
        return chargeData;
    },
    
    /*
     * Sepa apm Request
     */
    handleSepaRequest: function (payObject, order) {
        // Gateway response
        var gatewayResponse = false;
        
        // Perform the request to the payment gateway
        gatewayResponse = ckoHelper.gatewayClientRequest("cko.card.charge." + ckoHelper.getValue('ckoMode').value + ".service", payObject);
        
        // If the charge is valid, process the response
        if (gatewayResponse) {
            this.handleApmChargeResponse(gatewayResponse, order);
        } else {
            // Update the transaction
            Transaction.wrap(function () {
                OrderMgr.failOrder(order);
            });
            
            // Restore the cart
            ckoHelper.checkAndRestoreBasket(order);
            
            return false;
        }

        return true;
    }
}

/*
* Module exports
*/

module.exports = apmHelper;