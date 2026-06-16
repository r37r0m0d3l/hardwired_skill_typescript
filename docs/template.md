# {Template Name}

**Title:**

- {Template Name} longer and more descriptive.

**ID:**

- ANGULAR-TEMPLATE-ID
- EXPRESS-TEMPLATE-ID
- FASTIFY-TEMPLATE-ID
- JEST-TEMPLATE-ID
- MIKROORM-TEMPLATE-ID
- NESTJS-TEMPLATE-ID
- REACT-TEMPLATE-ID
- SQL-TEMPLATE-ID
- TS-TEMPLATE-ID
- TSX-TEMPLATE-ID
- TYPEORM-TEMPLATE-ID
- UNIVERSAL-TEMPLATE-ID
- VITE-TEMPLATE-ID
- VUE-TEMPLATE-ID

[//]: # (One item in the list!!! Uppercase and dashes. Prefix should be human-readable: TS, NESTJS, etc.)

**Scope:**

- `*.ts`

[//]: # (File scope is mandatory!!! It saves tokens and speeds up process overall.)

**Related:**

- TS-OTHER_EXAMPLE_TEMPLATE_ID_1
- TS-OTHER_EXAMPLE_TEMPLATE_ID_2

[//]: # (While using `Related` make sure that section is not creating circular references!!! Attention mechanism.)

**Rule:**

- ALWAYS {do thing 1}.
- ALWAYS {do thing 2}.

[//]: # (Try to limit the number of rules to five at most. Hallucinations may occur if there are too many.)

**Reason:**

- Because {insert reason number 1 here}.
- Because {insert another reason number 2 here}.

**Exceptions:**

- None.
- Framework-required interfaces.
- Already exists in code.

[//]: # (Either `None` or other list items should be used.)

**Enforcement:**

- MUST
- SHOULD
- MAY

[//]: # (Only one of the above should be used.)

**Category:**

- API                  [//]: # (Endpoints, routing, serialization, and contract design)
- Architecture         [//]: # (Project structure, DI, and module boundaries)
- Data Access          [//]: # (Database queries, ORM mapping, transactions, and caching)
- Developer Experience [//]: # (Tooling, logging, linting, and local setup efficiency)
- Documentation        [//]: # (JSDoc, READMEs, inline comments, and public API docs)
- Extensibility        [//]: # (Plugins, hooks, inheritance, and modular scaling)
- Internationalization [//]: # (Localization, translations, date/number formatting, and i18n)
- Maintainability      [//]: # (Code readability, cyclomatic complexity, and refactoring ease)
- Performance          [//]: # (Memory management, query optimization, and speed)
- Reliability          [//]: # (Error handling, type safety, and edge cases)
- Security             [//]: # (Data protection and vulnerability prevention)
- Style                [//]: # (Naming, formatting, and visual structure)
- Testing              [//]: # (Test structure, mocks, and coverage rules)

[//]: # (Only one of the above should be used.)

## ❌ BAD

```typescript
// Description why code below violates this rule.
const badExample = () => {
};
```

## ✅ GOOD

```typescript
// Description why code below follows this rule.
const goodExample = () => undefined;
```

[//]: # (WHEN USING THIS TEMPLATE PLEASE REMOVE ALL MARKDOWN COMMENTS AS THEY SHOULD NOT BE IN GENERATED FILES.)
