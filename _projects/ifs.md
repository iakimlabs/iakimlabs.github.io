---
title: IFS — Integration File Service
short_title: IFS
tagline: A corporate document repository on top of S3, with a web UI for employees and an HTTP API for ERP systems.
summary: Role-based access over a folder tree, single sign-on, an audit log, custom document attributes, advanced search and ZIP / Excel export.
order: 1
featured: true
accent: "#2f7bd9"
cover: /assets/projects/ifs/cover.webp
type: Web application
year: 2026
tags: [Django, PostgreSQL, S3, nginx · Kerberos, REST API, ERP integration]
stats:
  - value: "60–130 ms"
    label: advanced search over 3,000 folders and 60,000 files
  - value: "85"
    label: built-in self-tests in 10 groups
  - value: "16 × 80"
    label: concurrent users × actions in the load test, zero errors
  - value: "~11,000"
    label: lines of Python
features:
  - icon: bi-diagram-3
    title: Folder tree and roles
    text: Eight actions on folders and files. Roles are assigned to a branch, inherited downward and added together. Search and export respect rights, so closed documents never show up in results.
  - icon: bi-plug
    title: API for ERP and other systems
    text: Documents arrive by a readable path, Organization/Section/Year/Month/file. Missing folders are created on the fly with the parent's rights. Any ERP (SAP, Microsoft Dynamics, Oracle) or script can call it, and sample clients are included.
  - icon: bi-tags
    title: Custom document attributes
    text: Document type, signatory, contract date, amount. Admin-managed dictionary; values can be set in the file card, on upload, in bulk from search results and via the API.
  - icon: bi-search
    title: Advanced search and export
    text: Folder tree with exclusions, date, size, author, name and folder masks, attributes. Streamed ZIP64 archives and Excel registers with hundreds of thousands of rows.
  - icon: bi-sliders2
    title: Admin panel and audit log
    text: Structure, roles, users, attributes and settings without a restart. A filterable audit log with Excel export and a DB-versus-S3 integrity check.
  - icon: bi-check2-square
    title: Built-in self-test
    text: 85 automated tests, including concurrent users. An admin runs them from the UI against a separate test database with an S3 simulator.
decisions:
  - title: The S3 key is the file's UUID, not its path.
    text: Renaming a folder with hundreds of thousands of files is a single UPDATE in the database. No objects are copied.
  - title: Permissions are materialized, not computed on the fly.
    text: Each folder stores its effective role set, recalculated by triggers over the subtree (WITH RECURSIVE). An access check is one indexed query.
  - title: Business rules live in the database.
    text: PL/pgSQL triggers and constraints behave the same for the web UI, the API and any future integration. The app is SQL-first, Django without the ORM, with numbered SQL migrations and its own runner.
  - title: Streaming, no copies on disk.
    text: Multipart upload straight to S3. A storage error is detected before the first byte reaches the client, so users get a clear message instead of a broken file.
  - title: Safe under concurrency.
    text: PostgreSQL advisory locks per file serialize overwrites and deletes. Deletion goes S3 first, then the database, so the two never drift apart after a failure.
  - title: Secure by default.
    text: Authentication happens only at nginx (Kerberos), no presigned URLs leave the perimeter, CSRF is handled behind the TLS proxy. Selected files are re-checked against rights on the server, and deleting more than 100 files requires typing the number.
screens:
  - src: /assets/projects/ifs/architecture.webp
    caption: Architecture — nginx (Kerberos) → IFS → PostgreSQL and S3.
  - src: /assets/projects/ifs/01_main.webp
    caption: Main screen — a folder tree that respects permissions, the file list and upload.
  - src: /assets/projects/ifs/03_file_attributes.webp
    caption: File card with custom attributes.
  - src: /assets/projects/ifs/04_advanced_search.webp
    caption: Advanced search with masks and attribute filters, plus ZIP and Excel export.
  - src: /assets/projects/ifs/07_admin_structure.webp
    caption: Admin panel — roles assigned to a folder, own and inherited.
  - src: /assets/projects/ifs/11_admin_journal.webp
    caption: Audit log with filters and Excel export.
---
IFS is a single place for primary documents — contracts, acts, invoices — of several group companies. It is built for a closed corporate network with no internet access.

## The challenge

- Documents have to arrive automatically from the ERP system.
- Employees work with them in the browser, and everyone sees only their own.
- Security needs to see who did what and when.
- Everything runs inside the corporate network.

## The solution

A web application and an HTTP API on top of one service. File contents live in the corporate S3; structure, permissions, attributes and the audit log live in PostgreSQL. Users sign in with their domain account (Kerberos on nginx), and the system stores no passwords.

*All screenshots show demo data. The customer, real documents and internal addresses are not shown.*
