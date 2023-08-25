function ShowLoginForm(){

	SetTitle("Вход в систему");

	ShowHideForm("LoginFrom","Show");
	ShowHideForm("ForgotPasswordForm","Hide");

	ActiveInactiveBtn("ShowLoginBtn","Active");

	ShowHideFromSwitchBtn("Show");
};


function ShowForgotPasswordForm() {
	
	SetTitle("Восстановить пароль");

	ShowHideForm("LoginFrom","Hide");
	ShowHideForm("ForgotPasswordForm","Show");

	ActiveInactiveBtn("ShowLoginBtn","Active");
	ShowHideFromSwitchBtn("Show");
}



function SetTitle(Title){
	var formTitle = document.getElementById('formTitle');
	formTitle.innerHTML = Title;
}

function ShowHideForm(FormID,ShowOrHide){
	var Form = document.getElementById(FormID);

	if(ShowOrHide == "Show"){
		Form.style.display = 'block';
	}else{
		Form.style.display = 'none';
	}
}

function ActiveInactiveBtn(ButtonID,ActiveORInactive) {
	debugger;
	var Button = document.getElementById(ButtonID);

	if(ActiveORInactive == "Active"){
		Button.classList.add('Active');
	}else{
		Button.classList.remove('Active');
	}
}

function ShowHideFromSwitchBtn(ShowOrHide) {
	var formSwitchBtn = document.getElementById('formSwitchBtn');
	if(ShowOrHide == 'Show'){
		formSwitchBtn.style.display = '';
	}else{
		formSwitchBtn.style.display = 'none';
	}
}

// end