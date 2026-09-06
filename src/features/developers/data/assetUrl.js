// Files under /public must be resolved against Vite's base, which is "/" in dev
// but "/<repo>/" for the GitHub Pages build (see VITE_BASE_PATH in
// .github/workflows/deploy.yml). A bare "/examples/..." path 404s there.
export const assetUrl = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`;

export default assetUrl;
