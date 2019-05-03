import { some } from 'lodash';

const requiredMsg = {
  kz: "Бос болмауы керек",
  ru: "Поле не может быть пустым",
  en: "Field must not be empty"
};

const requiredEmailMsg = {
  kz: "Дұрыс email еңгізіңіз",
  ru: "Неверный email",
  en: "Invalid email"
};

export const required = value =>(value && value.trim() ? undefined : requiredMsg[localStorage.getItem('i18nextLng')]);

export const requiredEmail = value => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : requiredEmailMsg[localStorage.getItem('i18nextLng')];

export const requiredLabel = valueObj => (valueObj && valueObj.label && valueObj.label.trim() ? undefined : requiredMsg[localStorage.getItem('i18nextLng')]);

export const requiredArr = valueArr => (valueArr && valueArr.length !== 0 ? undefined : requiredMsg[localStorage.getItem('i18nextLng')]);
// export const requiredDate = value => (value && value._d ? undefined : requiredMsg[localStorage.getItem('i18nextLng')]);

export const requiredDate = value => {
    if(value){
      if (value.value ){
        return undefined
      }else {
        return  requiredMsg[localStorage.getItem('i18nextLng')]
      }
    }
  return (value && value._d ? undefined : requiredMsg[localStorage.getItem('i18nextLng')])
};

export const requiredLng = valueObj => (valueObj && some(valueObj, value => !!value) ? undefined : requiredMsg[localStorage.getItem('i18nextLng')]);

export const isNumberic = value => (value && !/^[0-9]*$/.test(value) ? 'Must be a number' : undefined);

export const maxDigits = max => value =>
  (value && value.length > max ? `Must be ${max} digits` : undefined);

export const minDigitsNumber = min => value =>
  (value && (!value.match(/\d/ig) || value.match(/\d/ig).length < min) ? `Must be ${min} digits` : undefined);

export const maxCharacters = max => value =>
  (value && value.length > max ? `Password should be at most ${max} characters` : undefined);

export const minCharacters = min => value =>
  (value && value.length < min ? `Password should be at least ${min} characters` : undefined);

export const password = value =>
  required(value) || minCharacters(6)(value) || minDigitsNumber(1)(value);

export const isEmail = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    'Invalid email address' : undefined);

export const equalsTo = field => (value, allValues) => {
  console.log(value, allValues, value && value !== allValues[field]);
  return value && value !== allValues[field] ? 'Passwords do not match' : undefined;
};

export const isTrue = value => (value ? undefined : 'Field must not be false');
