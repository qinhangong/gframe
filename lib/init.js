const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const Promise = require('bluebird');
const inquirer = require('inquirer');
const download = Promise.promisify(require('download-git-repo'));

const spinner = ora('正在下载模板...');

// 命令行交互配置
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

/**
 * 从github上下载已有的模版
 * @param answers 命令行收集到的交互信息
 * @param dirname 最终生成的项目名
 */
function downloadFn(answers, dirname) {
    const { frame, name = dirname, description = dirname } = answers;
    // 从github上找了两个star比较多的脚手架模版,一个react,一个vue
    let url = 'https://github.com:bodyno/react-starter-kit#master';
    if (frame === 'vue') {
        url = 'https://github.com:Mrminfive/vue-multiple-page#master';
    }
    spinner.start();
    download(url, dirname, { clone: false })
        .then(() => {
            spinner.stop();
            console.log(chalk.green('download template success'));

            // 重写package中的name、description等项目信息
            const pkg = process.cwd() + `/${dirname}/package.json`;
            const content = JSON.parse(fs.readFileSync(pkg, 'utf8'));
            content.name = name;
            content.description = description;
            const result = JSON.stringify(content);
            fs.writeFileSync(pkg, result);
        })
        .catch(err => {
            spinner.stop();
            console.log(chalk.red('download template failed'));
            console.log(err);
        });
}

module.exports = {
    inquirerFn,
    downloadFn
};
