# 🤝 Contributing

Contributions and feature suggestions are welcome. Feel free to check the [issues page](https://github.com/r37r0m0d3l/hardwired_skill_typescript/issues) if you want to propose a new rule.

## 🛠️ Development

### Build and Packaging

- **Important:** In `package.json` "bin" entries, only `.js` files are allowed.
- `.ts` files in `bin/` must be compiled into `.js` for the npm package to ensure compatibility when running from `node_modules`.
- Always run `npm run build` after modifying files in `bin/`.
