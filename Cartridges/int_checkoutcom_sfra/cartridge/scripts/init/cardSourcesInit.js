/* API Includes */
var svc = require('dw/svc');

/* Utililty module */
var util = require('~/cartridge/scripts/helpers/ckoHelper');

/**
 * Initialize HTTP service for the Checkout.com sandbox full card charge.
 */
svc.ServiceRegistry.configure("cko.card.sources.sandbox.service", {
    createRequest: function (svc, args) {
        // Prepare the http service
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
 * Initialize HTTP service for the Checkout.com live full card charge.
 */
svc.ServiceRegistry.configure("cko.card.sources.live.service", {
    createRequest: function (svc, args) {
        // Prepare the http service
        svc.addHeader("Authorization", util.getAccountKeys().secretKey);
        svc.addHeader("User-Agent", util.getCartridgeMeta());
        svc.addHeader("Content-Type", 'application/json;charset=UTF-8');
       
        return (args) ? JSON.stringify(args) : null;
    },

    parseResponse: function (svc, resp) {
        return JSON.parse(resp.text);
    }
});
