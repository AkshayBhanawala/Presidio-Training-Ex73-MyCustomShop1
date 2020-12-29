import { RestRoutes, UIRoutes } from './routes.js';
import { bs_InputValidationFN } from './custom.js';

const FORMS = {
	RegisterForm: {
		form: $("#RegisterForm"),
		processing: false,
		submitBtn: $("#btn_login"),
		fields: {
			username: {
				input: $("#tb_username"),
				error: $("#tb_username_error"),
				defaultMessage: "Yo!, Username???",
			},
			password: {
				input: $("#tb_password"),
				error: $("#tb_password_error"),
				defaultMessage: "Oh Hello!, Password???",
			},
		},
	}
}

$(document).ready(() => {
	bs_InputValidationFN(submitForm);
	Object.keys(FORMS).forEach((formID) => {
		resetFormErrors(formID);
	});
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
		case "RegisterForm":
			submitLoginForm(formID);
			break;
	}
}

function submitLoginForm(formID) {
	if (FORMS[formID].processing) {
		return;
	}
	FORMS[formID].processing = true;
	FORMS[formID].submitBtn.prop("disabled", true);

	let formData = {
		username: $("#tb_username").val(),
		password: $("#tb_password").val()
	};

	$.ajax({
		url: RestRoutes.user.register,
		type: "POST",
		method: "POST",
		data: JSON.stringify(formData),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		//contentType: false,
		//processData: false,
		//cache: false,
		xhrFields: {
			withCredentials: true
		},
		success: (response) => submit_AJAX_Success(response, formID),
		error: (error) => submit_AJAX_Error(error, formID),
		complete: () => submit_AJAX_Complete(formID)
	});
	return false;
}

function submit_AJAX_Success(response, formID) {
	console.log(response);
	if (response.status != 201) {
		const field = FORMS[formID].fields[response.data.fieldName];
		field.error.html(response.data.message);
		field.input[0].setCustomValidity(response.data);
		field.input.on("focus", () => {
			FORMS[formID].form.removeClass("was-validated");
			field.input[0].setCustomValidity("");
		});
	} else {
		alert("Registration Success.\nRedirecting you to Login.")
		location.assign(UIRoutes.login);
	}
}

function submit_AJAX_Error(error, formID) {
	console.log(error);
}

function submit_AJAX_Complete(formID) {
	FORMS[formID].processing = false;
	FORMS[formID].submitBtn.prop("disabled", false);
}