export function bs_InputValidationFN(submitForm) {
	const forms = $("form.needs-validation");
	for (let index = 0; index < forms.length; index++) {
		$(forms[0]).on('submit', (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (forms[0].checkValidity() === true) {
				submitForm(forms[0]);
			}
			$(forms[0]).addClass('was-validated');
		});
	}
}

export function checkAfterLoginUISetup() {
	const lbl_username = $("#lbl_username");
	let user = sessionStorage.getItem("user");
	if (!user || user == "null") {
		lbl_username.addClass("text-danger");
		lbl_username.html("NO USER");
		return;
	}
	user = JSON.parse(user);
	lbl_username.html(user.username);
}

export function getInputConstraintLocalDateString(date) {
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

export function inputFileAsDataURL(fileInput, callBack) {
	if (fileInput.files && fileInput.files[0]) {
		var reader = new FileReader();
		reader.onload = callBack;
		reader.readAsDataURL(fileInput.files[0]);
	}
}