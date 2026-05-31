# USE_CASE.md

# Use Case Specifications

## 1. System Actors

### Guest (Unauthenticated User)
* **Register:** Sign up for an account with username, email, full name, semester, and password.
* **Login:** Verify credentials to obtain a secure JWT session token.
* **Browse Study Groups:** View public groups, search by name, or filter by academic subject code.
* **View Group Details:** Examine group goals, current member counts, and maximum capacity limits.

---

### Student (Authenticated User - System-Wide)
* **Manage Profile:** Update personal parameters such as full name and academic semester.
* **Set Learning Style:** Define primary and secondary learning preferences.
* **Join Study Group:** Enroll in a public group. *Include relationship:* **Check Capacity Limit**.
* **Leave Study Group:** Remove oneself from a joined group.
* **Browse Sessions:** Browse scheduled study activities associated with joined groups.
* **Join Session:** Log active entrance into a scheduled study session. *Include relationship:* **Validate Group Membership**. *Internal action:* Generates a new active record in `session_attendances`.
* **Leave Session:** Log departure from a study session. *Internal action:* Saves departure timestamp, computes duration, increments total attended sessions, increases study hours, and recalculates mastery level.
* **Upload Material:** Share academic files with group members. *Include relationship:* **Validate Group Membership**.
* **View Materials:** Browse and access all materials shared in a group. *Include relationship:* **Validate Group Membership**.
* **Download Material:** Retrieve academic resources for independent study. *Include relationship:* **Validate Group Membership**.
* **Delete Material (Own):** Delete resources originally uploaded by oneself.
* **View Personal Progress:** Access the progress dashboard to monitor attended counts, total study hours, and estimated mastery levels.

---

### Group Admin (Contextual Role: members.role = 'admin')
*Inherits all Student permissions within the scoped group, plus the following additional capabilities:*

* **Update Study Group:** Modify group configurations (e.g., description, capacity ceiling).
* **Disband Study Group:** Delete the study group. *Internal action:* Cascade deletes all related members, sessions, materials, and progress history.
* **Manage Members:** View and manage the member registry.
* **Kick Member:** Remove a user from the group.
* **Create Session:** Schedule a new study session.
* **Update Session:** Modify scheduled times, titles, or status of a session.
* **Delete Session:** Remove a scheduled session.
* **Delete Material (Any):** Force-delete any shared resource in the group, regardless of who uploaded it.

---

## 2. Dynamic Use Case Relationships

```mermaid
usecaseDiagram
    actor Guest
    actor Student
    actor "Group Admin" as Admin

    Guest --> (Register)
    Guest --> (Login)
    Guest --> (Browse Groups)

    Student --> (Join Group)
    (Join Group) ..> (Check Group Capacity) : <<include>>

    Student --> (Join Session)
    (Join Session) ..> (Validate Group Membership) : <<include>>

    Student --> (Leave Session)
    (Leave Session) ..> (Recalculate Progress & Mastery) : <<extend>>

    Student --> (Upload Material)
    (Upload Material) ..> (Validate Group Membership) : <<include>>

    Student --> (Delete Own Material)

    Admin --> (Update Group Details)
    Admin --> (Kick Member)
    Admin --> (Schedule Session)
    Admin --> (Delete Any Material)
```
