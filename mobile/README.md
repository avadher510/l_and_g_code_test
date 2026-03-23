# Mobile App - Environment Configuration

## Running the App (No .env Required)

This project is configured to run **without any `.env` file** for ease of review and local testing. The BFF base URL is hardcoded in the source code with a sensible default.

Simply run:
```bash
npm install
npx expo start
```

The app will connect to the BFF at `http://192.168.0.156:3001` by default.

## Network Configuration

Depending on where you're running the mobile app, you may need to adjust the BFF URL:

- **iOS Simulator**: Use `http://localhost:3001`
- **Android Emulator**: Use `http://10.0.2.2:3001`
- **Physical Device on Same Network**: Use your machine's local IP (e.g., `http://192.168.0.156:3001`)

To override the default, create a `.env` file:
```bash
EXPO_PUBLIC_BFF_BASE_URL=http://localhost:3001
```

## Important Note on Environment Variables

**This is a local-only demonstration project.** In a production application, all API endpoints, authentication tokens, API keys, and sensitive configuration would be stored in environment variables and never committed to version control.

For this technical exercise:
- No `.env` file is required to run the project
- The BFF URL is hardcoded for convenience
- No authentication or API keys are used
- This approach is **only acceptable for local development/demonstration**

In a real-world scenario, you would:
- Store all configuration in `.env` files
- Add `.env` to `.gitignore`
- Provide `.env.example` as a template
- Use environment-specific configurations (dev, staging, production)
- Secure all API keys and tokens
- Never commit sensitive credentials
