import { checkAfterLoginUISetup, getInputConstraintLocalDateString } from './custom.js';
import { RestRoutes } from './routes.js';
import { logout } from './logout.js';
import { InvoicesReport } from './reports.js';

let btn_AllInvoices = undefined;
let btn_DayInvoices = undefined;
let btn_DateRangeInvoices = undefined;

let tb_DayInvoices_Date = undefined;
let tb_DateRangeInvoices_FromDate = undefined;
let tb_DateRangeInvoices_ToDate = undefined;

$(document).ready(() => {
	checkAfterLoginUISetup();
	$("#btn_logout").on("click", () => {
		logout();
	});

	initialise_AllInvoices_Elements();
	initialise_DayInvoices_Elements();
	initialise_DateRangeInvoices_Elements();
});

function initialise_AllInvoices_Elements() {
	btn_AllInvoices = $("#btn_AllInvoices");
	btn_AllInvoices.on("click", () => {
		getAllInvoicesReport();
	});
}

function initialise_DayInvoices_Elements() {
	tb_DayInvoices_Date = $("#tb_DayInvoices_Date");
	tb_DayInvoices_Date.attr("max", getInputConstraintLocalDateString(new Date()));

	btn_DayInvoices = $("#btn_DayInvoices");
	btn_DayInvoices.on("click", () => {
		getDayInvoicesReport();
	});
}

function initialise_DateRangeInvoices_Elements() {
	tb_DateRangeInvoices_FromDate = $("#tb_DateRangeInvoices_FromDate");
	tb_DateRangeInvoices_FromDate.attr("max", getInputConstraintLocalDateString(new Date()));
	tb_DateRangeInvoices_FromDate.on("change", () => {
		const fromDate = new Date(Date.parse(tb_DateRangeInvoices_FromDate.val()));
		tb_DateRangeInvoices_ToDate.attr("min", getInputConstraintLocalDateString(fromDate));
	});

	tb_DateRangeInvoices_ToDate = $("#tb_DateRangeInvoices_ToDate");
	tb_DateRangeInvoices_ToDate.attr("max", getInputConstraintLocalDateString(new Date()));
	tb_DateRangeInvoices_ToDate.on("change", () => {
		const toDate = new Date(Date.parse(tb_DateRangeInvoices_ToDate.val()));
		tb_DateRangeInvoices_FromDate.attr("max", getInputConstraintLocalDateString(toDate));
	});

	btn_DateRangeInvoices = $("#btn_DateRangeInvoices");
	btn_DateRangeInvoices.on("click", () => {
		getDateRangeInvoicesReport();
	});
}



function getAllInvoicesReport() {
	$.ajax({
		url: RestRoutes.invoice.list,
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
		success: (response) => getAllInvoices_AJAX_Success(response),
		error: (error) => getAllInvoices_AJAX_Error(error),
		complete: () => getAllInvoices_AJAX_Complete()
	});

	function getAllInvoices_AJAX_Success(response) {
		if (response != null) {
			InvoicesReport(response, "All Invoices Report");
		} else {
			alert("Something went wrong while fetching report data.\nContact Admin.");
		}
	}
	function getAllInvoices_AJAX_Error(error) {
		alert(error.data);
	}
	function getAllInvoices_AJAX_Complete() { }
}

function getDayInvoicesReport() {
	const form = $('#form_DayInvoices');
	if (form[0].checkValidity() === false) {
		form.addClass("was-validated");
		return;
	}
	const date = new Date(Date.parse(tb_DayInvoices_Date.val())).toISOString();
	$.ajax({
		url: RestRoutes.invoice.listDate.replace("{date}", date),
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
		success: (response) => getDayInvoices_AJAX_Success(response),
		error: (error) => getDayInvoices_AJAX_Error(error),
		complete: () => getDayInvoices_AJAX_Complete()
	});

	function getDayInvoices_AJAX_Success(response) {
		if (response == null) {
			alert("Something went wrong while fetching report data.\nContact Admin.");
			return;
		}
		if (response.data.length == 0) {
			alert("No records available");
			return;
		}
		InvoicesReport(response.data, "Day Invoices Report");
	}
	function getDayInvoices_AJAX_Error(error) {
		alert(error.data);
	}
	function getDayInvoices_AJAX_Complete() { }
}

function getDateRangeInvoicesReport() {
	const form = $('#form_DateRangeInvoices');
	if (form[0].checkValidity() === false) {
		form.addClass("was-validated");
		return;
	}
	const fromDate = new Date(Date.parse(tb_DateRangeInvoices_FromDate.val())).toISOString();
	const toDate = new Date(Date.parse(tb_DateRangeInvoices_ToDate.val())).toISOString();
	const url = RestRoutes.invoice.listDates
		.replace("{fromDate}", fromDate)
		.replace("{toDate}", toDate);
	$.ajax({
		url: url,
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
		success: (response) => getDateRangeInvoices_AJAX_Success(response),
		error: (error) => getDateRangeInvoices_AJAX_Error(error),
		complete: () => getDateRangeInvoices_AJAX_Complete()
	});

	function getDateRangeInvoices_AJAX_Success(response) {
		if (response == null) {
			alert("Something went wrong while fetching report data.\nContact Admin.");
			return;
		}
		if (response.data.length == 0) {
			alert("No records available");
			return;
		}
		InvoicesReport(response.data, "Day Invoices Report");
	}
	function getDateRangeInvoices_AJAX_Error(error) {
		alert(error.data);
	}
	function getDateRangeInvoices_AJAX_Complete() { }
}