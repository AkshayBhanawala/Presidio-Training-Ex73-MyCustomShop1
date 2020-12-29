import { checkAfterLoginUISetup } from './custom.js';
import { logout } from './logout.js';

$(document).ready(() => {
	checkAfterLoginUISetup();
	$("#btn_logout").on("click", () => {
		logout();
	});
});