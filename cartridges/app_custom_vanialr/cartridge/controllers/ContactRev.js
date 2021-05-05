'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var actionUrl = URLUtils.url('ContactRev-Subscribe').toString();
    var contactRevForm = server.forms.getForm('contactRev');
    contactRevForm.clear();
    res.render('/contactRev/contactRev', {
        actionURL: actionUrl,
        contactRevForm: contactRevForm
    });
    next();
});

server.post('Subscribe', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var contactRevForm = server.forms.getForm('contactRev'); 
    var transaction = require('dw/system/Transaction');
    var customObjMgr = require('dw/object/CustomObjectMgr');

    var formErrors = require('*/cartridge/scripts/formErrors');

    if (contactRevForm.valid) {
        transaction.wrap(function () {
            var newSubscribe = customObjMgr.createCustomObject('ContactRev', contactRevForm.contactInfoFields.email.value);
            newSubscribe.custom.phone = contactRevForm.contactInfoFields.phone.value;
            newSubscribe.custom.firstName = contactRevForm.addressFields.firstName.value;
            newSubscribe.custom.lastName = contactRevForm.addressFields.lastName.value;
            //newSubscribe.custom.contactCpf = contactRevForm.contactCpf.value; 
        });

        var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
        var Site = require('dw/system/Site');

        var newSubscribeObject = {
            email: contactRevForm.contactInfoFields.email.value,
            firstName: contactRevForm.addressFields.firstName.value,
            lastName: contactRevForm.addressFields.lastName.value,
        };

        var emailObj = {
            to: contactRevForm.contactInfoFields.email.value,
            subject: 'Seu cadastro foi efetuado, entraremos em contato.',
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
            type: emailHelpers.emailTypes.registration
        };

        emailHelpers.send(emailObj, 'contactRev/contactRevEmail', newSubscribeObject);

        res.render('/contactRev/contactRevsucess', { 
            contactRevForm: contactRevForm
        });

    } else {
        res.json({
            success: false,
            fields: formErrors.getFormErrors(contactRevForm)
        });
    }

    return next(); 
});

module.exports = server.exports();
