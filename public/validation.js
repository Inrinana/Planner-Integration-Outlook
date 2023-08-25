

function ValidateForgotPasswordForm(){

	RemoveAllErrorMessage();

	var forgotPassEmail = document.getElementById('forgotPassEmail').value;
	
	var	emailValidationMessage;
	emailValidationMessage = isValidEmail(forgotPassEmail);

	if(emailValidationMessage != "valid"){
		ShowErrorMessage('forgotPassEmail',emailValidationMessage);
		return false;
	}
}



function ValidateResetPasswordForm(){

	RemoveAllErrorMessage();
	
	var NewPassword = document.getElementById('NewPassword').value;
	var ConfirmNewPassword = document.getElementById('ConfirmNewPassword').value;

	var PasswordValidationMessage;
	var ConfirmPasswordMessage;
	
	PasswordValidationMessage = isValidResetPassword(NewPassword);
	if(PasswordValidationMessage != "valid"){
		ShowErrorMessage('NewPassword',PasswordValidationMessage);
		return false;
	}
	
	ConfirmPasswordMessage = isValidResetPassword(ConfirmNewPassword);
	if(ConfirmPasswordMessage != "valid"){
		ShowErrorMessage('ConfirmNewPassword',ConfirmPasswordMessage);
		return false;
	}

	if(NewPassword != ConfirmNewPassword){
		ShowErrorMessage('ConfirmNewPassword',"Пароли не совпадают");
		return false;
	}

	return true;
}

function RemoveAllErrorMessage(){

	var allErrorMessage = document.getElementsByClassName('error-message');
	var allErrorFiled = document.getElementsByClassName('error-input');
	var i;

	for(i=(allErrorMessage.length - 1); i>=0; i--){
		allErrorMessage[i].remove();
	}
	
	for(i=(allErrorFiled.length-1);i>=0;i--){
		allErrorFiled[i].classList.remove('error-input');
	}
}

function ShowErrorMessage(InputBoxID,Message){

	var InputBox = document.getElementById(InputBoxID);
	InputBox.classList.add('error-input');
	InputBox.focus();

	var ErrorMessageElement = document.createElement("p");
	ErrorMessageElement.innerHTML = Message;
	ErrorMessageElement.classList.add('error-message');
	ErrorMessageElement.setAttribute("id",InputBoxID+'-error');

	InputBox.parentNode.insertBefore(ErrorMessageElement, InputBox.nextSibling);
	
}

function isValidEmail(email){

	const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if(email == ""){
		return "Поле не должно оставаться пустым.";
	}

	if(emailRegex.test(email) == false){
		return "Неправильно введен email.";
	}

	return "valid";
}

function isValidPassword(pass){


	if(pass == ""){
		return "Поле не должно оставаться пустым.";
	}
	else {
	return "valid";
	}
}

function ValidateLoginForm(){

	RemoveAllErrorMessage();

	var forgotPassEmail = document.getElementById('LoginEmail').value;
	
	var	emailValidationMessage;
	emailValidationMessage = isValidEmail(forgotPassEmail);

	if(emailValidationMessage != "valid"){
		ShowErrorMessage('LoginEmail',emailValidationMessage);
		return false;
	}
	var Password = document.getElementById('LoginPassword').value;
	
	var	emailValidationMessage;
	PassValidationMessage = isValidPassword(Password);

	if(PassValidationMessage != "valid"){
		ShowErrorMessage('LoginPassword',PassValidationMessage);
		return false;
	}
}

function isValidResetPassword(password) {
	const minLength = 8;
	const maxLength = 32;
	const RegexSpecialChar = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
	if(password == ""){
		 return "Поле не должно оставаться пустым."
		 }
	
		 if (password.length < minLength || password.length > maxLength) {
			 return "Длина пароля должна быть не менее 8 символов.";
		 }
	
		 if (!RegexSpecialChar.test(password)) {
			 return "Пароль должен содержать латиницу, цифру и спецсимвол.";
		 }
		 return "valid";
	 }
