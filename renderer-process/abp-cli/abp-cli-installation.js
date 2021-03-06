const exec = require('child_process').exec

let isRunning = false

let installConsoleNode = document.getElementById('box-abp-cli-cli-install').getElementsByTagName('textarea')[0]
let updateConsoleNode = document.getElementById('box-abp-cli-cli-update').getElementsByTagName('textarea')[0]

const installExecBtn = document.getElementById('cli-install-execute')
const updateExecBtn = document.getElementById('cli-update-execute')

installExecBtn.addEventListener('click', (event) => {
  runExec('install')
})

updateExecBtn.addEventListener('click', (event) => {
  runExec('update')
})

function runExec(action) {
  if (isRunning) return
  isRunning = true

  let execBtn, consoleNode
  if (action === 'install') {
    execBtn = installExecBtn
    consoleNode = installConsoleNode
  } else if (action === 'update') {
    execBtn = updateExecBtn
    consoleNode = updateConsoleNode
  } else {
    return
  }

  execBtn.disabled = true
  document.getElementById('cli-' + action + '-process').style.display = 'block'

  let cmdStr = 'dotnet tool ' + action + ' -g Volo.Abp.Cli'
  clearConsoleContent()
  addConsoleContent(cmdStr + '\n\nRunning...\n')
  scrollConsoleToBottom()
  console.log(cmdStr)
  workerProcess = exec('chcp 65001 & ' + cmdStr, {cwd: '/'})
  
  workerProcess.stdout.on('data', function (data) {
    addConsoleContent(data)
    scrollConsoleToBottom()
  });
 
  workerProcess.stderr.on('data', function (data) {
    addConsoleContent(data)
    scrollConsoleToBottom()
  });
 
  workerProcess.on('close', function (code) {
    isRunning = false
    execBtn.disabled = false
  })

  function scrollConsoleToBottom() {
    consoleNode.scrollTo(0, consoleNode.scrollHeight)
  }

  function addConsoleContent(text) {
    consoleNode.appendChild(document.createTextNode(text))
  }

  function clearConsoleContent() {
    consoleNode.innerHTML = ''
  }
}