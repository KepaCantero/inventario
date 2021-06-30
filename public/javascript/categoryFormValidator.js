/* eslint-disable */
$(document).ready(function () {
  $('.ui.form').form({
    fields: {
      name: {
        identifier: 'name',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a category name',
          },
        ],
      },
      description: {
        identifier: 'description',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter a description',
          },
        ],
      },
    },
  });
});
