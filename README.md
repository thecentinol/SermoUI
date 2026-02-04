# SermoUI
SermoUI is a local UI for testing, comparing, and experimenting with LLMs using Ollama (more runners coming soon).

It provides a simple interface to run prompts, switch models, compare outputs, and inspect behavior without writing scripts or using the terminal.

## Why
When working with local models, you often need to:
- Test the same prompt across different models
- Compare output quality and style
- Tweak parameters like temperature and max tokens
- Keep a history of experiments

SermoUI exists to make that workflow visual, fast, and repeatable.

## Features (current)
- List local Ollama models
- Select active model
- Run prompts from a UI
- View model responses
- Basic session history

## Tech Stack
- React + TypeScript
- Vite
- Zustand
- Tailwind / shadcn-ui
- Ollama HTTP API

## Requirements
- Bun 1.3.6+
- Ollama installed and running locally

https://ollama.com

## Setup
Clone the repo & run:

```bash
git clone https://github.com/thecentinol/SermoUI.git
cd sermoui
bun vite
```
