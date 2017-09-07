import { deepClone, ISchemaConfig } from '@normalized-db/core';
import { assert } from 'chai';
import { INormalizer, NormalizerBuilder } from '../lib/index';
import * as Blog from './data/blog-post';
import * as User from './data/user';

describe('Normalizer', function () {

  let schemaConfig: ISchemaConfig;
  let normalizer: INormalizer;
  let data;
  let normalizedData;

  function test(rootEntity: string) {
    const result = normalizer.apply(data, rootEntity);
    assert.deepEqual(result, normalizedData);
  }

  afterEach(function () {
    schemaConfig = null;
    normalizer = null;
    data = null;
    normalizedData = null;
  });

  describe('Invalid types', function () {

    beforeEach(function () {
      schemaConfig = User.SCHEMA;
      normalizer = new NormalizerBuilder()
        .withSchemaConfig(schemaConfig)
        .build;
    });

    it('Apply', function () {
      assert.doesNotThrow(() => normalizer.apply({}, 'user'), 'Type \'user\' is not defined');
      assert.throws(() => normalizer.apply({}, 'invalid'), 'Type \'invalid\' is not defined');
    });

  });

  describe('Users', function () {

    beforeEach(function () {
      schemaConfig = User.SCHEMA;
      normalizer = new NormalizerBuilder()
        .withSchemaConfig(schemaConfig)
        .build;
      data = deepClone(User.DATA);
      normalizedData = deepClone(User.DATA_NORMALIZED);
    });

    it('Single Item', function () {
      data = deepClone(User.USER1);
      normalizedData.role = [User.USER1.role];
      normalizedData.user = [User.normalize(User.USER1)];
      test('user');
    });

    it('Collection', function () {
      test('user');
    });

    it('Reverse references', function () {
      normalizer = new NormalizerBuilder()
        .withSchemaConfig(schemaConfig)
        .withReverseReferences(true)
        .build;
      normalizedData = deepClone(User.DATA_NORMALIZED_RR);
      test('user');
    });

    describe('Normalized Data', function () {

      it('Single Item', function () {
        data = normalizedData.user[0];
        normalizedData = { user: [normalizedData.user[0]] };
        test('user');
      });

      it('Collection', function () {
        data = normalizedData.user;
        normalizedData = { user: normalizedData.user };
        test('user');
      });

      it('Partly normalized', function () {
        data = [
          data[0],
          normalizedData.user[1],
          data[2]
        ];
        test('user');
      });

    });
  });

  describe('Blog Posts', function () {

    beforeEach(function () {
      schemaConfig = Blog.SCHEMA;
      normalizer = new NormalizerBuilder()
        .withSchemaConfig(schemaConfig)
        .build;
    });

    it('Single item', function () {
      data = Blog.POST1;
      normalizedData = {
        article: [Blog.normalizePost(Blog.POST1)],
        comment: Blog.normalizeAllComments(Blog.POST1.comments),
        user: Blog.normalizeAllUsers([Blog.USER_MMUSTER, Blog.USER_TIMLER42, Blog.USER_ALEXK]),
        role: [Blog.ROLE2, Blog.ROLE1]
      };

      test('article');
    });

    it('Collection', function () {
      data = Blog.DATA;
      normalizedData = Blog.DATA_NORMALIZED;
      test('article');
    });

    it('Reverse references', function () {
      normalizer = new NormalizerBuilder()
        .withSchemaConfig(schemaConfig)
        .withReverseReferences(true)
        .build;
      data = Blog.DATA;
      normalizedData = deepClone(Blog.DATA_NORMALIZED_RR);
      test('article');
    });

    describe('Invalid data', function () {

      function testError(error) {
        assert.throws(() => normalizer.apply(data, 'article'), error);
      }

      it('Expected array', function () {
        data = deepClone(Blog.POST1);
        data.comments = data.comments[0];
        testError('\'article\' is expected to have an array of \'comment\' but got object');
      });

      it('Expected object', function () {
        data = deepClone(Blog.POST1);
        data.author = [data.author];
        testError('\'article\' is expected to have an object of \'user\' but got array');
      });

    });

  });

});
