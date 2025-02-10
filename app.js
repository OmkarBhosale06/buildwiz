const fs = require('fs');
const path = require('path');

class DockerfileWiz {
    constructor(params = {}) {
        this.params = params;
        this.dockerfile = '';
        this.currentStage = null;
    }

    addStage(stageName, baseImage) {
        if (!baseImage) throw new Error("Base image is required for a new stage.");
        this.currentStage = stageName;
        this.dockerfile += `FROM ${baseImage} AS ${stageName}\n`;
        return this;
    }

    fromStage(stageName) {
        this.dockerfile += `FROM ${stageName}\n`;
        return this;
    }

    from(baseImage) {
        if (!baseImage) throw new Error("Base image is required.");
        this.dockerfile += `FROM ${baseImage}\n`;
        return this;
    }

    workdir(workDir) {
        this.dockerfile += `WORKDIR ${workDir}\n`;
        return this;
    }

    copy(src, dest) {
        if (!src || !dest) throw new Error("Source and destination required.");
        this.dockerfile += `COPY ${src} ${dest}\n`;
        return this;
    }

    addCopyFromInstruction(sourceStage, source, destination) {
        if (!sourceStage || !source || !destination) throw new Error("Source stage, source, and destination required.");
        this.dockerfile += `COPY --from=${sourceStage} ${source} ${destination}\n`;
        return this;
    }

    add(src, dest) {
        this.dockerfile += `ADD ${src} ${dest}\n`;
        return this;
    }

    run(command) {
        if (!command) throw new Error("Command required.");
        this.dockerfile += `RUN ${Array.isArray(command) ? command.join(' && ') : command}\n`;
        return this;
    }

    expose(port) {
        if (typeof port !== 'number') throw new Error("Port number must be a valid integer.");
        this.dockerfile += `EXPOSE ${port}\n`;
        return this;
    }

    setEnv(key, value) {
        if (!key) throw new Error("Environment variable key required.");
        this.dockerfile += `ENV ${key}=${value}\n`;
        return this;
    }

    addVolume(volumePath) {
        if (!volumePath) throw new Error("Volume path required.");
        this.dockerfile += `VOLUME ${volumePath}\n`;
        return this;
    }

    addLabel(labels) {
        if (typeof labels !== 'object') throw new Error("Labels should be an object.");
        Object.entries(labels).forEach(([key, value]) => {
            this.dockerfile += `LABEL ${key}="${value}"\n`;
        });
        return this;
    }

    addBuildArg(name, defaultValue = '') {
        if (!name) throw new Error("Build argument name required.");
        this.dockerfile += `ARG ${name}=${defaultValue}\n`;
        return this;
    }

    setUser(user) {
        this.dockerfile += `USER ${user}\n`;
        return this;
    }

    setGroup(group) {
        this.dockerfile += `GROUP ${group}\n`;
        return this;
    }

    setHealthcheck(command, options = {}) {
        const { interval = '30s', timeout = '30s', retries = 3, startPeriod = '0s' } = options;
        if (!command) throw new Error("Healthcheck command required.");
        this.dockerfile += `HEALTHCHECK --interval=${interval} --timeout=${timeout} --retries=${retries} --start-period=${startPeriod} CMD ${command}\n`;
        return this;
    }

    setShell(shellArray) {
        if (!Array.isArray(shellArray) || shellArray.length === 0) {
            throw new Error("Shell must be an array of commands.");
        }
        this.dockerfile += `SHELL ${JSON.stringify(shellArray)}\n`;
        return this;
    }

    addOnbuildInstruction(instruction) {
        if (!instruction) throw new Error("ONBUILD instruction required.");
        this.dockerfile += `ONBUILD ${instruction}\n`;
        return this;
    }

    cmd(command) {
        if (!command) throw new Error("CMD command required.");
        this.dockerfile += `CMD ${JSON.stringify(command)}\n`;
        return this;
    }

    writeToFile(outputPath = 'Dockerfile') {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.resolve(outputPath), this.dockerfile, (err) => {
                if (err) {
                    console.error(`Error writing Dockerfile:`, err);
                    reject(err);
                } else {
                    console.log(`Dockerfile created successfully at ${outputPath}`);
                    resolve();
                }
            });
        });
    }
}



module.exports = DockerfileWiz;