import { checkAfterLoginUISetup } from './custom.js';
import { RestRoutes, UIRoutes } from './routes.js';
import { logout } from './logout.js';

let user = undefined;

$(document).ready(() => {
	checkAfterLoginUISetup();
	$("#btn_logout").on("click", () => {
		logout();
	});

	user = sessionStorage.getItem("user");
	if (user && user != "null") {
		user = JSON.parse(user);
	} else {
		user = undefined
	}

	getOrders();
});

function getOrders() {
	$.ajax({
		url: RestRoutes.user.find.replace("{username}", user.username),
		type: "POST",
		method: "POST",
		//data: JSON.stringify(formData),
		//dataType: "json",
		//contentType: "application/json; charset=utf-8",
		//contentType: false,
		//processData: false,
		//cache: false,
		xhrFields: {
			withCredentials: true
		},
		success: (response) => getItems_AJAX_Success(response),
		error: (error) => getItems_AJAX_Error(error),
		complete: () => getItems_AJAX_Complete()
	});
}

function getItems_AJAX_Success(response) {
	if (response.status == 200) {
		//sessionStorage.setItem("user", response.data)
		populateUIWithOrders(response.data.invoices);
	} else {
		alert(response.data);
	}
}

function getItems_AJAX_Error(error) {
	alert(error.data);
	console.log(error);
}

function getItems_AJAX_Complete() {}


function populateUIWithOrders(orders) {
	const div_orders = $('#div_orders');
	const div_order_seed = div_orders.find('div[name="div_order"]').clone();
	div_orders.empty();

	let time = 400;
	orders.reverse().forEach((order, OrderIndex) => {
		const div_order = div_order_seed.clone();
		let order_counter = div_order.find('span[name="counter"]');
		let order_date = div_order.find('span[name="date"]');
		let order_amount = div_order.find('span[name="amount"]');
		let btn_getPDF = div_order.find('button[name="btn_getPDF"]');

		order_counter.html(OrderIndex + 1);

		const invoiceDate = new Date(order.invoiceDate);
		order_date.html(invoiceDate.toLocaleString());

		order_amount.remove();

		btn_getPDF.on("click", () => {
			btn_getPDF.prop("disabled", true);

			buildInvoicePDF(order, btn_getPDF);
		});

		div_orders.append(div_order);
		setTimeout(() => {
			div_order.removeClass("hide");
		}, time);
		time += 70;
	});
}

function buildInvoicePDF(invoice, btn_getPDF) {
	let newWindow = window.open(UIRoutes.pdf);
	newWindow.invoice = invoice;
	setTimeout(() => {
		btn_getPDF.prop("disabled", false);
	}, 200);
}