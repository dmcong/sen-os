const fs = require('fs-extra')
const path = require('path')
const prompts = require('prompts')
const replace = require('replace-in-file')
const { printInfo } = require('./print')

const validateAppName = (appName) => {
  if (!appName || typeof appName !== 'string') return 'Please input app name!'
  const folderName = appName.replace(' ', '_').toLowerCase()
  const dirName = path.join(__dirname, '../src/applications', folderName)
  if (fs.existsSync(dirName))
    return 'The name has been occupied, please choose another one!'
  return true
}

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const main = async () => {
  // Promt inputs
  prompts.override(require('yargs').argv)
  const { template, appName, authorName, authorEmail } = await prompts([
    {
      type: 'select',
      name: 'template',
      message: 'Which template do you want to use?',
      choices: [
        { title: 'Javascript', value: 'plain_js' },
        { title: 'Typescript', value: 'plain_ts' },
      ],
    },
    {
      type: 'text',
      name: 'appName',
      message: 'What is your application name (e.g. My Example)?',
      validate: (value) => validateAppName(value),
    },
    {
      type: 'text',
      name: 'authorName',
      message: 'What is your full name?',
      validate: (value) => (value ? true : 'Please input your name!'),
    },
    {
      type: 'text',
      name: 'authorEmail',
      message: 'What is your email?',
      validate: (value) => validateEmail(value) || 'Invalid email!',
    },
  ])
  // Clone template
  const id = appName.replace(' ', '_').toLowerCase()
  const src = path.join(__dirname, './templates', template)
  const dst = path.join(__dirname, '../src/applications', id)
  await fs.copy(src, dst)
  // Apply params
  const parttern = dst + '/**'
  await replace({ files: parttern, from: /__APP_NAME__/g, to: appName })
  await replace({ files: parttern, from: /__app_name__/g, to: id })
  await replace({ files: parttern, from: /__author_name__/g, to: authorName })
  await replace({ files: parttern, from: /__author_email__/g, to: authorEmail })
  // Success
  printInfo(`🎉🎉🎉 Your project sucessfully landed at ${dst}`)
}

main()
