
const restBaseURL = "//127.0.0.1:8181/Exercise_73/rest/";
export const RestRoutes = {
	user: {
		list: restBaseURL + "user/list",
		login: restBaseURL + "user/login",
		logout: restBaseURL + "user/logout",
		register: restBaseURL + "user/register",
		delete: restBaseURL + "user/delete/{username}",
		find: restBaseURL + "user/{username}",
	},
	item: {
		list: restBaseURL + "item/list",
		listSold: restBaseURL + "item/list/sold",
		add: restBaseURL + "item/add",
		edit: restBaseURL + "item/edit",
		delete: restBaseURL + "item/delete/{itemNo}",
		find: restBaseURL + "item/{itemNo}",
	},
	invoice: {
		list: restBaseURL + "invoice/list",
		listDate: restBaseURL + "invoice/list/{date}",
		listDates: restBaseURL + "invoice/list/{fromDate}/{toDate}",
		add: restBaseURL + "invoice/add",
		edit: restBaseURL + "invoice/edit",
		delete: restBaseURL + "invoice/delete/{invoiceNo}",
		find: restBaseURL + "invoice/{invoiceNo}",
	},
};

const host = "//127.0.0.1:81/Exercise_73/";
export const UIRoutes = {
	home: host,
	noItemImage: host + "_Images/NoImage.svg",
	pdf: host + "pdf.htm",
	excel: host + "excel.htm",
	login: host + "login.htm",
	register: host + "register.htm",
	clerk: {
		home: host + "users/clerk/",
		additem: host + "users/clerk/additem.htm",
	},
	customer: {
		home: host + "users/customer/",
		orders: host + "users/customer/orders.htm",
	},
	manager: {
		home: host + "users/manager/",
		reports:  host + "users/manager/orders.htm",
	},
};