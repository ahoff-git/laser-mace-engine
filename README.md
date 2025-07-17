# Laser Mace Monorepo

This repository is organized as a monorepo with two workspaces:

- `packages/engine` – the ECS based game engine published as `laser-mace-engine`.
- `packages/test-app` – a minimal Next.js application demonstrating usage of the engine.

The root `package.json` defines npm workspaces so the test application can import the engine via `workspace:*`.
