# Explicit Return Type Annotations

**Title:**

- Enforce Explicit Return Type Annotations on Public Functions and API Handlers

**ID:**

- TS-EXPLICIT-RETURN-TYPES

**Scope:**

- `*.ts`

**Related:**

- TS-EXPLICIT-NAMING-AND-TYPING

**Rule:**

- ALWAYS provide explicit return type annotations for all exported functions, public class methods, and API route handlers.
- ALWAYS declare the return type explicitly even if the function implicitly returns `void` or `undefined`.

**Reason:**

- Because explicit return types prevent accidental type leakage where internal implementation modifications unintendedly alter the public-facing contract.
- Because surface-level return annotations allow the compiler to skip deep structural inference of function bodies, drastically optimizing build speeds in large-scale repositories.

**Exceptions:**

- Inline arrow functions used exclusively as arguments to array methods (e.g., `.map()`, `.filter()`).

**Enforcement:**

- MUST

**Category:**

- Performance

## ❌ BAD

```typescript
// Omitting the return type forces the compiler to infer it, which can leak internal details or slow down static analysis.
export const fetchUserData = (userId: string) => {
	return prisma.user.findUnique({where: {id: userId}});
};

export function handleRequest(req: Request, res: Response) {
	res.status(200).send("OK");
}
```

## ✅ GOOD

```typescript
// Explicitly stating the return types locks down contracts and speeds up the compiler's type evaluation.
export const fetchUserData = (userId: string): Promise<User | null> => {
	return prisma.user.findUnique({where: {id: userId}});
};

export function handleRequest(req: Request, res: Response): void {
	res.status(200).send("OK");
}
```
