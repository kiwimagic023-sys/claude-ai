import { defineConfig } from 'vite';

export default defineConfig({
  // caminhos relativos: o site funciona na raiz do domínio ou em subpastas
  base: './',
  build: { target: 'es2020', cssMinify: true, assetsInlineLimit: 0 },
});
