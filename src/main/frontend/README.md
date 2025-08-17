# Beer Service Frontend

This is the React frontend for the Spring Boot Beer Service application. It provides a user interface for managing beers, customers, and beer orders.

## Development Workflow

### Prerequisites

- Node.js v22.16.0 or higher
- npm v11.4.0 or higher

### Getting Started

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd src/main/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
   This will start the Vite development server at http://localhost:3000.

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run start` - Alias for `dev`
- `npm run build` - Builds the app for production
- `npm run build:prod` - Builds the app for production with production mode
- `npm run build:dev` - Builds the app with development mode
- `npm run test` - Runs unit tests
- `npm run test:watch` - Runs tests in watch mode
- `npm run test:coverage` - Runs tests with coverage report
- `npm run lint` - Lints the code
- `npm run lint:fix` - Lints and fixes the code
- `npm run format` - Formats the code with Prettier
- `npm run preview` - Previews the built app locally
- `npm run analyze` - Analyzes the bundle size
- `npm run typecheck` - Runs TypeScript type checking

### Development with Backend

For full-stack development with the Spring Boot backend:

1. Start the Spring Boot application (in a separate terminal):
   ```
   ./mvnw spring-boot:run
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

The frontend development server is configured to proxy API requests to the backend server running on http://localhost:8080.

### Code Organization

- `src/api` - API clients and configuration
- `src/components` - Reusable UI components
- `src/contexts` - React context providers
- `src/hooks` - Custom React hooks
- `src/layouts` - Page layouts
- `src/pages` - Page components
- `src/services` - Service modules for data operations
- `src/types` - TypeScript type definitions
- `src/utils` - Utility functions

### Build for Production

To build the application for production:

```
npm run build
```

This will create a production build in the `../../resources/static` directory, which will be served by the Spring Boot application.

### Code Quality

This project uses:

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- lint-staged for running linters on staged files

Pre-commit hooks will automatically run linters and formatters on staged files.
