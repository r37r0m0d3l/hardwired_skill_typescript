# Use region comments

**Title:**

- Use region comments (`//#region` and `//#endregion`) to fold and organize large logical blocks of code for improved navigation and maintainability.

**ID:**

- TS-USE-REGION

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS wrap large, logically grouped sections of code within `//#region Description` and `//#endregion Description` markers.
- ALWAYS include a descriptive, matching name after both the `//#region` and `//#endregion` markers to clarify the scope of the code block.
- NEVER leave `//#region` directives unclosed or without a descriptive label.

**Reason:**

- Because region comments allow modern IDEs to collapse extensive code blocks, reducing visual clutter and improving file navigation.
- Because clear region boundaries logically segment distinct concerns within larger files without requiring immediate refactoring into separate files.

**Exceptions:**

- Small files or short functions where all code is easily visible on a single screen without scrolling.

**Enforcement:**

- SHOULD

**Category:**

- Maintainability

## ❌ BAD

```typescript
// Unstructured large block of code with no visual organization or folding boundaries
export class UserManagementService {
	async getUser(id: string) {
		// ... code here ...
	}

	async updateUser(id: string, data: Record<string, unknown>) {
		// ... code here ...
	}

	validateUser(data: Record<string, unknown>) {
		// ... code here ...
	}

	formatUserData(data: Record<string, unknown>) {
		// ... code here ...
	}
}
```

## ✅ GOOD

```typescript
// Groups related methods into collapsible regions with descriptive tags
export class UserManagementService {
	//#region Database Operations

	async getUser(id: string) {
		// ... code here ...
	}

	async updateUser(id: string, data: Record<string, unknown>) {
		// ... code here ...
	}

	//#endregion Database Operations

	//#region Data Helpers

	validateUser(data: Record<string, unknown>) {
		// ... code here ...
	}

	formatUserData(data: Record<string, unknown>) {
		// ... code here ...
	}

	//#endregion Data Helpers
}
```
