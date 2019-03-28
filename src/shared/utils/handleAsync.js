import { message } from 'antd';
export function catchErrors(func, ...args) {
  return function funcWrapper() {
    return func(...args).catch(e => {
      if(e.errors) {
        e.errors.forEach(err => {
          message.error(err.text)
        });
        return;
      }
      console.error(e);
    })
  }
}