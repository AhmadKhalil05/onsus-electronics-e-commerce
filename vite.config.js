/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  /**
   * AWS Amplify is large; pinning pre-bundled deps avoids intermittent
   * "504 (Outdated Optimize Dep)" after installs or cache drift. If it
   * happens again: stop dev server, delete node_modules/.vite, restart.
   */
  optimizeDeps: {
    include: [
      "aws-amplify",
      "aws-amplify/auth",
      "aws-amplify/utils",
      "aws-amplify/auth/enable-oauth-listener",
      "@aws-amplify/auth",
      "@aws-amplify/core",
    ],
  },
});
