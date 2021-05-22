require('dotenv').config()
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const fetch = require('node-fetch')
const fs = require('fs')
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
// always place a ';' on the line before this 
(async() => {
  const lastIP = fs.readFileSync('./ip.txt', 'utf8')
  const currentIP = await fetch('http://ifconfig.me/all.json')
    .then(res => res.json())
    .then(data => data.ip_addr)
  console.log('lastIP =', lastIP)
  console.log('currentIP =', currentIP)
  if (lastIP.trim() === currentIP) {
    console.log('up to date')
    return
  }
  console.log('ip has changed')
  fs.writeFile('readme.txt', currentIP, (err) => {
    if (err) {
      console.log(err)
      return
    }
    fs.readFileSync('./ip.txt', 'utf8')
    console.log('ip updated')
    client.messages
      .create({
        body: 'Your Home IP has changed',
        from: TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER
      })
      .catch(err => console.log(err))
  })
})()
