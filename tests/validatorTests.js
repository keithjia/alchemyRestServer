const validator = require("../src/lib/validator");

module.exports = {
    setUp: function (callback) {
        //this.foo = 'bar';
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },

    registerUserValidation: function (test) {
        let user = {
            username:"keith8342",
            password:"10293423934"
        };

        const res1 = validator.validateRegisterInputs(user);
        test.strictEqual(res1.isValid, true);

        user.username = "12";
        const res2 = validator.validateRegisterInputs(user);
        test.strictEqual(res2.isValid, false);

        user.username = "123456789012345678901";
        const res3 = validator.validateRegisterInputs(user);
        test.strictEqual(res3.isValid, false);

        user.username = "keith{*";
        const res4 = validator.validateRegisterInputs(user);
        test.strictEqual(res4.isValid, false);

        user.password = "1234567";
        const res5 = validator.validateRegisterInputs(user);
        test.strictEqual(res5.isValid, false);

        test.done();
    }
};