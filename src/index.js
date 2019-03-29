#!/usr/bin/env node

const program = require('commander');
const ConfigStore = require('configstore');

const process = require('process');
const { exec } = require('child_process');

program
	.version('0.1.0')
	.option('-a, --add, add [alias]', 'Add current path as alias. This will replace existed data.', null)
	.option('-d, --delete, delete [alias]', 'Delete alias from store.', null)
    .option('-o, --open, open [alias]', 'open the alias with code.', null)
    .option('-l, --list, list', 'list all available commands')
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

if (program.code) {
    const path = config.get(program.code)
    if (!path) {
        console.log('not found.')
        return;
    }

    console.log(`Open project: '${program.code}'\nat '${config[program.code]}' with Code.exe.`);
    // open it
    exec(`code ${path}`, (err, stdout, stderr) => {
        err && console.err(err);
        stdout && console.log(stdout);
        stderr && console.error(stderr);
    })
}

if (program.list) {
    const keys = Object.keys(config.all);
    console.log(`You have ${keys.length} items:`);
    keys.forEach(key => {
        console.log(`- ${key}=${config.get(key)}`);
    });
}

console.log('[done]');
