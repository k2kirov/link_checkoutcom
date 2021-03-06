/* API Includes */
var svc = require('dw/svc');

/* Utility */
var util = require('~/cartridge/scripts/helpers/ckoHelper');

/**
 * Initialize HTTP service for the Checkout.com sandbox charges verification.
 */
svc.ServiceRegistry.configure("cko.verify.charges.sandbox.service", {
    createRequest: function (svc, args) {
        var serviceUrl = svc.configuration.credential.URL + "/" + args.paymentToken;
            
        // Prepare the http service
        svc.setURL(serviceUrl);
        svc.setRequestMethod("GET");
        svc.addHeader("Authorization", util.getAccountKeys().secretKey);
        svc.addHeader("User-Agent", util.getCartridgeMeta());
        svc.addHeader("Content-Type", 'application/json;charset=UTF-8');
        
        return (args) ? JSON.stringify(args) : null;
    },

    parseResponse: function (svc, resp) {
        return JSON.parse(resp.text);
    }
});

/**
 * Initialize HTTP service for the Checkout.com sandbox charges verification.
 */
svc.ServiceRegistry.configure("cko.verify.charges.live.service", {
    createRequest: function (svc, args) {
        var serviceUrl = svc.configuration.credential.URL + "/" + args.paymentToken;
            
        // Prepare the http service
        svc.setURL(serviceUrl);
        svc.setRequestMethod("GET");
        svc.addHeader("Authorization", util.getAccountKeys().secretKey);
        svc.addHeader("User-Agent", util.getCartridgeMeta());
        svc.addHeader("Content-Type", 'application/json;charset=UTF-8');
        
        return (args) ? JSON.stringify(args) : null;
    },

    parseResponse: function (svc, resp) {
        return JSON.parse(resp.text);
    }
});