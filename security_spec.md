# Firebase Security Specification

## Data Invariants
- A project must have a valid `id`.
- A project must be owned by the user who created it (`userId`).
- `calculationMode` must be one of the specified types.
- Numerical values like `length`, `width`, `safetyFactor` must be positive.
- `userId` is immutable after creation.
- `createdAt` is immutable after creation.
- `updatedAt` must be set to the server time on every update.

## The Dirty Dozen Payloads
1. **Unauthorized Create**: Attempt to create a project with a different `userId`.
2. **Unauthorized Read**: Attempt to read a project owned by another user.
3. **Unauthorized Update**: Attempt to update a project owned by another user.
4. **Unauthorized Delete**: Attempt to delete a project owned by another user.
5. **Identity Spoofing**: Attempt to change `userId` on an existing project.
6. **Immutability Breach**: Attempt to change `createdAt`.
7. **Invalid Type**: Attempt to set `length` to a string.
8. **Invalid Enum**: Attempt to set `calculationMode` to "malicious-mode".
9. **Negative Value**: Attempt to set `safetyFactor` to -1.0.
10. **Resource Poisoning**: Attempt to use an extremely long string for `title`.
11. **Shadow Update**: Attempt to add an undocumented field `isAdmin: true`.
12. **System Field Injection**: Attempt to manually set `updatedAt` to a past date.

## Test Runner Logic
The following rules will ensure that all above payloads result in `PERMISSION_DENIED`.
