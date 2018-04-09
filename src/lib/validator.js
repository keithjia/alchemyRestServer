const validator = {
    validateRegisterInputs : function(userPass){
        let validationResult = {
            isValid: true,
            errorMessage: ""
        };

        if (!userPass || !userPass.username || !userPass.password) {
            validationResult.isValid = false;
            validationResult.errorMessage = "Missing username/password";
            return validationResult;
        }

        const username = userPass.username;
        const pass = userPass.password;

        if (username.length < 3 || username.length > 20){
            validationResult.isValid = false;
            validationResult.errorMessage = "username needs to be bet 3-20";
            return validationResult;
        }

        const usernameReg = /^[a-z0-9]+$/i;

        if (username.match(usernameReg) === null) {
            validationResult.isValid = false;
            validationResult.errorMessage = "username must be alphanumeric";
            return validationResult;
        }

        if (pass.length < 8) {
            validationResult.isValid = false;
            validationResult.errorMessage = "password must be at least 8 characters";
            return validationResult;
        }

        return validationResult;

    },

    validateFileInputs : function(filename, fileContentJson) {
        let validationResult = {
            isValid: true,
            errorMessage: ""
        };

        // simplify filename to alhpanum
        const filenameRegex = /^[a-z0-9]+$/i;

        if (filename.match(filenameRegex) === null) {
            validationResult.isValid = false;
            validationResult.errorMessage = "alpha must be alphanumeric";
            return validationResult;
        }


        return validationResult;
    }
};

module.exports = validator;