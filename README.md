# @normalized-db/normalizer

Normalize `JavaScript` objects based on a simple schema (implemented with `TypeScript`).

 - **Author**: Sandro Schmid ([saseb.schmid@gmail.com](<mailto:saseb.schmid@gmail.com>))
 - **Version**: 2.5.0-beta.1

## Notes

 - This library is under active development.
 - To ease versioning equal major and minor version numbers are used for all modules.

## Installation

Install using NPM:

    npm install --save @normalized-db/normalizer

## Usage

Use the `NormalizerBuilder` to create a `Normalizer`. Use either `schema(…)` or `schemaConfig(…)` to apply a 
schema configuration. This is the only required parameter. 

Due to references between objects the normalizer needs them 
to have keys, this is why you should define a `UniqueKeyCallback` which generates such keys. Note that these will also 
be used for persisting the normalized data by `@normalized-db/data-store`.

Using reverse references will generate a `_refs`-field on objects. E.g. normalizing an object like 

```typescript
const schema: ISchemaConfig = {
  _defaults: { key: 'id' },
  parentType: {
    targets: {
      foo: 'childType'
    }
  },
  childType: true
}

const parent: ParentType = { 
  id: 'parent',
  foo: { 
    id: 'child', 
    bar: 123
  }
}
```
 
would result in

```typescript
const normalizedChild: ChildType = { 
  id: 'child', 
  bar: 123, 
  _refs: { 
    parentType: Set<string>(['parent'])
  }
}
```

## Examples

A more detailed example for a `ISchemaConfig` and normalization input/output can be found in the 
[core-module's README](https://github.com/normalized-db/core/blob/master/README.md).

See the [examples-project](https://github.com/normalized-db/examples) for detailed examples:

 - [Angular4-App](https://github.com/normalized-db/examples/tree/master/angular-demo)
