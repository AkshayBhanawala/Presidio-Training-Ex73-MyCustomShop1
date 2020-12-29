
const imageSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.001 512.001"><path class="outside" d = "M503.698,231.895c-28.735-36.843-65.956-67.318-107.637-88.128c-42.548-21.243-88.321-32.265-136.104-32.843 c-1.316-0.036-6.6-0.036-7.916,0c-47.782,0.579-93.556,11.6-136.104,32.843c-41.681,20.81-78.9,51.284-107.636,88.128 c-11.07,14.193-11.07,34.018,0,48.211c28.735,36.843,65.955,67.318,107.636,88.128c42.548,21.243,88.321,32.265,136.104,32.843 c1.316,0.036,6.6,0.036,7.916,0c47.782-0.579,93.556-11.6,136.104-32.843c41.681-20.81,78.901-51.284,107.637-88.128 C514.768,265.911,514.768,246.088,503.698,231.895z M125.242,349.599c-38.92-19.432-73.678-47.892-100.517-82.303 c-5.187-6.651-5.187-15.94,0-22.591c26.838-34.411,61.596-62.871,100.517-82.303c11.054-5.518,22.342-10.29,33.839-14.33 c-29.578,26.588-48.213,65.12-48.213,107.928c0,42.81,18.636,81.345,48.217,107.932 C147.588,359.892,136.297,355.118,125.242,349.599z M256,380.303c-68.542,0-124.304-55.762-124.304-124.304 S187.458,131.696,256,131.696S380.304,187.458,380.304,256S324.542,380.303,256,380.303z M487.275,267.295 c-26.838,34.411-61.596,62.871-100.517,82.303c-11.041,5.512-22.322,10.263-33.805,14.299 c29.558-26.587,48.179-65.107,48.179-107.898c0-42.814-18.64-81.351-48.223-107.939c11.5,4.041,22.793,8.819,33.85,14.34 c38.92,19.432,73.678,47.892,100.517,82.303C492.462,251.355,492.462,260.644,487.275,267.295z" /><path class="inside" d="M256,202.804c-29.332,0-53.195,23.863-53.195,53.195s23.863,53.195,53.195,53.195s53.195-23.863,53.195-53.195 C309.196,226.667,285.333,202.804,256,202.804z M256,288.367c-17.847,0-32.368-14.519-32.368-32.368 c0-17.848,14.519-32.367,32.368-32.367c17.847,0,32.367,14.519,32.367,32.367C288.368,273.848,273.847,288.367,256,288.367z" /></svg >';

$(document).ready(() => {
	console.clear();

	const css_themeLight = $("#css_themeLight");
	const css_themeDark = $("#css_themeDark");

	let initialTheme = "dark";
	let curTheme = sessionStorage.getItem("theme");
	if (curTheme == null || curTheme == "dark") {
		sessionStorage.setItem("theme", initialTheme);
		css_themeLight.prop("disabled", true);
		css_themeDark.prop("disabled", false);
	} else {
		css_themeDark.prop("disabled", true);
		css_themeLight.prop("disabled", false);
	}

	let header = $("header");
	const themeToggle = $('<span id="themeChanger" theme="' + curTheme + '">' + imageSVG + '<span>');
	header.append(themeToggle);
	themeToggle.on("click", () => {
		let theme = themeToggle.attr("theme");
		if (theme == "dark") {
			css_themeDark.prop("disabled", true);
			css_themeLight.prop("disabled", false);
			theme = "light";
		} else {
			css_themeLight.prop("disabled", true);
			css_themeDark.prop("disabled", false);
			theme = "dark";
		}
		themeToggle.attr("theme", theme);
		sessionStorage.setItem("theme", theme);
	});
	setTimeout(() => {
		$("body").removeClass("hide");
	}, 500);

});