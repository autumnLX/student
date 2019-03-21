const readline = require('readline');
const fs = require('fs');
const path = require('path');

const dev_login = require('./template/dev_login.js')
const config_index = require('./template/config_index')
const gitmodules = require('./template/gitmodule')
const config = require('./config')
const dev_login_host = require('./template/dev_login_config')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function a(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function create(configs, module_fn, path) {
  fs.writeFileSync(path, module_fn.apply(this, configs), function (err) {
    if (err) {
      Promise.reject(err)
    } else {
      Promise.resolve(1)
    }
  })
}

async function b() {
  const name = await a('输入配置姓名：')
  const _config = config[name]
  await create([_config.dev_login_phone, _config.dev_login_password], dev_login, path.join(__dirname, '../src/config/dev_login.json'))
  await create([_config.work_path], config_index, path.join(__dirname, '../config/index.js'))
  await create([_config.ui_git_path], gitmodules, path.join(__dirname, '../.gitmodules'))
  await create([_config.dev_host, _config.dev_port], dev_login_host, path.join(__dirname, '../config/dev_login.config.js'))
  process.exit(0)
}
b()
