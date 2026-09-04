# Bodhan AI

**Empowering education through AI-driven course generation and interactive learning arenas.**

Bodhan AI is a cutting-edge educational platform designed to revolutionize how users learn and interact with content. By leveraging advanced AI, we provide dynamic course generation, real-time transliteration, and immersive learning environments.

> [!WARNING]
> This project is currently in an experimental state.

## Vision

Our vision is to bridge the gap between traditional education and modern technology. We aim to make high-quality, personalized learning accessible to everyone, regardless of language barriers or learning styles, through the power of Artificial Intelligence.

## Key Features

*   **AI Course Generation**: Instantly create comprehensive courses on any topic.
*   **Multi-language Support**: Real-time transliteration to support diverse user bases.
*   *More features will be added in the future.*

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (latest LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Bodhan-AI/Website.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Website
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Live preview (GitHub Pages)

Pushes to `main` run [.github/workflows/deploy.yml](.github/workflows/deploy.yml) and publish the site.

- **URL:** https://bodhan-google.github.io/Website/
- **Research:** https://bodhan-google.github.io/Website/#/research
- **Research problems:** https://bodhan-google.github.io/Website/#/research/problems

In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions** (first-time setup).

Local dev uses `/` as the asset base; CI sets `VITE_BASE_PATH=/<repo-name>/` automatically.

### Linting

To run the linter:

```bash
npm run lint
```