const tempStore = {};

const getObjectFromSessionIfExist = item => sessionStorage.getItem(item) && JSON.parse(sessionStorage.getItem(item));

const typify = {
  number: key => Number(sessionStorage.getItem(key)),
  boolean: key => sessionStorage.getItem(key) === 'true',
  undefined: () => undefined,
  object: key => JSON.parse(sessionStorage.getItem(key)),
};

const getValueInTempStore = key => {
  const itemValueTypeObject = getObjectFromSessionIfExist('SessionStorageUtilsValueTypes') || {};
  const valueType = itemValueTypeObject[key];
  tempStore[key] = (valueType && typify[valueType](key)) || sessionStorage.getItem(key);
  return tempStore[key].value;
};
const populateTempStore = key => (sessionStorage.getItem(key) ? getValueInTempStore(key) : null);

const populateSessionStorage = () => {
  const itemValueTypeObject = {};
  Object.keys(tempStore).forEach(key => {
    const value = tempStore[key];
    if (value === null) {
      return;
    }
    const typeOfValue = typeof value;
    if (typeOfValue !== 'string') {
      itemValueTypeObject[key] = typeOfValue;
    }
    sessionStorage.setItem(key, typeOfValue === 'object' ? JSON.stringify(value) : value);
  });
  sessionStorage.setItem('SessionStorageUtilsValueTypes', JSON.stringify(itemValueTypeObject));
};
window.addEventListener('beforeunload', populateSessionStorage);

const SessionStorageUtils = {
  getItem: key => (window.sessionStorage && key in tempStore ? tempStore[key] : populateTempStore(key)),
  setItem: (key, value) => {
    if (window.sessionStorage) {
      tempStore[key] = value;
    }
  },
};

export default SessionStorageUtils;
