# Class Modifiers

**Title:**

- Enforce explicit visibility modifiers (`public`, `private`, `protected`) on all class members and constructors.

**ID:**

- TS-CLASS-MODIFIERS

**Scope:**

- `*.ts`

**Related:**

- TS-ARRAY-TYPING

**Rule:**

- ALWAYS write `public`, `private`, and `protected` modifiers explicitly for all class methods, properties, and constructors.
- NEVER rely on implicit `public` visibility for class members.

**Reason:**

- Because explicit modifiers significantly improve code readability and self-documentation by making the structural contract of the class obvious at a glance.
- Because it makes API visibility and architectural boundaries perfectly transparent during code reviews, making it easier to catch unintended public exposures.
- Because it prevents accidental visibility changes or regressions when refactoring internal class logic or changing constructor signatures.

**Exceptions:**

- DTOs (Data Transfer Objects) used by `class-transformer`.

**Enforcement:**

- MUST

**Category:**

- Style

## ❌ BAD

```typescript
class UserService {
	// Implicitly public field and constructor, which obfuscates internal architecture
	constructor(readonly userRepository: UserRepository) {}
	// Implicitly public method
	getUsers() {
		return this.userRepository.find();
	}
}
```

## ✅ GOOD

```typescript
class UserService {
	// Explicitly defines constructor visibility - not abstarct class and not a class that is meant to be extended.
	// Locks down dependency injection access.
	public constructor(private readonly userRepository: UserRepository) {}
	// Explicitly states intended public API surface area
	public getUsers() {
		return this.userRepository.find();
	}
	// Explicitly defines protected method visibility
	protected getUsersCount() {
		return this.userRepository.count();
	}
	// Explicitly defines private method visibility
	private deleteUser(id: number) {
		this.userRepository.delete(id);
	}
}
```
