# Team Collaboration & Git Workflow Guide

Welcome to the **Quantum Digital Signature Threat Detection** project!

This guide establishes our team git standards and collaboration procedures.

---

## 1. The Core Golden Rules

1. **Never commit secrets to Git:** Never commit `.env`, secret tokens, private keys, or passwords. Once pushed to GitHub, secrets remain in Git commit history even if deleted in a later commit.
2. **Never push directly to `main`:** All work happens on feature branches and goes through a GitHub Pull Request (PR).
3. **Rudra reviews before merging:** Rudra acts as lead architect and must review and approve PRs.
4. **Keep branches short-lived:** Work in small, focused increments rather than giant branches that touch dozens of files.

---

## 2. Terminology Demystified

- **Commit vs. Push:**
  - `git commit` saves a snapshot of your staged changes **locally on your computer**. Teammates cannot see it yet.
  - `git push` uploads your local commits to the shared **GitHub repository in the cloud**.
- **Pull vs. Pull Request:**
  - `git pull` downloads new commits from GitHub and merges them into your local files.
  - A **Pull Request (PR)** is a formal request on GitHub asking the team to review and merge your branch into `main`.

---

## 3. Daily Feature Branch Workflow (Step-by-Step)

Here is a complete, beginner-friendly walkthrough using `feature/simulation-lab`:

### Step A: Update your local `main`
Always start from the latest code before beginning a new task:
```bash
git checkout main
git pull origin main
```

### Step B: Create and switch to your feature branch
```bash
git checkout -b feature/simulation-lab
```

### Step C: Make your changes and test locally
Edit files, run tests or local servers:
```bash
# Verify nothing is broken locally
npm run build   # for frontend
```

### Step D: Review changes before staging
See what files you modified:
```bash
git status
git diff
```

### Step E: Stage and commit
```bash
git add src/pages/SimulationLab.jsx
git commit -m "feat(simulation): add parameter sliders for noise and threshold"
```

### Step F: Push your branch to GitHub
```bash
git push -u origin feature/simulation-lab
```

### Step G: Open a Pull Request on GitHub
1. Go to your repository on github.com.
2. Click **"Compare & pull request"**.
3. Fill out the PR description using the template.
4. Request review from **Rudra**.
5. Once approved, merge the PR!

### Step H: Clean up locally after merge
```bash
git checkout main
git pull origin main
git branch -d feature/simulation-lab
```

---

## 4. How to Avoid Editing the Same Files

- Respect workstream ownership boundaries:
  - **Part 1 (Rudra):** `backend/detection/engine/`, `views.py`, core integration.
  - **Part 2:** `backend/detection/quantum/` (pure simulator modules).
  - **Part 3:** `frontend/src/` (components, pages, styles).
  - **Part 4:** `tests/`, benchmark scripts, evaluation reports.
- If two people must touch the same area, coordinate in team chat first.

---

## 5. Resolving Merge Conflicts Peacefully

If another teammate merges changes that overlap with yours, Git will flag a conflict:

1. Update your branch with latest `main`:
   ```bash
   git checkout feature/your-branch
   git merge main
   ```
2. Git marks conflicting lines like this:
   ```text
   <<<<<<< HEAD (Current Change - your branch)
   const defaultShots = 256;
   =======
   const defaultShots = 512;
   >>>>>>> main (Incoming Change - from main)
   ```
3. Open the file in your code editor. Discuss with your teammate to determine which value is correct, or combine both if both are needed.
4. Delete the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
5. Save the file, stage it, and commit:
   ```bash
   git add filename
   git commit -m "fix: resolve merge conflict between main and feature branch"
   git push origin feature/your-branch
   ```
