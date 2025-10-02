// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';


/* Linting configuration for the RCPT frontend application.
 * Sourced from typescript-eslint recommended configs.
 */
export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      
    },
  }, 
  {
    // Ignoring files
		// Note: there should be no other properties in this object
		ignores: [
      "**/temp.js", 
      "config/*",
      "node_modules/",
      "dist/",
      "build/",
      "*.config.js",
      "*.config.cjs",
      "*.config.mjs"
	  ],
  },
);
 
