# Complete Setup Guide for CaptaAppAPI

## Intel MacBook

This guide will walk you through setting up everything needed to run this NestJS API locally on a fresh Intel MacBook.

---

## Prerequisites Checklist

- [ ] Intel-based MacBook
- [ ] macOS installed
- [ ] Terminal access (built-in Terminal.app or iTerm2)

---

## Step 1: Install Homebrew

Homebrew is a package manager for macOS that we'll use to install other tools.

1. Open **Terminal** (Applications → Utilities → Terminal)
2. Run this command:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Follow the prompts (you'll need to enter your Mac password)
4. When installation completes, Homebrew will be installed to `/usr/local` (Intel Mac) or `/opt/homebrew` (Apple Silicon). The installer will show you the correct path.
5. Verify installation:
   ```bash
   brew --version
   ```
   You should see a version number (e.g., `Homebrew 4.x.x`)

---

## Step 2: Install Node.js and npm (via nvm)

We'll use `nvm` (Node Version Manager) to install Node.js, which gives you flexibility to switch versions.

1. Install nvm:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. Reload your shell configuration:

   ```bash
   source ~/.zshrc
   ```

   (If you're using bash instead of zsh, use `source ~/.bash_profile` or `source ~/.bashrc`)

   **Note:** On older macOS versions, the default shell might be bash. Check with: `echo $SHELL`

3. Verify nvm is installed:

   ```bash
   nvm --version
   ```

4. Install the latest LTS version of Node.js:

   ```bash
   nvm install --lts
   ```

5. Set it as the default:

   ```bash
   nvm use --default
   ```

6. Verify Node.js and npm are installed:
   ```bash
   node --version
   npm --version
   ```
   You should see versions like `v20.x.x` for Node and `10.x.x` for npm

---

## Step 3: Install PostgreSQL

PostgreSQL is the database this API uses.

1. Install PostgreSQL via Homebrew:

   ```bash
   brew install postgresql@16
   ```

2. Start PostgreSQL service:

   ```bash
   brew services start postgresql@16
   ```

3. Create a database user (optional, but recommended):

   ```bash
   createuser -s postgres
   ```

   Or create a custom user:

   ```bash
   createuser -s captaapp
   ```

   **Note:** On Intel Mac, if you get "command not found", you may need to add PostgreSQL to your PATH:

   ```bash
   echo 'export PATH="/usr/local/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. Create a database:

   ```bash
   createdb captaapp_db
   ```

5. Verify PostgreSQL is running:
   ```bash
   psql -d captaapp_db -c "SELECT version();"
   ```
   You should see PostgreSQL version information

**Note:** If you prefer a GUI tool, you can install **Postico** or **pgAdmin**:

```bash
brew install --cask postico
```

---

## Step 4: Install Git (if not already installed)

Git is usually pre-installed on macOS, but let's verify:

1. Check if Git is installed:

   ```bash
   git --version
   ```

2. If not installed, install via Homebrew:

   ```bash
   brew install git
   ```

3. Configure Git (if first time):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

---

## Step 5: Clone/Setup the Project

1. Navigate to where you want the project:

   ```bash
   cd ~/Documents/code
   ```

   (Create the directory if it doesn't exist: `mkdir -p ~/Documents/code`)

2. If you have the project in a Git repository, clone it:

   ```bash
   git clone <your-repo-url> CaptaAppAPI
   cd CaptaAppAPI
   ```

   Or if you already have the project locally:

   ```bash
   cd /Users/jakealexander/Documents/code/CaptaAppAPI
   ```

---

## Step 6: Install Project Dependencies

1. Install Yarn (package manager):

   ```bash
   npm install -g yarn
   ```

2. Verify Yarn is installed:

   ```bash
   yarn --version
   ```

3. Install project dependencies:

   ```bash
   yarn install
   ```

   This will install all the packages listed in `package.json`. It may take a few minutes.

---

## Step 7: Set Up Environment Variables

1. Create a `.env` file in the project root:

   ```bash
   touch .env
   ```

2. Open the `.env` file in a text editor (nano, vim, or VS Code):

   ```bash
   nano .env
   ```

3. Add the following environment variables (adjust values as needed):

   ```env
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/captaapp_db?schema=public"

   # JWT Configuration
   JWT_ACCESS_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
   JWT_ACCESS_TTL="15m"
   REFRESH_TOKEN_TTL_DAYS=7

   # Bcrypt
   BCRYPT_SALT_ROUNDS=12

   # Server
   PORT=3000
   NODE_ENV=development
   ```

   **Important:**
   - Replace `your-super-secret-jwt-key-change-this-in-production-min-32-chars` with a strong random string (at least 32 characters)
   - Adjust `DATABASE_URL` if you created a different database name or user
   - Default PostgreSQL user is usually `postgres` with no password, or your Mac username

4. Save and exit:
   - In nano: Press `Ctrl + X`, then `Y`, then `Enter`
   - In vim: Press `Esc`, type `:wq`, press `Enter`

---

## Step 8: Set Up the Database

1. Generate Prisma Client:

   ```bash
   yarn db:generate
   ```

2. Push the database schema (creates tables):

   ```bash
   yarn db:push
   ```

3. (Optional) Run database migrations instead of push:

   ```bash
   yarn db:migrate
   ```

4. Add the CHECK constraints and indexes:

   ```bash
   psql captaapp_db -f prisma/add_constraints_and_indexes.sql
   ```

5. (Optional) Seed the database with sample data:
   ```bash
   yarn db:seed
   ```

---

## Step 9: Verify Everything Works

1. Start the development server:

   ```bash
   yarn start:dev
   ```

2. You should see output like:

   ```
   [Nest] INFO  [NestFactory] Starting Nest application...
   [Nest] INFO  [InstanceLoader] AppModule dependencies initialized
   API running on http://localhost:3000/api
   ```

3. Test the health check endpoint:
   - Open your browser and go to: `http://localhost:3000/api`
   - Or use curl:
     ```bash
     curl http://localhost:3000/api
     ```
   - You should see: `{"message":"CaptaApp API is running!"}`

4. Test authentication (in a new terminal or Postman):
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "username": "testuser",
       "password": "Password123",
       "firstName": "Test",
       "lastName": "User",
       "age": 25
     }'
   ```

---

## Step 10: (Optional) Install VS Code and Useful Extensions

1. Install VS Code:

   ```bash
   brew install --cask visual-studio-code
   ```

2. Recommended extensions (install via VS Code Extensions panel):
   - **Prisma** (Prisma.prisma)
   - **ESLint** (dbaeumer.vscode-eslint)
   - **Prettier** (esbenp.prettier-vscode)
   - **REST Client** (humao.rest-client) - for testing APIs
   - **Thunder Client** (rangav.vscode-thunder-client) - Postman alternative

---

## Troubleshooting

### Issue: "Command not found: yarn"

**Solution:** Make sure you ran `npm install -g yarn` and that Node.js is in your PATH.

### Issue: "Cannot connect to database"

**Solution:**

- Check PostgreSQL is running: `brew services list`
- Verify database exists: `psql -l`
- Check DATABASE_URL in `.env` matches your setup
- If `psql` command not found, add PostgreSQL to PATH (see Step 3 notes)

### Issue: "Port 3000 already in use"

**Solution:**

- Find what's using it: `lsof -i :3000`
- Kill the process: `kill -9 <PID>`
- Or change PORT in `.env` to a different number

### Issue: "Prisma Client not generated"

**Solution:**

- Run `yarn db:generate` again
- Make sure you're in the project root directory

### Issue: "Permission denied" errors

**Solution:**

- Use `sudo` if needed (but be careful)
- Check file permissions: `ls -la`
- Make sure you own the project directory
- On Intel Mac, Homebrew installs to `/usr/local` which may require different permissions

### Issue: "Homebrew not found after installation"

**Solution:**

- For Intel Mac, Homebrew installs to `/usr/local/bin/brew`
- Add to PATH: `echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`
- Verify: `which brew` should show `/usr/local/bin/brew`

---

## Quick Reference Commands

```bash
# Start development server
yarn start:dev

# Build for production
yarn build

# Start production server
yarn start:prod

# Database commands
yarn db:generate    # Generate Prisma Client
yarn db:push        # Push schema to database
yarn db:migrate     # Run migrations
yarn db:seed        # Seed database

# PostgreSQL commands
brew services start postgresql@16    # Start PostgreSQL
brew services stop postgresql@16     # Stop PostgreSQL
psql captaapp_db                     # Connect to database
```

---

## Next Steps

1. Read `POSTMAN_GUIDE.md` for API endpoint documentation
2. Set up your Postman environment (see POSTMAN_GUIDE.md)
3. Start building! 🚀

---

## Need Help?

- Check the terminal output for specific error messages
- Verify all environment variables are set correctly
- Ensure PostgreSQL is running: `brew services list`
- Check Prisma schema is valid: `yarn db:generate`
