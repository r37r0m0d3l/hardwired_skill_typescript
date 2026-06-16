# readonly where possible

**Title:**

- Prefer immutable data structures using `readonly` fields, `ReadonlyArray<T>`, and `as const` to prevent unintended mutations.

**ID:**

- TS-READONLY-WHERE-POSSIBLE

**Scope:**

- `*.ts`

**Related:**

- TS-ARRAY-TYPING
- TS-ENUM-ALTERNATIVE

**Rule:**

- ALWAYS mark class properties, index signatures, and interface definitions as `readonly` unless they explicitly require mutation.
- ALWAYS use `ReadonlyArray<T>` instead of mutable array types for collections that should not be modified after creation.
- ALWAYS apply `as const` to literal configurations or fixed arrays to freeze their types and values at compile time.

**Reason:**

- Because immutability eliminates an entire class of bugs related to accidental side effects, variable leaks, and unpredictable state mutations across execution scopes.
- Because it allows the TypeScript compiler to catch write operations and reassignment mistakes early at compile time rather than tracking down unexpected behavior at runtime.
- Because clear immutability constraints serve as a self-documenting contract, making it immediately transparent to other developers which parts of the system are safe to read without side effects.

**Exceptions:**

- Properties and objects that manage dynamic, state-changing runtime counters, caches, or reactive framework bindings requiring frequent reassignment.

**Enforcement:**

- SHOULD

**Category:**

- Reliability

## ❌ BAD

```typescript
// Properties and arrays are completely mutable, introducing risks of accidental modifications
interface Config {
	environment: string;
	endpoints: string[]; // Mutable array
}

class ConfigurationService {
	public config: Config; // Mutable property

	public constructor(config: Config) {
		this.config = config;
	}

	public updateEndpoints() {
		this.config.endpoints.push("/dangerous-mutation"); // Mutates shared state implicitly
	}
}
```

## ✅ GOOD

```typescript
// Enforces a strict read-only design pattern across interfaces and collections
interface Config {
	readonly environment: string;
	readonly endpoints: ReadonlyArray<string>; // Immutable array
}

class ConfigurationService {
	// Read-only reference safely protects internal state from outside reassignments
	public readonly config: Config;

	public constructor(config: Config) {
		this.config = config;
	}

	public logEndpoints() {
		// Operations that mutate the array will throw compile-time errors here
		// this.config.endpoints.push("/this-fails-to-compile");
	}
}

// Using as const to declare an immutable literal configuration
const APP_MODES = ["development", "production"] as const; // Frozen as readonly tuple
```
