#!/usr/bin/env node

const program = require('commander');
const ConfigStore = require('configstore');

const process = require('process');
const { exec } = require('child_process');

program
	.version('0.1.0')
	.option('-a, --add [alias]', 'Add current path as alias. This will replace existed data.', null)
	.option('-d, --delete [alias]', 'Delete alias from store.', null)
    .option('-o, --open [alias]', 'open the alias with code.', null)
    .option('-e, --explorer [alias]', 'open the path with explorer', null)
    .option('-l, --list', 'list all available commands')
	.parse(process.argv);

const config = new ConfigStore('mom');

if (program.add) {
    const val = process.cwd()
    console.log(`[add] ${program.add}=${val}`);
    config.set(program.add, val);
}

if (program.delete) {
    console.log(`Remove alias: ${program.delete}`);
    config.delete(program.delete);
}

if (program.open) {
    const path = config.get(program.open)
    if (!path) {
        console.log('not found.')
        throw new Error('Cannot open path')
    }

    console.log(`Open project: '${program.open}'\nat '${path}' with Code.exe.`);
    // open it
    exec(`code ${path}`, (err, stdout, stderr) => {
        err && console.err(err);
        stdout && console.log(stdout);
        stderr && console.error(stderr);
    })
}

if (program.explorer) {
    const path = config.get(program.explorer);
    console.log(`Explore ${path}`);
    exec(`explorer ${path}`);
}

if (program.list) {
    const keys = Object.keys(config.all);
    console.log(`You have ${keys.length} items:`);
    keys.forEach(key => {
        console.log(`- ${key}=${config.get(key)}`);
    });
}
