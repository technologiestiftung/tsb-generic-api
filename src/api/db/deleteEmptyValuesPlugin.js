function unsetFields(obj) {
  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        unsetFields(obj[key]);
      }

      if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
        if (!obj.$unset) obj.$unset = {};
        obj.$unset[key] = 1;
        delete obj[key];
      }
    });
  }
}

function deleteEmptyValues() {
  if (this._update) {
    unsetFields(this._update);
  }
}

const deleteEmptyValuesPlugin = (schema) => {
  schema.pre('update', deleteEmptyValues);
  schema.pre('findOneAndUpdate', deleteEmptyValues);
};

module.exports = deleteEmptyValuesPlugin;
