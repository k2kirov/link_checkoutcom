//													//
//	Alternative Payment Form decorator object;		//
//													//

"use strict";


var apm_selected = false;
var apm_selected_box = false;

/**
 * jQuery Ajax helpers on DOM ready.
 */
document.addEventListener('DOMContentLoaded', function(){
	
	AlternativePayments();
	
}, false);


/*
 * Alternative Payments
 */
function AlternativePayments(){
	
	$('input[name="apm_payment_types"]').change(function(){
		
		switch(this.value){
		case"ideal":
			idealPayBox();
			break;
		case"boleto":
			boletoPayBox();
			break;
		case"eps":
			epsPayBox();
			break;
		case"giro":
			giroPayBox();
			break;
		case"fawry":
			fawryPayBox();
			break;
		case"knet":
			knetPayBox();
			break;
		case"qpay":
			qPayBox();
			break;
		case"sepa":
			sepaPayBox();
			break;
		case"bancontact":
			bancontactPayBox();
			break;
		case"sofort":
			sofortPayBox();
			break;
		case"benefit":
			benefitPayBox();
			break;
		case"multibanco":
			multibancoPayBox();
			break;
		case"poli":
			poliPayBox();
			break;
		case"p24":
			p24PayBox();
			break;
		case"klarna":
			klarnaPayBox();
			break;
		case"paypal":
			paypalPayBox();
			break;
		default:
			console.log('Apm unknown');
		}
		
		
	});
	
}



/*
 * Ideal Pay decorator
 */
function idealPayBox(){
	// ideal pay radio button element
	var ideal = $('#ideal_apm_radio_btn');
	
	// ideal pay input elements div
	var idealBox = $('#ideal_pay_box');
	
	// input fields
	toggleAPMS(ideal, idealBox);
	
}

/*
 * Knet Pay decorator
 */
function knetPayBox(){
	// knet pay radio button element
	var knet = $('#knet_apm_radio_btn');
	
	// knet pay input elements div
	var knetBox = $('#knet_pay_box');
	
	// input fields
	toggleAPMS(knet, knetBox);
	
}

/*
 * Sepa Pay decorator
 */
function sepaPayBox(){
	// sepa pay radio button element
	var sepa = $('#sepa_apm_radio_btn');
	
	// sepa pay input elements div
	var sepaBox = $('#sepa_pay_box');
	
	// input fields
	toggleAPMS(sepa, sepaBox);
	
}

/*
 * Klarna Pay decorator
 */
function klarnaPayBox(){
	// klarna pay radio button element
	var klarna = $('#klarna_apm_radio_btn');
	
	// klarna pay input elements div
	var klarnaBox = $('#klarna_pay_box');
	
	// input fields
	toggleAPMS(klarna, klarnaBox);
	
}

/*
 * QPay decorator
 */
function qPayBox(){
	// Qpay radio button element
	var qpay = $('#qpay_apm_radio_btn');

	// Qpay input elements div
	var qpayBox = $('#qpay_pay_box');
	
	// input fields
	toggleAPMS(qpay, qpayBox);
	
}


/*
 * Fawry decorator
 */
function fawryPayBox(){
	// fawry pay radio button element
	var fawry = $('#fawry_apm_radio_btn');

	// fawry pay input elements div
	var fawrypayBox = $('#fawry_pay_box');
	
	// input fields
	toggleAPMS(fawry, fawrypayBox);
	
}


/*
 * Sofort Pay decorator
 */
function sofortPayBox(){
	// sofort pay radio button element
	var sofort = $('#sofort_apm_radio_btn');
	
	// sofort pay input elements div
	var sofortBox = $('#sofort_pay_box');
	
	// input fields
	toggleAPMS(sofort, sofortBox);
	
}


/*
 * EPS Pay decorator
 */
function epsPayBox(){
	// eps pay radio button element
	var eps = $('#epsPay_apm_radio_btn');
	
	// eps pay input elements div
	var epsBox = $('#epsPay_pay_box');
	
	// input fields
	toggleAPMS(eps, epsBox);
	
}


/*
 * Boleto Pay decorator
 */
function boletoPayBox(){
	// boleto pay radio button element
	var boleto = $('#boleto_apm_radio_btn');
	
	// boleto pay input elements div
	var boletoBox = $('#boleto_pay_box');
	
	// Date formating
	var cleave = new Cleave('#dwfrm_alternativePaymentForm_boleto__birthDate', {
	    date: true,
	    delimiter: '-',
	    datePattern: ['Y', 'm', 'd']
	});
	
	// set input fields toggle
	toggleAPMS(boleto, boletoBox);
	
}


/*
 * Bancontact Pay decorator
 */
function bancontactPayBox(){
	// bancontact pay radio button element
	var bancontact = $('#bancontact_apm_radio_btn');
	
	// bancontact pay input elements div
	var bancontactBox = $('#bancontact_pay_box');
	
	// set input fields toggle
	toggleAPMS(bancontact, bancontactBox);
}


/*
 * Benefit Pay decorator
 */
function benefitPayBox(){
	// benefit pay radio button element
	var benefitPay = $('#benefit_apm_radio_btn');
	
	// benefit pay input elements div
	var benefitPayBox = $('#benefitPay_pay_box');
	
	// set input fields toggle
	toggleAPMS(benefitPay, benefitPayBox);
}


/*
 * Giro Pay decorator
 */
function giroPayBox(){
	// giro pay radio button element
	var giroPay = $('#giroPay_apm_radio_btn');
	
	// giro pay input elements div
	var giroPayBox = $('#giroPay_pay_box');
	
	// set input fields toggle
	toggleAPMS(giroPay, giroPayBox);
}


/*
 * Multibanco Pay decorator
 */
function multibancoPayBox(){
	// multibanco pay radio button element
	var multibancoPay = $('#multibancoPay_apm_radio_btn');
	
	// multibanco pay input elements div
	var giroPayBox = $('#multibancoPay_pay_box');
	
	// set input fields toggle
	toggleAPMS(multibancoPay, giroPayBox);
}

/*
 * Poli Pay decorator
 */
function poliPayBox(){
	// multibanco pay radio button element
	var poliPay = $('#poliPay_apm_radio_btn');
	
	// multibanco pay input elements div
	var poliPayBox = $('#poliPay_pay_box');
	
	// set input fields toggle
	toggleAPMS(poliPay, poliPayBox);
}

/*
 * Poli Pay decorator
 */
function p24PayBox(){
	// multibanco pay radio button element
	var p24Pay = $('#p24Pay_apm_radio_btn');
	
	// multibanco pay input elements div
	var p24PayBox = $('#p24Pay_pay_box');
	
	// set input fields toggle
	toggleAPMS(p24Pay, p24PayBox);
}


/*
 * Paypal Pay decorator
 */
function paypalPayBox(){
	// multibanco pay radio button element
	var paypalPay = $('#paypalPay_apm_radio_btn');
	
	// multibanco pay input elements div
	var paypalPayBox = $('#paypalPay_pay_box');
	
	// set input fields toggle
	toggleAPMS(paypalPay, paypalPayBox);
}


/*
 * Poli Pay decorator
 */
function klarnaPayBox(){
	// multibanco pay radio button element
	var klarnaPay = $('#klarna_apm_radio_btn');
	
	// multibanco pay input elements div
	var klarnaPayBox = $('#klarnaPay_pay_box');
	
	// set input fields toggle
	toggleAPMS(klarnaPay, klarnaPayBox);
	
}


function callKlarnaController(controllerUrl){
	//console.log(controllerUrl);
	
	if(controllerUrl){
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var sessionId = JSON.parse(this.responseText).session_id;
	    	var token = JSON.parse(this.responseText).client_token;
	    	var categories = JSON.parse(this.responseText).payment_method_categories;
	    	var requestObject = JSON.parse(this.responseText).requestObject;
	    	var addressInfo = JSON.parse(this.responseText).addressInfo;
	    	
	    	
	    	
	    	//console.log(JSON.parse(this.responseText));
	    	
		    Klarna.Payments.init(
			    // options
		    	{
		    		client_token: token
			});
	    	
	    	var klarnaBox = $('#klarna-buttons');
	    	
	    	for(var i = 0; i < categories.length; i++){

	    		//<input id="klarna_apm_radio_btn" type="radio" name="apm_payment_types" value="klarna">
		    	
		    	var klarnaButton = "<div style='padding: 10px; border: solid 0.5px #eee; border-radius: 5px;'> " + categories[i].name 
		    	+ " <input type='radio' name='payment_method_categories' value='" + categories[i].identifier + "'id='" 
		    	+ categories[i].identifier + "' onclick='loadKlarna(`"+ categories[i].identifier 
		    	+ "`, `" + JSON.stringify(requestObject) +"`,  `" + JSON.stringify(addressInfo) + "` ,`" + sessionId + "` )'><img src='" 
		    	+ categories[i].asset_urls.descriptive + "' alt='Klarna Image' id='" + categories[i].identifier 
		    	+ "_image' style='margin-top: 10px; float: right;'> <p id='" + categories[i].identifier 
		    	+ "_aproved' style='color: #84bd00; float: right; display: none;'><span style='font-size:20px;'>&#10003;</span> Approved By <span style='color: black;'>Klarna</span></p> <p style='color: #990000; float: right; display: none;' id='" 
		    	+ categories[i].identifier + "_rejected'><span style='font-size:20px;'>&#10007;</span>Rejected By <span style='color: black;'>Klarna</span></p><div>";
	    		
	    		klarnaBox.append(klarnaButton);
	    		
	    	}

		
		  	    	
	    }
	  };
	  xhttp.open("GET", controllerUrl, true);
	  xhttp.send();
	}
	
}


/*
 * Load Klarna Widget
 */
function loadKlarna(paymentMethod, requestObject, addressInfo, sessionId){

	var requestObject = JSON.parse(requestObject);
	var addressInfo = JSON.parse(addressInfo);
	
	//console.log(sessionId);
	
	$('#klarna-payments-container').empty();
	
	Klarna.Payments.load({
		container					: '#klarna-payments-container',
	    payment_method_category		: paymentMethod,
	    instance_id					: sessionId
		}, function (res) {
		console.debug(res);
		klarnaAuthorizeButton('#klarna-payments-container', sessionId, paymentMethod);
	});
	
//	Klarna.Payments.load({
//		container					: '#klarna-payments-container',
//	    payment_method_category		: paymentMethod,
//	    instance_id					: sessionId
//		}, {
//            purchase_country			: requestObject.purchase_country,
//            purchase_currency			: requestObject.currency,
//            locale					: requestObject.locale,
//            billing_address			: addressInfo,
//            shipping_address			: addressInfo,
//            order_amount				: requestObject.amount,
//            order_tax_amount			: requestObject.tax_amount,
//            order_lines				: requestObject.products,
//            customer					: {
//							                date_of_birth: "1970-01-01",
//							                gender: "male"
//							            }
//            
//		},
//        function (response) {
//            // ...
//			console.log(response);
//        }
//		
//	);
}


/*
 * Klarna Authorize button
 */
function klarnaAuthorizeButton(klarnaContainer, sessionId, paymentMethod){
	//console.log(klarnaContainer);
	
	var AuthorizeBtn = "<button type='button' style='width: 100%; margin-top: 30px;' onclick='klarnaAuthorize(`" + sessionId 
	+ "`, `" + klarnaContainer + "`, `" + paymentMethod + "`)'>Authorize</button>";
	
	var klarna = $(klarnaContainer);
	
	klarna.append(AuthorizeBtn);
	
	
}


/*
 * Klarna Authorize
 */
function klarnaAuthorize(sessionId, klarnaContainer, paymentMethod){
	
    Klarna.Payments.authorize(
        // options
        {
            instance_id			: sessionId,
            auto_finalize		: false // Optional, defaults to true - relevant in case of payment_method_category "pay_now". Should be true for single-page checkout and false for multi-page checkout
        },
        // callback
        function (response) {
            // ...
        	console.log(response);
        	
        	if(response.approved){
    			$(klarnaContainer).empty();
    			$('#' + paymentMethod + '_image').hide();
    			$('#' + paymentMethod + '_aproved').show();
    			$('#' + paymentMethod + '_rejected').hide();
    			
    			// save value to hidden klarna form
    			$('#dwfrm_alternativePaymentForm_klarna__token').val(response.authorization_token);
    			$('#dwfrm_alternativePaymentForm_klarna__approved').val(response.approved);
    			$('#dwfrm_alternativePaymentForm_klarna__finalize__required').val(response.finalize_required);

        	}else{
    			$(klarnaContainer).empty();
    			$('#' + paymentMethod + '_image').hide();
    			$('#' + paymentMethod + '_rejected').show();
    			$('#' + paymentMethod + '_aproved').hide();
    			
    			// save value to hidden klarna form
    			$('#dwfrm_alternativePaymentForm_klarna__token').val(response.authorization_token);
    			$('#dwfrm_alternativePaymentForm_klarna__approved').val(response.approved);
    			$('#dwfrm_alternativePaymentForm_klarna__finalize__required').val(response.finalize_required);
        	}
        	
        }
   );
}



/*
 * Set APM Forms
 */
function toggleAPMS(apms, apmBox){
	
	// if another apm is selected
	if(apm_selected){
		apm_selected.toggle();
		apmBox.toggle();
		apm_selected = apmBox;
		
		// set alternative payment value
		var apmSelect = $('#dwfrm_alternativePaymentForm_alternative__payments');
		apmSelect.val(apms.val());
		
		// set shop url value
		var apmShopUrl = $('#dwfrm_alternativePaymentForm_store__url');
		apmShopUrl.val(location.hostname);
		
	}else{
		apmBox.toggle();
		apm_selected = apmBox;
		
		// set alternative payment value
		var apmSelect = $('#dwfrm_alternativePaymentForm_alternative__payments');
		apmSelect.val(apms.val());
		
		// set shop url value
		var apmShopUrl = $('#dwfrm_alternativePaymentForm_store__url');
		apmShopUrl.val(location.hostname);
		
	}

}

