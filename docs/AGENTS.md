# AGENTS.md

# Development Agent Specifications

This document outlines the architectural boundaries, structural standards, and operational guidelines for all AI agents and engineers developing the StudyCircle platform.

---

## 1. Directory Structure Standards

### 1.1 Backend Layer (Node.js + Express.js + TypeScript)
All API and business logic must follow a strict **Layered Modular Architecture** grouped by domain features rather than horizontal layers.

```
backend/
├── src/
│   ├── config/               # Prisma client singleton, JWT configs
│   ├── middleware/           # Shared JWT verifiers, authorization, errors
│   ├── modules/              # Feature modules (Domain-driven)
│   │   ├── auth/             # Route -> Controller -> Service -> Repository
│   │   ├── users/
│   │   ├── groups/
│   │   ├── sessions/
│   │   ├── materials/
│   │   └── progress/
│   ├── validators/           # Zod validation schemas
│   ├── app.ts                # Express application configuration
│   └── server.ts             # Server execution entry point
```

### 1.2 Frontend Layer (React + Vite + TypeScript)
```
frontend/
├── src/
│   ├── api/                  # Axios services with centralized interceptors
│   ├── components/           # UI elements (Atomic: common & features)
│   │   ├── common/           # Primitive design elements
│   │   └── features/         # Complex, domain-specific items
│   ├── context/              # Contexts (AuthContext, global states)
│   ├── hooks/                # Custom React Hooks
│   ├── pages/                # High-level page wrappers
│   ├── router/               # React Router configurations
│   ├── types/                # Core TypeScript typings
│   ├── App.tsx
│   └── main.tsx
```

---

## 2. Shared Code Patterns

### 2.1 Backend: Controller Layer Standard
Controllers must handle only the HTTP layer (extract params, call services, format JSON replies). They **must not contain business rules or direct DB access**.

```typescript
// Pattern Example: group.controller.ts
export async function joinGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // set by auth middleware

    const member = await groupService.joinGroup(id, userId);

    return res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
}
```

### 2.2 Backend: Service Layer Standard
Services enforce all business checks, transactional validations, and trigger progress recalculations.

```typescript
// Pattern Example: group.service.ts
export async function joinGroup(groupId: string, userId: string) {
  // 1. Verify existence of group
  const group = await groupRepository.findById(groupId);
  if (!group) throw new NotFoundError("Study group not found");

  // 2. Enforce Business Rule: Check max membership capacity
  const currentMembersCount = await groupRepository.countMembers(groupId);
  if (currentMembersCount >= group.maxMembers) {
    throw new ValidationError("Study group capacity has been reached");
  }

  // 3. Prevent duplicate memberships
  const isMember = await groupRepository.isUserMember(groupId, userId);
  if (isMember) throw new ConflictError("You are already a member of this study group");

  // 4. Persist membership record
  return await groupRepository.addMember(groupId, userId, 'member');
}
```

---

## 3. Mandatory Development Rules

1. **Role Scoping Validation:** Always perform group authorization checks against `members.role` (database table entry), not system-wide `users.role`.
2. **Attendance Finalization Trigger:** When completing a session attendance record:
   * Record `left_at` and compute `duration_minutes`.
   * Trigger the progress service to atomically update total sessions attended, add session hours to `total_study_hours`, and re-evaluate mastery badges (`Beginner` / `Intermediate` / `Advanced`).
3. **No Direct ORM Outside Repositories:** Keep Prisma schema querying restricted inside feature repositories (`*.repository.ts`).
4. **Input Verification:** Secure all incoming requests using Zod schemas registered as routing validation middlewares.
