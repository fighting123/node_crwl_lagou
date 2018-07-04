const async = require('async')
const superagent = require('superagent')
const options = require('./options')
const fs = require('fs')
const exportExcel = require('./exportExcel')

function controlRequest(city, position, indexCallback) {
  let totalPage = 0;
  let urls = []
  let num = 0
  let ok = 0
  async.series([
    // 先获取总页数
    (cb) => {
      superagent
        .post(`https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false&city=${city}&kd=${position}&pn=1`)
        .send({
          'pn': totalPage,
          'kd': position,
          'first': true
        })
        .set(options.options)
        .end((err, res) => {
          if (err) throw err
          // console.log(res.text)
          let resObj = JSON.parse(res.text)
          if (resObj.success === true) {
            totalPage = resObj.content.positionResult.totalCount;
            cb(null, totalPage);
          } else {
            console.log(`获取数据失败:${res.text}}`)
          }
        })
    },
    // 拿到每一次请求需要的url放入urls中
    (cb) => {
      for (let i=0;Math.ceil(i<totalPage/15);i++) {
        urls.push(`https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false&city=${city}&kd=${position}&pn=${i}`)
      }
      console.log(`${city}的${position}职位共${totalPage}条数据，${urls.length}页`);
      cb(null, urls);
    },
    // 控制并发为3
    (cb) => {
      async.mapLimit(urls, 3, (url, callback) => {
        num++;
        let page = url.split('&')[3].split('=')[1];
        superagent
          .post(url)
          .send({
            'pn': totalPage,
            'kd': position,
            'first': true
          })
          .set(options.options)
          .end((err, res) => {
            if (err) throw err
            let resObj = JSON.parse(res.text)
            if (resObj.success === true) {
              console.log(`正在抓取第${page}页，当前并发数量：${num}`);
              if (!fs.existsSync('./data')) {
                fs.mkdirSync('./data');
              }
              // 将数据以.json格式储存在data文件夹下
              fs.writeFile(`./data/${city}_${position}_${page}.json`, res.text, (err) => {
                if (err) throw err;
                // 写入数据完成后，两秒后再发送下一次请求
                setTimeout(() => {
                  num--;
                  console.log(`第${page}页写入成功`);
                  callback(null, 'success');
                }, 2000);
              });
            }
          })
      }, (err, result) => {
        if (err) throw err;
        // 这个arguments是调用controlRequest函数的参数，可以区分是那种爬取（循环还是单个）
        if (arguments[2]) {
          ok = 1;
        }
        cb(null, ok)
      })
    },
    () => {
      if (ok) {
        setTimeout(function () {
          console.log(`${city}的${position}数据请求完成`);
          indexCallback(null);
        }, 5000);
      } else {
        console.log(`${city}的${position}数据请求完成`);
      }
      exportExcel.exportExcel()
    }
  ], (err, result) => {
    if (err) throw err
  })
}

exports.controlRequest = controlRequest;