#!/usr/bin/env node

const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const Promise = require('bluebird');
const program = require('commander');
const inquirer = require('inquirer');
const download = Promise.promisify(require('download-git-repo'));

const spinner = ora('正在下载模板...');
program
    .version('1.0.0')
    .command('init <dirname>')
    .action(dirname => {
        if (fs.existsSync(dirname)) {
            return console.log(chalk.red(`dirname ${dirname} is exist`));
        }
        inquirerFn()
            .then(answers => {
                return cloneFn(answers, dirname);
            })
            .then(() => {
                console.log(chalk.green('success'));
            })
            .catch(err => {
                console.log(chalk.red('failed'));
                console.log(err);
            });
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    console.log(chalk.red('no argvs...'));
}

function inquirerFn() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'frame',
            message: '请选择开发用的脚手架:',
            choices: ['react', 'vue']
        },
        {
            type: 'input',
            name: 'name',
            message: '请输入项目名称:'
        },
        {
            type: 'input',
            name: 'description',
            message: '请输入项目简介:'
        }
    ]);
}

function cloneFn(answers, dirname) {
    const { frame, name, description } = answers;
    let url = 'https://github.com:qinhangong/react-scaffold#master'; // 自己写的一个未完的react脚手架
    if (frame === 'vue') {
        url = 'https://github.com:Mrminfive/vue-multiple-page#master'; // git上找的一个vue脚手架
    }
    spinner.start();
    return download(url, dirname, {
        clone: true
    }).then(() => {
        spinner.stop();
        const pkg = process.cwd() + `/${dirname}/package.json`;
        const content = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        content.name = name;
        content.description = description;
        const result = JSON.stringify(content);
        fs.writeFileSync(pkg, result);
    });
}
