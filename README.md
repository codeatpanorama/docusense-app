# panocr

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Working with Docker

### Build the Project for Production

```sh
npm install
```

### Compile and Minify for Production

```sh
npm run build
```

### Create network
```dockerfile
docker network create document
```

### Create Image
```dockerfile

docker build -t madhavpandey33/docusense-app:latest .

```

### Run Container
```dockerfile

docker run --name docusense_app --network document-net -it -d -p 80:80 madhavpandey33/docusense-app:latest
```

# AMD
```
docker buildx build --platform linux/amd64 -t madhavpandey33/docusense-app:10_15_amd .
```

