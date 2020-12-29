import { RestRoutes } from './routes.js';
import { bs_InputValidationFN, inputFileAsDataURL } from './custom.js';

const FORMS = {
	AddItemForm: {
		form: $("#AddItemForm"),
		processing: false,
		submitBtn: $("#btn_additem"),
		fields: {
			itemDesc: {
				input: $("#tb_itemDesc"),
				error: $("#tb_itemDesc_error"),
				defaultMessage: "Ahoy!, No Item Name???",
			},
			unit: {
				input: $("#tb_unit"),
				error: $("#tb_unit_error"),
				defaultMessage: "Oh Come-On!, Mesure Unit???",
			},
			price: {
				input: $("#tb_price"),
				error: $("#tb_price_error"),
				defaultMessage: "This must not be free!!!",
			},
		},
	}
}

let file_image = undefined;
let label_file = undefined;
let img_imagePreview = undefined;
let btn_reset = undefined;

$(document).ready(() => {
	bs_InputValidationFN(submitForm);
	Object.keys(FORMS).forEach((formID) => {
		resetFormErrors(formID);
	});

	file_image = $('#file_image');
	label_file = $('#label_file');
	img_imagePreview = $('#img_imagePreview');
	btn_reset = $('#btn_reset');

	file_image.on('change', () => {
		console.log(file_image[0].files);
		label_file.html(file_image[0].files[0].name);
		inputFileAsDataURL(file_image[0], (event) => {
			img_imagePreview.attr("src", event.target.result);
		});
	});

	btn_reset.on('click', () => {
		label_file.html("");
		img_imagePreview.attr("src", "/Exercise_73/_Images/NoImage.svg");
	})

});

function resetFormErrors(formID) {
	Object.keys(FORMS[formID].fields).forEach((fieldname) => {
		const field = FORMS[formID].fields[fieldname];
		field.processing = false;
		field.input[0].setCustomValidity("");
		field.error.html(field.defaultMessage);
	});
}

function submitForm(form) {
	const formID = $(form).attr("id");
	resetFormErrors(formID);
	switch (formID) {
		case "AddItemForm":
			submitAddItemForm(formID);
			break;
	}
}

function submitAddItemForm(formID) {
	if (FORMS[formID].processing) {
		return;
	}
	FORMS[formID].processing = true;
	FORMS[formID].submitBtn.prop("disabled", true);

	let formData = new FormData(FORMS[formID].form[0]);
	formData.append("itemDesc", $("#tb_itemDesc").val());
	formData.append("unit", $("#tb_unit").val());
	formData.append("price", $("#tb_price").val());
	if ($("#file_image")[0].files.length > 0) {
		formData.append("image", $("#file_image")[0].files[0]);
	}

	$.ajax({
		url: RestRoutes.item.add,
		type: "POST",
		method: "POST",
		data: formData,
		// dataType: "json",
		// contentType: "application/json; charset=utf-8",
		contentType: false,
		processData: false,
		//cache: false,
		xhrFields: {
			withCredentials: true
		},
		success: (response) => submit_AJAX_Success(response, formID),
		error: (error) => submit_AJAX_Error(error, formID),
		complete: () => submit_AJAX_Complete(formID)
	});

	function submit_AJAX_Success(response, formID) {
		console.log(response);
		if (response.status == 201) {
			alert("Add Item Success.")
			btn_reset.click();
		} else {
			alert("An error Occured while adding item.")
		}
	}

	function submit_AJAX_Error(error, formID) {
		console.log(error);
	}

	function submit_AJAX_Complete(formID) {
		FORMS[formID].processing = false;
		FORMS[formID].submitBtn.prop("disabled", false);
	}
}