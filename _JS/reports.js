import { Jhxlsx } from './libraries/jhxlsx.js';

export function InvoicesReport(data, fileName) {
	const ext = ".xlsx";

	if (!data || data == null) {
		return;
	}

	let totalItemCount = 0;
	let totalQuantity = 0;
	let totalCost = 0;

	let rowStruct = [
		{ "text": "Invoice No." },
		{ "text": "Invoice Date" },
		{ "text": "Username" },
		{ "text": "Item Count" },
		{ "text": "Quantity" },
		{ "text": "Cost" },
	];

	let myData = [];

	myData.push(rowStruct);

	data.forEach(invoice => {
		let innerRowStruct = [];

		innerRowStruct.push({ "text": invoice.invoiceNo });
		innerRowStruct.push({ "text": new Date(invoice.invoiceDate).toLocaleDateString() });
		innerRowStruct.push({ "text": invoice.user });
		innerRowStruct.push({ "text": invoice.invoiceItems.length });

		let quantitySum = 0;
		let cost = 0;
		invoice.invoiceItems.forEach(itemDetails => {
			quantitySum += itemDetails.quantity;
			cost += itemDetails.quantity * itemDetails.item.price;
		});
		innerRowStruct.push({ "text": quantitySum });
		innerRowStruct.push({ "text": cost });

		myData.push(innerRowStruct);

		totalItemCount += invoice.invoiceItems.length;
		totalQuantity += quantitySum;
		totalCost += cost;
	});

	let innerRowStruct = [];
	innerRowStruct.push({ "text": "" });
	innerRowStruct.push({ "text": "" });
	innerRowStruct.push({ "text": "" });
	innerRowStruct.push({ "text": totalItemCount });
	innerRowStruct.push({ "text": totalQuantity });
	innerRowStruct.push({ "text": totalCost });
	myData.push(innerRowStruct);

	let tabularData = [{
		"sheetName": "Sheet1",
		"data": myData
	}];

	let options = {
		fileName: fileName,
		extension: ext,
		sheetName: fileName,
		fileFullName: fileName + ext,
		header: true,
		//maxCellWidth: 20
	};
	Jhxlsx.export(tabularData, options)
}