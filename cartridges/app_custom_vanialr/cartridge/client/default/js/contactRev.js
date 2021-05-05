/*'use strict';

var formValidation = require('base/components/formValidation');

$(document).ready(function () {
    $('form.contactRev-form').submit(function (e) {
        var $form = $(this);
        e.preventDefault();
        var url = $form.attr('action');
        $form.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                $form.spinner().stop();
                if (!data.success) {
                    formValidation($form, data);
                } else {
                   alert(data.successMsg);
                }
            },
            error: function (err) {
                alert(err);
                $form.spinner().stop();
            }
        });
        return false;
    });
});
*/