# N-API experiments using `node-addon-api`

> Important note: this code works for OSX only. Please update `binding.gyp` `conditions` if you use other operating system.

## Installation

1. Install OpenCV

```bash
brew install opencv@2
brew link --force opencv@2
```

> Please check this [issue](https://github.com/Homebrew/homebrew-core/issues/19286#issuecomment-336164523) first if build of OpenCV fails.

2. Install dependencies

```bash
npm i
```

3. Buld and run

```bash
npm run start:arrays
npm run start:images
```
