const BuildFileGenerator = require('../app');
const fs = require('fs');

// Mock fs.writeFile
jest.mock('fs');

describe('BuildFileGenerator', () => {
    let generator;

    beforeEach(() => {
        generator = new BuildFileGenerator();
    });

    test('should generate a basic Dockerfile', () => {
        generator.from('node:18')
            .workdir('/app')
            .copy('.', '/app')
            .run('npm install')
            .expose(3000)
            .cmd(['node', 'server.js']);

        expect(generator.dockerfile).toBe(
            "FROM node:18\n" +
            "WORKDIR /app\n" +
            "COPY . /app\n" +
            "RUN npm install\n" +
            "EXPOSE 3000\n" +
            "CMD [\"node\",\"server.js\"]\n"
        );
    });

    test('should support multi-stage builds', () => {
        generator.addStage('builder', 'node:18')
            .workdir('/app')
            .copy('.', '/app')
            .run(['npm install', 'npm run build'])
            .addStage('runtime', 'node:18-alpine')
            .fromStage('runtime')
            .workdir('/app')
            .addCopyFromInstruction('builder', '/app/dist', '/app/dist')
            .expose(3000)
            .setEnv('NODE_ENV', 'production')
            .cmd(['node', 'server.js']);

        expect(generator.dockerfile).toContain('FROM node:18 AS builder');
        expect(generator.dockerfile).toContain('COPY --from=builder /app/dist /app/dist');
        expect(generator.dockerfile).toContain('EXPOSE 3000');
    });

    test('should write Dockerfile to a file', () => {
        fs.writeFile.mockImplementation((path, data, callback) => callback(null));
        generator.from('node:18').workdir('/app').writeToFile('Dockerfile');

        expect(fs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining('Dockerfile'),
            expect.any(String),
            expect.any(Function)
        );
    });
});
