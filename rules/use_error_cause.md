# Use Error Cause

**Title:**

- Use the `cause` property when rethrowing errors to preserve original exception stack traces and context.

**ID:**

- TS-USE-ERROR-CAUSE

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS intercept caught exceptions using standard `try/catch` wrappers when chaining errors across layer boundaries.
- ALWAYS use the `cause` property within the option parameter object when rethrowing a wrapped `Error`.
- ALWAYS verify that original errors are passed downstream instead of dropping contextual properties or creating plain
  text messages without metadata attachments.

**Reason:**

- Because modern runtimes preserve the complete structural hierarchy and original stack traces across asynchronous layer
  steps when nested errors use the `cause` property, making diagnostic analysis significantly more efficient.
- Because stripping the contextual origins of failure points results in clean, abstract top-level error logs but
  isolates developers from determining the definitive physical source of low-level infrastructure crashes.

**Exceptions:**

- External runtime configurations targeting legacy environments lacking explicit ES2022+ polyfill configurations.

**Enforcement:**

- MAY

**Category:**

- Reliability

## ❌ BAD

### Simple Example

```typescript
/**
 * @name getUserById
 * @param {string} id
 * @returns {Promise<UserEntity | null>}
 * @throws {Error}
 */
async function getUserById(id: string): Promise<UserEntity | null> {
	try {
		return await getOneRecordFromDatabase({ id });
	} catch (errorFromDatabase: unknown) {
		// Violates the rule by losing the stack trace and structural context of the database error
		throw new Error(`Failed to get user by ID: [${id}]`);
	}
}
```

### Complex Example

```typescript
/**
 * @name getUserById
 * @param {string} id
 * @param {number} [timeoutMs=5_000]
 * @returns {Promise<UserEntity | null>}
 * @throws {Error}
 */
async function getUserById(id: string, timeoutMs: number = 5_000): Promise<UserEntity | null> {
	const timeoutPromise = new Promise<never>((__, reject) => {
		setTimeout(() => {
			const timeoutError = new Error(`Database operation timed out after [${timeoutMs}]ms`);
			timeoutError.name = "TimeoutError";
			reject(timeoutError);
		}, timeoutMs);
	});
	try {
		return await Promise.race([getOneRecordFromDatabase({ id }), timeoutPromise]);
	} catch (error: unknown) {
		// Violates the rule by dropping context or creating custom descriptions without embedding the original error
		throw new Error(`Failed to get user by ID: [${id}] due to an operational issue`);
	}
}
```

## ✅ GOOD

### Simple Example

```typescript
/**
 * @name getUserById
 * @param {string} id
 * @returns {Promise<UserEntity | null>}
 * @throws {Error}
 */
async function getUserById(id: string): Promise<UserEntity | null> {
	try {
		return await getOneRecordFromDatabase({ id });
	} catch (errorFromDatabase: unknown) {
		// Follows the rule by passing the original exception inside the cause property
		throw new Error(`Failed to get user by ID: [${id}]`, { cause: errorFromDatabase });
	}
}
```

### Complex Example

```typescript
/**
 * @name getUserById
 * @param {string} id
 * @param {number} [timeoutMs=5_000]
 * @returns {Promise<UserEntity | null>}
 * @throws {Error}
 */
async function getUserById(id: string, timeoutMs: number = 5_000): Promise<UserEntity | null> {
	const timeoutPromise = new Promise<never>((__, reject) => {
		setTimeout(() => {
			const timeoutError = new Error(`Database operation timed out after [${timeoutMs}]ms`);
			timeoutError.name = "TimeoutError";
			reject(timeoutError);
		}, timeoutMs);
	});
	try {
		// Promise.race settles immediately on the first fulfillment OR rejection
		return await Promise.race([getOneRecordFromDatabase({ id }), timeoutPromise]);
	} catch (error: unknown) {
		// Handle standard Error (including timeout)
		if (error instanceof Error) {
			// Cause will have `TimeoutError` if it was a timeout
			throw new Error(`Failed to get user by ID: [${id}]`, { cause: error });
		}
		// Handle non-error throws (primitives)
		throw new Error(`Failed to get user by ID: [${id}]`, { cause: String(error) });
	}
}
```
