const defaultArgv = require('./defaultArgv.json')
const requsetCrwl = require('./requestCrwl.js')
const async = require('async')

if (process.argv.length === 4) {
  let args = process.argv
  console.log('准备开始请求' + args[2] + '的' + args[3] + '职位数据');
  requsetCrwl.controlRequest(args[2], args[3])
} else if (process.argv.length === 3 && process.argv[2] === 'start') {
  let arr = []
  for (let i = 0; i < defaultArgv.city.length; i++) {
    for (let j = 0; j < defaultArgv.position.length; j++) {
      let obj = {}
      obj.city = defaultArgv.city[i]
      obj.position = defaultArgv.position[j]
      arr.push(obj)
    }
  }
  async.mapSeries(arr, function (item, callback) {
    console.log('准备开始请求' + item.city + '的' + item.position + '职位数据');
    requsetCrwl.controlRequest(item.city, item.position, callback)
  }, function (err) {
    if (err) throw err
  })
} else {
  console.log('请正确输入要爬取的城市和职位，正确格式为："node index 城市 关键词" 或 "node index start" 例如："node index 北京 php" 或"node index start"')
}