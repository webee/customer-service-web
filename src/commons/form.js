
export const FormFieldDecorator = ({form, name, children, ...options}) => {
  return form.getFieldDecorator(name, options)(children);
};


export const asValidator = (func) => {
  return (rule, value, callback) => {
    try {
      func(value, rule);
      callback();
    } catch(e) {
      callback(e.message);
    }
  };
};
