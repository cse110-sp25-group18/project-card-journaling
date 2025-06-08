# Prompted

---

## This is a website for easy and mindful prompt-based journaling.

### Check out our website at this [link](https://cse110-sp25-group18.github.io/project-card-journaling/index.html) or navigate to this [file](./index.html)

### Developed by Team 18 of CSE 110. Check out our team page and documentation in this [link](https://github.com/cse110-sp25-group18/cse110-sp25-group18.git)

# General Development Workflow

1. **Clone the repository**  
   Use the following command to clone the repo:  
   ```bash
   git clone <repository-url>
   ```

2. **Create a new branch**  
   Switch to a new branch. Use a clear and descriptive naming convention like:  
   ```
   <your-name>/<feature-name>
   ```

3. **Write your code** ✨  
   Make your changes and implement the feature or fix.

4. **Commit your changes**  
   Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages.  
   You can install the VSCode extension to help with this:  
   [Conventional Commits Plugin](https://marketplace.visualstudio.com/items/?itemName=vivaxy.vscode-conventional-commits)

5. **Rebase before pushing**  
   Always rebase your branch onto the latest `main` to keep history clean:  
   ```bash
   git fetch origin
   git rebase origin/main
   ```  
   Resolve any conflicts manually.

6. **Push your branch**  
   Push your changes to the remote:  
   ```bash
   git push
   ```

7. **Open a Pull Request**  
   Create a Pull Request on GitHub. Make sure to include a clear title and description. Link related issues if applicable.

---

🚫 **Never use `git push -f` unless absolutely necessary and approved.**  
Force pushing can disrupt team collaboration—use with extreme caution.

---