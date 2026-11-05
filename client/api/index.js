// Vercel serverless entry. `npm run build:api` bundles the Express app (server/src) and all of its
// dependencies into api/_bundle.js, because Vercel only packages files inside the client/ project root.
const mod = require('./_bundle.js');
module.exports = mod.default || mod;
