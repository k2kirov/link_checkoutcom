'use strict';

/* API Includes */
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');
var ISML = require('dw/template/ISML');
var OrderMgr = require('dw/order/OrderMgr');

/* Site controller */
var SiteControllerName = dw.system.Site.getCurrent().getCustomPreferenceValue('ckoStorefrontController');

/* Shopper cart */
var Cart = require(SiteControllerName + '/cartridge/scripts/models/CartModel');

/* App */
var app = require(SiteControllerName + '/cartridge/scripts/app');

/* Helpers */
var CKOHelper = require('~/cartridge/scripts/helpers/CKOHelper');

/* Utility */
var util = require('~/cartridge/scripts/utility/util');

/* Business Name */
var businessName = dw.system.Site.getCurrent().getCustomPreferenceValue('ckoBusinessName');

/* Card payment */
var payWithCard = dw.system.Site.getCurrent().getCustomPreferenceValue('ckoCard'); 

/* Alternative payment */
var payWithApms = dw.system.Site.getCurrent().getCustomPreferenceValue('ckoApms'); 


/**
 * Verifies a credit card against a valid card number and expiration date and possibly invalidates invalid form fields.
 * If the verification was successful a credit card payment instrument is created.
 */
function Handle(args) {
	var cart = Cart.get(args.Basket);
	var paymentMethod = args.PaymentMethodID;
	//var shop_url = paymentTypeForm.get('shop_url').value();
	

	// get card payment form
	var paymentForm = app.getForm('cardPaymentForm');
	
	// prepare card data object
	var cardData = {
			
		owner		: paymentForm.get('owner').value(),
		number		: util.getFormattedNumber(paymentForm.get('number').value()),
		month		: paymentForm.get('expiration.month').value(),
		year		: paymentForm.get('expiration.year').value(),
		cvn			: paymentForm.get('cvn').value(),
		cardType	: paymentForm.get('type').value()
		
	};	
	
	// proceed with transaction
	Transaction.wrap(function(){
		cart.removeExistingPaymentInstruments(paymentMethod);
		
		var paymentInstrument = cart.createPaymentInstrument(paymentMethod, cart.getNonGiftCertificateAmount());
		
		paymentInstrument.creditCardHolder = cardData.owner;
		paymentInstrument.creditCardNumber = cardData.number;
		paymentInstrument.creditCardExpirationMonth = cardData.month;
		paymentInstrument.creditCardExpirationYear = cardData.year;
		paymentInstrument.creditCardType = cardData.cardType;
	});
	
	return {success: true};
	

}

/**
 * Authorizes a payment using a credit card. The payment is authorized by using the BASIC_CREDIT processor
 * only and setting the order no as the transaction ID. Customizations may use other processors and custom
 * logic to authorize credit card payment.
 */
function Authorize(args) {

	// Preparing payment parameters
	var orderNo = args.OrderNo;
	var cart = Cart.get(args.Basket);
	var paymentInstrument = args.PaymentInstrument;
	var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();
	
	// Add data to session for payment return
	session.privacy.ckoOrderId = args.OrderNo;
	

	var paymentTypeForm = app.getForm('cardPaymentForm');
	
	// get payment type
	var payment_type = paymentTypeForm.get('payment_method').value();	
	
	// get shop url
	var shop_url = paymentTypeForm.get('shop_url').value();
	
	
	
	// process card payment
	var cardData = {
		"name"			: paymentInstrument.creditCardHolder,
		"number"		: paymentInstrument.creditCardNumber,
		"expiryMonth"	: paymentInstrument.creditCardExpirationMonth,
		"expiryYear"	: paymentInstrument.creditCardExpirationYear,
		"cvv"			: app.getForm("cardPaymentForm").get('cvn').value(),
		"type"			: paymentInstrument.creditCardType
	};
	
	// perform the charge
	var request = util.handleFullChargeRequest(cardData, args);
	
	// Transaction wrapper
	Transaction.wrap(function(){
		paymentInstrument.paymentTransaction.transactionID = orderNo;
		paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
	});
	
	// Handle card charge result
	if(request){
		
		if(util.getValue('cko3ds')){
			
			ISML.renderTemplate('redirects/3DSecure.isml', {
				redirectUrl: session.privacy.redirectUrl,
			});
			
			return {authorized: true, redirected: true};
			
		}else{
			return {authorized: true};
		}
		
	}else{
		return {error: true};
	}	

}

/*
 * Module exports
 */
exports.Handle = Handle;
exports.Authorize = Authorize;