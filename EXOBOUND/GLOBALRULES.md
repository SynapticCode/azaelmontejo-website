### 🔑 Golden Rules (Updated & Integrated)

These are the high-level principles that guide efficient and effective AI-assisted development.

---

### 🏆 1. Core Principles & Workflow

**Guiding your development process from start to finish.**

* **Understand the Project Context:**
    * **Always read `PLANNING.md`** & 'TRIALDEVELOPMENTPLAN.md' and 'TASKTRIALDEVELOPMENT.md' at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
    * **Check `TASK.md`** before starting a new task. If the task isn’t listed, add it with a brief description and the current date.
* **Iterate First:** Always look for existing code to iterate on before creating new code from scratch. Do not drastically change established patterns before first attempting to iterate on them.
* **Simplicity is Key:** Always prefer simple, clear solutions over complex ones.
* **Focused Changes:** You are careful to only make changes that are explicitly requested or are confidently understood and directly related to the current task. Do not touch code that is unrelated to the task at hand.
* **Systemic Awareness:** Always think about what other methods and areas of the codebase might be affected by your changes. Avoid making major, uninstructed changes to the architecture of a feature after it has been shown to work well.
* **Version Control:** Use a version control system like Git to manage code changes, facilitate collaboration, and track history.
* **Complete the Loop:**
    * **Mark completed tasks in `TASK.md`** immediately after finishing them.
    * **Add new sub-tasks or TODOs** discovered during development to `TASK.md` under a “Discovered During Work” section.
do not use '&&' in terminal as this is not a working function!
---

### 🧱 2. Code Quality & Maintainability

**Writing code that is clean, understandable, and easy to maintain.**

* **Don't Repeat Yourself (DRY):** Avoid code duplication at all costs by creating reusable modules and functions.
* **Cleanliness and Organization:** Keep the entire codebase very clean and organized.
* **Strict File Size Limit:** **Never create a file longer than 200 lines of code.** If a file approaches this limit, refactor it by splitting it into smaller, more focused modules or helper files.
* **Documentation is Immediate:** Write documentation and code comments as you go. Do not delay documentation.
* **Refactor Regularly:** Periodically refactor your code to improve its internal structure, readability, and maintainability without altering its external functionality.
* **Style & Conventions:**
    * **Follow the Plan:** **Use the consistent naming conventions, file structure, and architecture patterns as described in `PLANNING.md`.**
    * **Use Project Languages:** **Use the same programming language and conventions already established within the project.**
    * **Use Clear Imports:** **Use clear, consistent imports (prefer relative imports within packages).**
    * **Adhere to Linters and Formatters (e.g., Python):** **Follow style guides like PEP8, use type hints, and format code with a tool like `black`.**
    * **Use Validation Libraries (e.g., Python):** **Use established libraries like `pydantic` for all data validation.**

---

### 🧩 3. Modular Design & Architecture

**Building robust applications with a well-defined structure.**

* **Build with Modules:** **Organize code into clearly separated modules**, grouped by feature or responsibility. Write code using modular functions and break down components into smaller, reusable pieces.
* **Single Responsibility Principle (SRP):** Adhere strictly to the SRP. Each module or component should have one, and only one, reason to change.
* **High Cohesion, Low Coupling:** Design modules to be independent with minimal dependencies on each other. Communication between modules should occur through well-defined interfaces.
* **Use Interfaces and Abstractions:** Define a module's behavior using interfaces and abstractions to promote low coupling and flexibility.
* **Dependency Injection:** Manage dependencies between modules by passing them in as parameters or by using a dependency injection framework.
* **Preserve Existing Patterns:** When fixing an issue, do not introduce a new pattern or technology without first exhausting all options using the existing implementation. If a new pattern is required, you must remove the old implementation.

---

### 🧪 4. Testing & Validation

**Ensuring your code works correctly and reliably.**

* **Test Early, Test Often:**
    * **Always create unit tests for new features** (functions, classes, routes, etc.).
    * **After updating any logic, check whether existing unit tests need to be updated. If so, do it.**
* **Comprehensive Test Cases:** **Tests must include at least one case for the expected use, one edge case, and one failure case.**
* **Test Structure:** **Tests should live in a `/tests` folder that mirrors the main application structure.**
* **Continuous Validation:** Run tests between steps to confirm that the code is working as expected.
* **Clean Server State:** Always kill all related servers before starting a new test.

---

### ⚙️ 5. Environment & Deployment

*(No changes from your new list, this section remains as is)*

**Managing different environments and preparing for production.**

* **Manage Environments:** Write code that takes into account the different environments: development, testing, and production.
* **Implement Environment Variables:** You are responsible for implementing and managing environment variables.
* **Protect Sensitive Files:** Never overwrite my `.env` file without first asking for and receiving explicit confirmation.
* **Pre-Deployment Audit:** Before deploying a Node.js or web application, always run `npm run audit` and resolve any active vulnerabilities.

---

### 🛡️ 6. Security

*(No changes from your new list, this section remains as is)*

**Building secure and resilient applications.**

* **Authentication:** Use a managed auth solution, protect endpoints, and use CAPTCHA on auth routes.
* **Authorization & Data Access:** Always implement Row-Level Security (RLS).
* **Environment Variables:** Never expose secrets on the client-side.
* **Network & Infrastructure:** Implement rate limiting, DDoS protection, WAF, and firewalls.
* **Proactive Security Audits:** Perform security audits to identify and remediate vulnerabilities.