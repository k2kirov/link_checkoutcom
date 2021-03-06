"use strict"

/* API Includes */
var Transaction = require('dw/system/Transaction');
var OrderMgr = require('dw/order/OrderMgr');

/** Utility **/
var ckoHelper = require('~/cartridge/scripts/helpers/ckoHelper');

/*
* Utility functions for my cartridge integration.
*/
var cardHelper = {
    /*
     * Handle full charge Request to CKO API
     */
    handleCardRequest: function (cardData, args) {
        // Load the card and order information
        var order = OrderMgr.getOrder(args.OrderNo);
        
        // Create billing address object
        var gatewayRequest = this.getCardRequest(cardData, args);
        
        // Pre authorize the card
        if (this.preAuthorizeCard(gatewayRequest)) {
            // Perform the request to the payment gateway
            var gatewayResponse = ckoHelper.gatewayClientRequest(
                "cko.card.charge." + ckoHelper.getValue('ckoMode') + ".service",
                gatewayRequest
            );
        
            // Logging
            ckoHelper.doLog('response', gatewayResponse);

            // If the charge is valid, process the response
            if (gatewayResponse) {                
                // Handle the response
                if (this.handleFullChargeResponse(gatewayResponse)) {
                    return gatewayResponse;
                }

                return false;
            } else {
                // Fail the order
                Transaction.wrap(function () {
                    OrderMgr.failOrder(order);
                });

                return false;
            }
        }
            
        return false;
    },
    
    /*
     * Handle full charge Response from CKO API
     */
    handleFullChargeResponse: function (gatewayResponse) {
        // Clean the session
        session.privacy.redirectUrl = null;
        
        // Logging
        ckoHelper.doLog('response', gatewayResponse);
        
        // Update customer data
        ckoHelper.updateCustomerData(gatewayResponse);
        
        // Get the gateway links
        var gatewayLinks = gatewayResponse._links;
        
        // Add 3DS redirect URL to session if exists
        if (gatewayLinks.hasOwnProperty('redirect')) {
            session.privacy.redirectUrl = gatewayLinks.redirect.href;
            return true;
        } else {
            return ckoHelper.paymentSuccess(gatewayResponse);
        }

        return false;
    },
    
    /*
     * Pre_Authorize card with zero value
     */
    preAuthorizeCard: function (requestData) {
        // Clone the request data
        var authData = JSON.parse(JSON.stringify(requestData));

        // Prepare the pre authorization charge
        authData['3ds'].enabled = false;
        authData.amount = 0;
        authData.currency = 'USD';
        authData.capture = false;
        delete authData['capture_on'];
        
        // Send the request
        var authResponse = ckoHelper.gatewayClientRequest(
            'cko.card.charge.' + ckoHelper.getValue('ckoMode') + '.service',
            authData
        );
        
        // Return the response
        return ckoHelper.paymentSuccess(authResponse);
    },
    
    /*
     * Build the gateway request
     */
    getCardRequest: function (cardData, args) {
        // Load the card and order information
        var order = OrderMgr.getOrder(args.OrderNo);
    
        // Prepare the charge data
        var chargeData = {
            'source'                : this.getSourceObject(cardData, args),
            'amount'                : ckoHelper.getFormattedPrice(order.totalGrossPrice.value.toFixed(2), ckoHelper.getCurrency()),
            'currency'              : ckoHelper.getCurrency(),
            'reference'             : args.OrderNo,
            'capture'               : ckoHelper.getValue('ckoAutoCapture'),
            'capture_on'            : ckoHelper.getCaptureTime(),
            'customer'              : ckoHelper.getCustomer(args),
            'billing_descriptor'    : ckoHelper.getBillingDescriptorObject(),
            'shipping'              : this.getShippingObject(args),
            '3ds'                   : this.get3Ds(),
            'risk'                  : {enabled: true},
            'payment_ip'            : ckoHelper.getHost(args),
            'metadata'              : ckoHelper.getMetadataObject(cardData, args),
            'udf5'					: ckoHelper.getMetadataString(cardData, args)
        };
        
        return chargeData;
    },
    
    /*
     * Build Gateway Source Object
     */
    getSourceObject: function (cardData, args) {
        // Source object
        var source = {
            type                : 'card',
            number              : cardData.number,
            expiry_month        : cardData.expiryMonth,
            expiry_year         : cardData.expiryYear,
            name                : cardData.name,
            cvv                 : cardData.cvv,
            billing_address     : this.getBillingObject(args),
            phone               : ckoHelper.getPhoneObject(args)
        }
        
        return source;
    },
    
    /*
     * Build 3ds object
     */
    get3Ds: function () {
        return {
            'enabled' : ckoHelper.getValue('cko3ds'),
            'attempt_n3d' : ckoHelper.getValue('ckoN3ds')
        }
    },
    
    /*
     * Build the Billing object
     */
    getBillingObject: function (args) {
        // Load the card and order information
        var order = OrderMgr.getOrder(args.OrderNo);

        // Get billing address information
        var billingAddress = order.getBillingAddress();

        // Creating billing address object
        var billingDetails = {
            address_line1       : billingAddress.getAddress1(),
            address_line2       : billingAddress.getAddress2(),
            city                : billingAddress.getCity(),
            state               : billingAddress.getStateCode(),
            zip                 : billingAddress.getPostalCode(),
            country             : billingAddress.getCountryCode().value
        };
        
        return billingDetails;
    },
    
    /*
     * Build the Shipping object
     */
    getShippingObject: function (args) {
        // Load the card and order information
        var order = OrderMgr.getOrder(args.OrderNo);

        // Get shipping address object
        var shippingAddress = order.getDefaultShipment().getShippingAddress();
        
        // Creating address object
        var shippingDetails = {
            address_line1       : shippingAddress.getAddress1(),
            address_line2       : shippingAddress.getAddress2(),
            city                : shippingAddress.getCity(),
            state               : shippingAddress.getStateCode(),
            zip                 : shippingAddress.getPostalCode(),
            country             : shippingAddress.getCountryCode().value
        };
        
        // Build the shipping object
        var shipping = {
            address             : shippingDetails,
            phone               : ckoHelper.getPhoneObject(args)
        };
        
        return shipping;
    }
}

/*
* Module exports
*/

module.exports = cardHelper;