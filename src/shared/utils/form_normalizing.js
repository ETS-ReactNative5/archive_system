export const four_digits = value => {
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^\d]/g, '');

  return (onlyNums).slice(0, 4);
};

export const digits = numb => value => {
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^\d]/g, '');

  return (onlyNums).slice(0, numb);
};

export const normalizePhone  = value => {
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/^(\+7)/, '').replace(/[^\d]/g, '');
  if(onlyNums.length === 0) {
    return ''
  }

  if (onlyNums.length <= 3) {
    return `+7 (${onlyNums}`
  }
  if (onlyNums.length <= 6) {
    return `+7 (${onlyNums.slice(0, 3)})-${onlyNums.slice(3)}`
  }
  return `+7 (${onlyNums.slice(0, 3)})-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`
}