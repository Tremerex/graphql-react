export const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        if (Array.isArray(target[key]) && Array.isArray(source[key]))
          Object.assign(target, { [key]: [...target[key], ...source[key]] });
        else
          Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

const lexer = st => st.split && st.split('.') || [];

const visitor = (obj, list) => {
  	let i = 0, length = list.length;
  	while(obj != null && i < length) {
		   obj = obj[list[i++]];
  	}
  	return (i && i === length) ? obj : null;
}

export const get = (obj, path, defaultValue) => visitor(obj, lexer(path)) || defaultValue;
