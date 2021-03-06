'use strict';

var assert = require('assert');

var findAllData = [{
  id: 0,
  description: 'You have to do something'
}, {
  id: 1,
  description: 'You have to do laundry'
}];

exports.Service = {
  events: ['log'],

  find: function find() {
    return Promise.resolve(findAllData);
  },
  get: function get(name, params) {
    if (params.query.error) {
      return Promise.reject(new Error('Something for ' + name + ' went wrong'));
    }

    if (params.query.runtimeError) {
      thingThatDoesNotExist(); // eslint-disable-line
    }

    return Promise.resolve({
      id: name,
      description: 'You have to do ' + name + '!'
    });
  },
  create: function create(data) {
    var result = Object.assign({}, data, {
      id: 42,
      status: 'created'
    });

    if (Array.isArray(data)) {
      result.many = true;
    }

    return Promise.resolve(result);
  },
  update: function update(id, data) {
    var result = Object.assign({}, data, {
      id: id, status: 'updated'
    });

    if (id === null) {
      result.many = true;
    }

    return Promise.resolve(result);
  },
  patch: function patch(id, data) {
    var result = Object.assign({}, data, {
      id: id, status: 'patched'
    });

    if (id === null) {
      result.many = true;
    }

    return Promise.resolve(result);
  },
  remove: function remove(id) {
    return Promise.resolve({ id: id });
  }
};

exports.verify = {
  find: function find(data) {
    assert.deepEqual(findAllData, data, 'Data as expected');
  },
  get: function get(id, data) {
    assert.equal(data.id, id, 'Got id in data');
    assert.equal(data.description, 'You have to do ' + id + '!', 'Got description');
  },
  create: function create(original, current) {
    var expected = Object.assign({}, original, {
      id: 42,
      status: 'created'
    });
    assert.deepEqual(expected, current, 'Data ran through .create as expected');
  },
  update: function update(id, original, current) {
    var expected = Object.assign({}, original, {
      id: id,
      status: 'updated'
    });
    assert.deepEqual(expected, current, 'Data ran through .update as expected');
  },
  patch: function patch(id, original, current) {
    var expected = Object.assign({}, original, {
      id: id,
      status: 'patched'
    });
    assert.deepEqual(expected, current, 'Data ran through .patch as expected');
  },
  remove: function remove(id, data) {
    assert.deepEqual({ id: id }, data, '.remove called');
  }
};