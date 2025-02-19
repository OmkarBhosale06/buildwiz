# Buildwiz

A flexible and chainable JavaScript library for generating Dockerfiles dynamically. This library helps developers create Dockerfiles programmatically with support for multi-stage builds, environment variables, labels, health checks, and more.

## Features

- **Multi-Stage Builds**: Reduce image size with multiple build stages.
- **Environment Variables**: Easily define `ENV` variables.
- **Volumes & Labels**: Support for `VOLUME` and `LABEL` instructions.
- **Health Checks**: Add `HEALTHCHECK` instructions to improve container stability.
- **Build Arguments**: Define `ARG` variables for flexible builds.
- **Chainable API**: Improve readability and maintainability.
- **Templating Support**: Future-proof design with support for templating engines.

## Installation

You can install the package via npm:

```sh
npm install buildwiz
```

or via yarn:

```sh
yarn add buildwiz
```

## Usage

### Basic Example
```javascript
const DockerfileWiz = require('buildwiz');

const generator = new DockerfileWiz();
generator
    .from('node:18')
    .workdir('/app')
    .copy('.', '/app')
    .run(['npm install'])
    .expose(3000)
    .cmd(['node', 'server.js'])
    .writeToFile('Dockerfile');
```

### Multi-Stage Build Example
```javascript
const generator = new DockerfileWiz();
generator
    .addStage('builder', 'node:18')
    .workdir('/app')
    .copy('.', '/app')
    .run(['npm install', 'npm run build'])
    .addStage('runtime', 'node:18-alpine')
    .fromStage('runtime')
    .workdir('/app')
    .addCopyFromInstruction('builder', '/app/dist', '/app/dist')
    .expose(3000)
    .setEnv('NODE_ENV', 'production')
    .setHealthcheck('curl -f http://localhost:3000 || exit 1')
    .cmd(['node', 'server.js'])
    .writeToFile('Dockerfile');
```

## API Methods

### Dockerfile Instructions

| Method                         | Description |
|--------------------------------|-------------|
| `from(image)`                  | Sets the base image |
| `addStage(name, image)`        | Adds a named stage for multi-stage builds |
| `fromStage(stageName)`         | Switches to a different stage |
| `workdir(path)`                | Sets the working directory |
| `copy(src, dest)`              | Copies files into the container |
| `addCopyFromInstruction(fromStage, src, dest)` | Copies files from a previous build stage |
| `run(command)`                 | Runs a command in the container |
| `expose(port)`                 | Exposes a port |
| `setEnv(key, value)`           | Defines an environment variable |
| `setHealthcheck(command, options)` | Sets a health check |
| `setUser(user)`                | Sets the user |
| `addVolume(path)`              | Adds a volume |
| `addLabel(key, value)`         | Adds a label |
| `addBuildArg(name, defaultValue)` | Adds a build argument |
| `addOnbuildInstruction(instruction)` | Adds an ONBUILD instruction |
| `setShell(shellArray)`         | Sets a custom shell |
| `cmd(command)`                 | Sets the CMD instruction |
| `writeToFile(outputPath)`      | Writes the Dockerfile to the specified location |

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## License

Copyright (c) 2025 Omkar Bhosale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

Developed by Omkar Ravindra Bhosale.

