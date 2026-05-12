# HRMS Role Access Flow

This document explains how Super Admin, Company Admin, Employee, and Client access should work in the HRMS frontend and future PHP backend.

## 1. High-Level Hierarchy

```text
Platform / SaaS Layer
+-- Super Admin
    +-- Manages platform settings
    +-- Manages packages and subscriptions
    +-- Manages companies
    +-- Creates the first admin for each company
    +-- Can login as a company admin for support/debugging

Company Workspace Layer
+-- Company
    +-- Admin
        +-- Manages company settings
        +-- Manages employees
        +-- Manages clients
        +-- Manages HR, attendance, leaves, shifts
        +-- Manages projects, tasks, finance, tickets
        +-- Creates employee and client users

User Portal Layer
+-- Employee
|   +-- Uses employee/member dashboard
|   +-- Marks or views attendance
|   +-- Applies for leaves
|   +-- Works on assigned projects and tasks
|   +-- Uses tickets, messages, events, notices, profile
|
+-- Client
    +-- Uses client dashboard
    +-- Views assigned projects
    +-- Views invoices, estimates, payments where allowed
    +-- Creates/views tickets and task requests
    +-- Uses messages, events, notices, profile
```

## 2. Main Concept

There are two different administration levels:

| Level | Role | Scope | Purpose |
|---|---|---|---|
| Platform | `super_admin` | Whole SaaS/platform | Owns and manages the HRMS platform itself |
| Company | `admin` | One company/workspace | Manages one company account and all company data |
| Company User | `employee` | One company, self/team data | Works inside the company as staff |
| Client Portal | `client` | One company, client-owned/shared data | External customer portal |

The most important rule:

```text
Super Admin is not a company user.
Company Admin, Employee, and Client are company-scoped users.
```

So a Super Admin should normally have:

```text
role = super_admin
company_id = null
```

A Company Admin should have:

```text
role = admin
company_id = actual company id
```

## 3. How The First Super Admin Is Created

The first Super Admin cannot be created from the frontend because no authorized platform user exists yet.

The first Super Admin should be created directly by the backend/database setup process.

Recommended method:

```text
Backend database seeder
```

Example concept:

```php
User::create([
    'name' => 'Platform Owner',
    'email' => 'super@yourdomain.com',
    'password' => password_hash('secure-password', PASSWORD_DEFAULT),
    'role' => 'super_admin',
    'company_id' => null,
    'super_admin' => 1,
    'status' => 'active',
]);
```

After this first Super Admin exists, they can login and create/manage other platform admins from the frontend.

Frontend page:

```text
/super-admin/settings
```

## 4. Super Admin Flow

```text
First Super Admin created by backend seeder
        |
        v
Super Admin logs in
        |
        v
Frontend receives role = super_admin
        |
        v
Frontend redirects to /super-admin/dashboard
        |
        v
Super Admin manages platform modules
        |
        v
Super Admin creates companies
        |
        v
Each company receives first company admin
```

Super Admin pages in the Next.js project:

| Page | Purpose |
|---|---|
| `/super-admin/dashboard` | Platform overview |
| `/super-admin/companies` | List/manage companies |
| `/super-admin/companies/create` | Create company and first company admin |
| `/super-admin/packages` | Manage subscription packages |
| `/super-admin/invoices` | Platform/subscription invoices |
| `/super-admin/settings` | Platform settings and Super Admin management |

Super Admin should not directly manage:

```text
/employees
/attendance
/projects
/invoices
/clients
/settings
```

Those are company workspace pages and belong to Company Admin.

## 5. Company Creation Flow

When Super Admin creates a company, the backend should create two things:

```text
1. Company record
2. First company admin user
```

Flow:

```text
Super Admin opens /super-admin/companies/create
        |
        v
Submits company details
        |
        v
Submits first admin details
        |
        v
Backend creates company
        |
        v
Backend creates user with role = admin and company_id = new company id
        |
        v
Company Admin can login and manage that company
```

Expected backend payload concept:

```json
{
  "company": {
    "company_name": "Example Company",
    "company_email": "info@example.com",
    "package_id": 1,
    "status": "active"
  },
  "admin": {
    "name": "Company Admin",
    "email": "admin@example.com",
    "password": "secure-password",
    "role": "admin"
  }
}
```

Backend should save:

```text
companies.id = 10

users.name = Company Admin
users.email = admin@example.com
users.role = admin
users.company_id = 10
users.status = active
```

## 6. Login As Company Admin

Super Admin can impersonate a company admin for support.

Flow:

```text
Super Admin opens /super-admin/companies
        |
        v
Clicks "Login as company admin"
        |
        v
Backend validates current user is Super Admin
        |
        v
Backend returns a company admin session/token
        |
        v
Frontend saves original Super Admin session
        |
        v
Frontend switches UI to Company Admin
        |
        v
Sidebar shows "Return to Super Admin"
        |
        v
User can return back to platform session
```

Security rule:

```text
Only Super Admin can call company impersonation endpoint.
```

Suggested endpoint:

```text
POST /companies/{companyId}/login
```

Response concept:

```json
{
  "token": "company-admin-token",
  "user": {
    "id": 25,
    "name": "Company Admin",
    "email": "admin@example.com",
    "role": "admin",
    "company_id": 10,
    "impersonator_role": "super_admin"
  }
}
```

## 7. Company Admin Flow

Company Admin is the highest role inside one company.

```text
Company Admin logs in
        |
        v
Frontend receives role = admin and company_id
        |
        v
Frontend redirects to /dashboard
        |
        v
Admin manages company workspace
        |
        v
Admin creates employees and clients
```

Company Admin can access:

```text
/dashboard
/dashboard/hr
/dashboard/finance
/dashboard/project
/dashboard/ticket
/employees
/teams
/designation
/shift-types
/attendance
/leaves
/clients
/projects
/tasks
/invoices
/estimates
/proposals
/payments
/expenses
/tickets
/reports
/settings
/role-permission
```

Company Admin should not access:

```text
/super-admin/*
```

## 8. Employee Flow

Employee is an internal staff/member user.

```text
Admin creates employee
        |
        v
Admin assigns role = employee
        |
        v
Employee logs in
        |
        v
Frontend redirects to /member/dashboard
        |
        v
Employee uses member portal
```

Employee can access:

```text
/member/dashboard
/attendance
/leaves
/projects
/tasks
/tickets
/user-chat
/events
/event-calendar
/notices
/profile
/search
```

Employee should not access:

```text
/super-admin/*
/employees
/clients
/settings
/role-permission
/payroll
/reports
```

## 9. Client Flow

Client is an external company customer.

```text
Admin creates client
        |
        v
Backend creates client user with role = client
        |
        v
Client logs in
        |
        v
Frontend redirects to /dashboard/client
        |
        v
Client sees client portal only
```

Client can access:

```text
/dashboard/client
/projects
/tasks
/invoices
/estimates
/payments
/tickets
/user-chat
/events
/notices
/profile
```

Client should not access:

```text
/super-admin/*
/employees
/attendance
/leaves
/settings
/payroll
/reports
```

## 10. Next.js Frontend Role Contract

The current frontend expects login response like this:

```json
{
  "token": "token-value",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "super_admin",
    "company_id": null,
    "permissions": ["*"],
    "modules": ["platform"]
  }
}
```

Allowed role values:

```text
super_admin
admin
employee
client
```

Default redirects:

| Role | Redirect |
|---|---|
| `super_admin` | `/super-admin/dashboard` |
| `admin` | `/dashboard` |
| `employee` | `/member/dashboard` |
| `client` | `/dashboard/client` |

## 11. Backend Developer Implementation Checklist

### A. Users Table / Auth Model

The backend should support these fields or equivalent:

```text
id
name
email
password
role
company_id
status
super_admin
created_at
updated_at
```

Recommended meaning:

```text
super_admin = 1 and company_id = null => platform Super Admin
role = admin and company_id != null => Company Admin
role = employee and company_id != null => Employee
role = client and company_id != null => Client
```

### B. First Super Admin Seeder

Create one initial platform owner during installation:

```text
email: super@yourdomain.com
role: super_admin
company_id: null
super_admin: 1
status: active
```

This is required before frontend Super Admin pages can be used.

### C. Login Endpoint

Endpoint:

```text
POST /auth/login
```

Request:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:

```json
{
  "token": "secure-token",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "company_id": 10,
    "permissions": ["employees.*", "projects.*"],
    "modules": ["hr", "work", "finance"]
  }
}
```

### D. Route Guards / Middleware

Backend must enforce access too. Frontend route protection is not enough.

Required backend rules:

```text
/super-admin/* => only super_admin
/admin/company workspace APIs => admin with matching company_id
/member APIs => employee with matching company_id
/client APIs => client with matching company_id and owned/shared records
```

### E. Company Creation Endpoint

Endpoint:

```text
POST /companies
```

Only allowed for:

```text
super_admin
```

Backend must:

```text
1. Create company
2. Create first admin user
3. Attach admin to company_id
4. Assign role = admin
5. Return created company and admin summary
```

### F. Add Super Admin Endpoint

Endpoint concept:

```text
POST /settings/platform-admins
```

Only allowed for:

```text
super_admin
```

Backend must create:

```text
role = super_admin
company_id = null
super_admin = 1
status = active
```

### G. Employee Role Assignment

Endpoint concept:

```text
POST /employees/assignRole
```

Only allowed for:

```text
admin
```

Admin can assign inside their own company:

```text
admin
employee
```

Admin should not assign:

```text
super_admin
```

### H. Client Creation

Only Company Admin should create client users inside their company.

Client user should be saved as:

```text
role = client
company_id = admin.company_id
```

### I. Impersonation Endpoint

Endpoint:

```text
POST /companies/{companyId}/login
```

Only allowed for:

```text
super_admin
```

Backend should:

```text
1. Verify requester is super_admin
2. Find company
3. Find first active admin for company
4. Issue temporary/admin token
5. Mark response with impersonator_role = super_admin
6. Log impersonation audit event
```

### J. Audit Logs Recommended

Backend should log:

```text
Super Admin created company
Super Admin created another Super Admin
Super Admin logged in as company admin
Admin created employee
Admin created client
Admin changed role permissions
```

## 12. Simple Summary For Management

```text
Super Admin owns the platform.
Company Admin owns one company workspace.
Employee works inside the company.
Client sees only client-facing company data.
```

First Super Admin must be created by backend/database setup. After that, Super Admin can create companies, company admins, and additional super admins from the frontend.
