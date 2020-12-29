import { checkAfterLoginUISetup } from './custom.js';
import { RestRoutes, UIRoutes } from './routes.js';
import { logout } from './logout.js';

const MAX_QUANTITY = 20;

const div_checkout = $("#div_checkout");
const btn_checkout = div_checkout.find("#btn_checkout");

let cart = {};
const cartChangeEvent = new EventTarget();
let processingForm = false;

$(document).ready(() => {
	div_checkout.hide();
	btn_checkout.on("click", performCheckout);

	checkAfterLoginUISetup();
	$("#btn_logout").on("click", () => {
		logout();
	});

	getItems();
});

function getItems() {
	$.ajax({
		url: RestRoutes.item.list,
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
	if (response != null) {
		populateUIWithItems(response);
	} else {
		alert("Something went wrong while fetching items.\nContact Admin.");
	}
}

function getItems_AJAX_Error(error) {
	alert(error.data);
	console.log(error);
}

function getItems_AJAX_Complete() {}


function populateUIWithItems(items) {
	const div_items = $('#div_items');
	const div_item_seed = div_items.find('div[name="div_item"]').clone();
	div_items.empty();

	let span_TotalCost = $('#span_TotalCost');
	span_TotalCost.html("0");

	let time = 300;
	items.forEach((item) => {
		const div_item = div_item_seed.clone();
		let item_image = div_item.find('img[name="item_image"]');
		let item_description = div_item.find('span[name="item_description"]');
		let item_price = div_item.find('span[name="item_price"]');
		let item_unit = div_item.find('span[name="item_unit"]');
		let item_quantity = div_item.find('span[name="item_quantity"]');
		let btn_qty_decrease = div_item.find('button[name="btn_qty_decrease"]');
		let btn_qty_increase = div_item.find('button[name="btn_qty_increase"]');

		if (!item.imageBase64) {
			item.imageBase64 = UIRoutes.noItemImage;
		}
		item_image.attr("src", item.imageBase64);
		item_image.attr("alt", item.itemDesc);

		item_description.html(item.itemDesc);

		item_price.html("₹" + item.price);
		item_unit.html(item.unit);

		item_quantity.html(0);
		item_quantity.attr("data", 0);

		btn_qty_decrease.attr("itemid", item.itemNo);
		btn_qty_decrease.attr("price", item.price);
		btn_qty_increase.attr("itemid", item.itemNo);
		btn_qty_increase.attr("price", item.price);

		btn_qty_decrease.prop("disabled", true);

		btn_qty_decrease.on("click", () => {
			const itemID = Number.parseInt(btn_qty_decrease.attr("itemid"));

			const price = Number.parseInt(btn_qty_decrease.attr("price"));
			let totalPrice = Number.parseInt(span_TotalCost.html());
			span_TotalCost.html(totalPrice - price);

			let quantity = Number.parseInt(item_quantity.attr("data"));
			quantity -= 1;

			if (btn_qty_increase.prop("disabled")) {
				btn_qty_increase.prop("disabled", false);
			}

			item_quantity.html(quantity);
			item_quantity.attr("data", quantity);

			cart[itemID] = quantity;

			if (quantity == 0) {
				delete cart[itemID];
				btn_qty_decrease.prop("disabled", true);
			}

			$(cartChangeEvent).trigger("change");
		});

		btn_qty_increase.on("click", () => {
			const itemID = Number.parseInt(btn_qty_decrease.attr("itemid"));

			const price = Number.parseInt(btn_qty_decrease.attr("price"));
			let totalPrice = Number.parseInt(span_TotalCost.html());
			span_TotalCost.html(totalPrice + price);

			let quantity = Number.parseInt(item_quantity.attr("data"));
			quantity += 1;

			if (btn_qty_decrease.prop("disabled")) {
				btn_qty_decrease.prop("disabled", false);
			}

			item_quantity.html(quantity);
			item_quantity.attr("data", quantity);

			cart[itemID] = quantity;

			if (quantity == MAX_QUANTITY) {
				btn_qty_increase.prop("disabled", true);
			}

			$(cartChangeEvent).trigger("change");
		});

		div_items.append(div_item);
		setTimeout(() => {
			div_item.removeClass("hide");
		}, time);
		time += 70;
	});

	$(cartChangeEvent).on("change", () => {
		propogateCartUpdateToCheckoutButton();
	});
}


function propogateCartUpdateToCheckoutButton() {
	const itemCount = Object.keys(cart).length;
	if (itemCount <= 0) {
		div_checkout.hide();
	} else {
		div_checkout.fadeIn();
	}
}

function performCheckout() {
	if (processingForm) {
		return;
	}
	btn_checkout.prop("disabled", true);
	processingForm = true;

	const checkoutData = getCheckoutData();
	submitCheckoutData(checkoutData);
}

function getCheckoutData() {
	let user = sessionStorage.getItem("user");
	if (!user) {
		return;
	}
	user = JSON.parse(user);

	const data = {
		username: user.username,
		invoiceItems: []
	}

	const itemNOList = Object.keys(cart);
	itemNOList.forEach((itemNO) => {
		const item = {
			itemNo: itemNO,
			quantity: cart[itemNO],
		}
		data.invoiceItems.push(item);
	});

	return data;
}

function submitCheckoutData(checkoutData) {
	$.ajax({
		url: RestRoutes.invoice.add,
		type: "POST",
		method: "POST",
		data: JSON.stringify(checkoutData),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		//contentType: false,
		//processData: false,
		//cache: false,
		xhrFields: {
			withCredentials: true
		},
		success: (response) => submit_AJAX_Success(response),
		error: (error) => submit_AJAX_Error(error),
		complete: () => submit_AJAX_Complete()
	});
}

function submit_AJAX_Success(response) {
	console.log(response);
	if (response.status == 201) {
		alert("Order Added");
		location.assign(UIRoutes.customer.orders);
	} else {
		alert(response.data);
	}
}

function submit_AJAX_Error(error) {
	console.log(error);
}

function submit_AJAX_Complete() {
	processingForm = false;
	btn_checkout.prop("disabled", false);
}