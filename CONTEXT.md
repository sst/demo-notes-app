# OpenCode Context for demo-notes-app

## Commands
- Build: `npm run build` (in packages/frontend)
- Dev: `npm run dev` (in packages/frontend)
- Lint: `npm run lint` (in packages/frontend)
- Test: `npm run test` (in packages/core)
- Single test: `sst shell vitest path/to/test.ts`

## Code Style
- TypeScript with strict typing
- React 19 with functional components and hooks
- Module exports pattern: `export module Name { export function method() {} }`
- Error handling: throw Error objects with descriptive messages
- Naming: camelCase for variables/functions, PascalCase for types/components
- Imports: group by external/internal, alphabetical order
- Formatting: 2-space indentation, trailing commas in objects
- Async/await for asynchronous operations
- Use object shorthand notation when variable names match keys

## Project Structure
- Monorepo with workspaces in packages/
- Core business logic in packages/core
- Frontend React app in packages/frontend
- API functions in packages/functions