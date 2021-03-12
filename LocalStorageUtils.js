const tempStore = {};

const getObjectFromLocalIfExist = item => localStorage.getItem(item) && JSON.parse(localStorage.getItem(item));
const ttlList = getObjectFromLocalIfExist('LocalStorageUtilsExpiryTime') || {};

const typify = {
  number: key => Number(localStorage.getItem(key)),
  boolean: key => localStorage.getItem(key) === 'true',
  undefined: () => undefined,
  object: key => JSON.parse(localStorage.getItem(key)),
};

const getValueInTempStore = key => {
  const itemValueTypeObject = getObjectFromLocalIfExist('LocalStorageUtilsValueTypes') || {};
  const valueType = itemValueTypeObject[key];
  tempStore[key] = (valueType && typify[valueType](key)) || localStorage.getItem(key);
  return tempStore[key].value;
};
//populateTempStore tries populate key value from actual localStorage in case its missing in tempStore, also checks if its expired
const populateTempStore = key => (localStorage.getItem(key) && (ttlList[key] ? !(ttlList[key] < Date.now()) : true) ? getValueInTempStore(key) : null);

const purgeExpiredLocalStorage = () => {
  const currentTime = Date.now();
  Object.keys(ttlList).forEach(key => {
    if (ttlList[key] < currentTime) {
      delete ttlList[key];
      tempStore[key] = null;
    }
  });
};
//will be called asynchonrously on 'beforeunload' to store tempStore to actual LocalStorage
const populateLocalStorage = () => {
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
    localStorage.setItem(key, typeOfValue === 'object' ? JSON.stringify(value) : value);
  });
  purgeExpiredLocalStorage();
  //metadata stored in LocalStorage i.e. ExpiryTime, ValueTypes(number|boolean|undefined|object -string is default hence need not stored, null is emptiness)
  localStorage.setItem('LocalStorageUtilsExpiryTime', JSON.stringify(ttlList));
  localStorage.setItem('LocalStorageUtilsValueTypes', JSON.stringify(itemValueTypeObject));
};
window.addEventListener('beforeunload', populateLocalStorage);

const LocalStorageUtils = {
  getItem: key => (window.localStorage && key in tempStore ? tempStore[key] : populateTempStore(key)),
  //expirationTime, expirationDate(format YYYY-MM-DD) are optional. expirationTime preferred. expirationTime format {days, hours} like {days: 2} or {hours: 48} or {days: 5, hours: 23}
  setItem: (key, value, expirationTime = {}, expirationDate) => {
    if (window.localStorage) {
      tempStore[key] = value;
      if (expirationTime.days || expirationTime.hours) {
        const { days = 0, hours = 0 } = expirationTime;
        ttlList[key] = Date.now() + (days * 24 + hours) * 3600000;
        return;
      }
      if (expirationDate) {
        const expiryDateObject = new Date(expirationDate);
        ttlList[key] = expiryDateObject.getTime();
      }
    }
  },
};

export default LocalStorageUtils;
