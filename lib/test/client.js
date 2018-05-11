'use strict';

var assert = require('assert');

module.exports = function (app, name) {
  var getService = function getService() {
    return name && typeof app.service === 'function' ? app.service(name) : app;
  };

  describe('Service base tests', function () {
    it('.find', function () {
      return getService().find().then(function (todos) {
        return assert.deepEqual(todos, [{
          text: 'some todo',
          complete: false,
          id: 0
        }]);
      });
    });

    it('.get and params passing', function () {
      var query = {
        some: 'thing',
        other: ['one', 'two'],
        nested: { a: { b: 'object' } }
      };

      return getService().get(0, { query: query }).then(function (todo) {
        return assert.deepEqual(todo, {
          id: 0,
          text: 'some todo',
          complete: false,
          query: query
        });
      });
    });

    it('.create and created event', function (done) {
      getService().once('created', function (data) {
        assert.equal(data.text, 'created todo');
        assert.ok(data.complete);
        done();
      });

      getService().create({ text: 'created todo', complete: true });
    });

    it('.update and updated event', function (done) {
      getService().once('updated', function (data) {
        assert.equal(data.text, 'updated todo');
        assert.ok(data.complete);
        done();
      });

      getService().create({ text: 'todo to update', complete: false }).then(function (todo) {
        return getService().update(todo.id, {
          text: 'updated todo',
          complete: true
        });
      });
    });

    it('.patch and patched event', function (done) {
      getService().once('patched', function (data) {
        assert.equal(data.text, 'todo to patch');
        assert.ok(data.complete);
        done();
      });

      getService().create({ text: 'todo to patch', complete: false }).then(function (todo) {
        return getService().patch(todo.id, { complete: true });
      });
    });

    it('.remove and removed event', function (done) {
      getService().once('removed', function (data) {
        assert.equal(data.text, 'todo to remove');
        assert.equal(data.complete, false);
        done();
      });

      getService().create({ text: 'todo to remove', complete: false }).then(function (todo) {
        return getService().remove(todo.id);
      }).catch(done);
    });

    it('.get with error', function () {
      var query = { error: true };

      return getService().get(0, { query: query }).catch(function (error) {
        return assert.ok(error && error.message);
      });
    });
  });
};