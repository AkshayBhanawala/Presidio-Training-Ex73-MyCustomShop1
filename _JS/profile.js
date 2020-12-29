import { checkAfterLoginUISetup } from './custom.js';
import { logout } from './logout.js';
import { RestRoutes } from './routes.js';
import { bs_InputValidationFN } from './custom.js';

const FORMS = {
	ProfileForm: {
		form: $("#ProfileForm"),
		processing: false,
		submitBtn: $("#btn_submit"),
		fields: {
			password: {
				input: $("#tb_password"),
				error: $("#tb_password_error"),
				defaultMessage: "Yo!, Current Password???",
			},
			new_password: {
				input: $("#tb_new_password"),
				error: $("#tb_new_password_error"),
				defaultMessage: "Oh Hello!, New Password???",
			},
			confirm_new_password: {
				input: $("#tb_confirm_new_password"),
				error: $("#tb_confirm_new_password_error"),
				defaultMessage: "Hey, It's not matching!!!",
			},
		},
	}
}

let user = undefined;

$(document).ready(() => {
	checkAfterLoginUISetup();
	updateUI();
	$("#btn_logout").on("click", () => {
		logout();
	});
});

$(document).ready(() => {
	bs_InputValidationFN(submitForm);
	Object.keys(FORMS).forEach((formID) => {
		resetFormErrors(formID);
	});

	FORMS.ProfileForm.fields.new_password.input.on("keyup", (event) => {
		FORMS.ProfileForm.fields.confirm_new_password.input
			.attr("pattern", $(event.target).val());
	});
});

function updateUI() {
	let obj = sessionStorage.getItem("user");
	if (!obj || obj == "null") {
		return;
	}
	user = JSON.parse(obj);
	$("#noUser").addClass("hide");
	$("#section_ProfileForm").removeClass("hide");
	$("#menu" + user.role).removeClass("hide");

	const linkHome = $("#linkHome");
	const linkHomeURL = linkHome.attr("href") + "users/" + user.role.toLowerCase() + "/";
	linkHome.attr("href", linkHomeURL);

	$("#div_profileAvatar_wrapper").attr(user.role, "");
	$("#span_avatarRole").html(user.role);

	$("#span_avatarText").html(getInitialsName(user.username));
	$("#span_avatarName").html(user.username);
}

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
		case "ProfileForm":
			submitProfileForm(formID);
			break;
	}
}

function submitProfileForm(formID) {
	if (FORMS[formID].processing) {
		return;
	}
	FORMS[formID].processing = true;
	FORMS[formID].submitBtn.prop("disabled", true);

	let formData = {
		username: user.username,
		password: FORMS.ProfileForm.fields.password.input.val(),
		newPassword: FORMS.ProfileForm.fields.new_password.input.val(),
		confirmNewPassword: FORMS.ProfileForm.fields.confirm_new_password.input.val(),
	};

	$.ajax({
		url: RestRoutes.user.update,
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
	if (response.status != 202) {
		if (Array.isArray(response.data)) {
			response.data.forEach(error => formFieldErrorUpdate(formID, error.fieldName, error.message));
		} else {
			formFieldErrorUpdate(formID, response.data.fieldName, response.data.message)
		}
	} else {
		alert("Update Success");
		FORMS[formID].form[0].reset();
		FORMS[formID].form.removeClass("was-validated");
	}
}

function submit_AJAX_Error(error, formID) {
	console.log(error);
}

function submit_AJAX_Complete(formID) {
	FORMS[formID].processing = false;
	FORMS[formID].submitBtn.prop("disabled", false);
}

function formFieldErrorUpdate(formID, fieldName, message) {
	const field = FORMS[formID].fields[fieldName];
	if (!field) {
		return;
	}
	field.error.html(message);
	field.input[0].setCustomValidity(message);
	field.input.off();
	field.input.on("focus", () => {
		FORMS[formID].form.removeClass("was-validated");
		field.input[0].setCustomValidity("");
	});
}

function getInitialsName(username) {
	let uns = username.split(" ");
	if (uns.length > 1) {
		return (uns[0].charAt(0) + uns[uns.length - 1].charAt(0)).toUpperCase();
	}
	return uns[0].charAt(0).toUpperCase();
}