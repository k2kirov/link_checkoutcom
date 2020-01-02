'use strict';

/**
 * jQuery Ajax helpers on DOM ready.
 */
document.addEventListener('DOMContentLoaded', function(){
	initButtons();
}, false);

function initButtons() {
	// Close the modal window
	jQuery('.ckoModal .modal-content .close').click(function() {
		jQuery('[id="ckoModal"]').hide();
	});
}

function openModal() {
	jQuery('[id="ckoModal"]').show();
}
