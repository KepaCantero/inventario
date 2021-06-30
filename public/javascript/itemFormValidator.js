/* eslint-disable */
$(document).ready(function () {
  $('.ui.form').form({
    fields: {
      name: {
        identifier: 'name',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter an item name',
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
      category: {
        identifier: 'category',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select a category',
          },
        ],
      },
      price: {
        identifier: 'price',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter an item price',
          },
          {
            type: 'number',
            prompt: 'Price must be a number',
          },
          {
            type: 'regExp',
            value: /^(0(?!\.00)|[1-9]\d{0,6})\.\d{2}$/,
            prompt: 'Price must include 2 decimal places',
          },
        ],
      },
      numberInStock: {
        identifier: 'numberInStock',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter the number in stock',
          },
          {
            type: 'integer',
            prompt: 'Number in stock must be an integer',
          },
        ],
      },
    },
  });
});
