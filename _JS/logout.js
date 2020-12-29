import { RestRoutes, UIRoutes } from './routes.js';

export function logout() {
	let user = sessionStorage.getItem("user");
	if (!user) {
		return;
	}

	user = JSON.parse(user);

	$.ajax({
		url: RestRoutes.user.logout,
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
		success: (response) => submit_AJAX_Success(response),
		error: (error) => submit_AJAX_Error(error),
		complete: () => submit_AJAX_Complete()
	});
	return false;
}

function submit_AJAX_Success(response) {
	console.log(response);
	if (response.status == 500) {
		alert(response.data);
	} else {
		sessionStorage.setItem("user", null);
		location.assign(UIRoutes.login);
	}
}

function submit_AJAX_Error(error) {
	console.log(error);
}

function submit_AJAX_Complete() {}