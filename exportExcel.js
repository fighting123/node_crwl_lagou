var xlsx = require('node-xlsx');
var fs = require('fs');

function exportExcel() {
  let list = fs.readdirSync('./data')
  let dataArr = []
  list.forEach((item, index) => {
    let path = `./data/${item}`
    let obj = fs.readFileSync(path, 'utf-8')
    let content = JSON.parse(obj).content.hrInfoMap
    let arr = [['UserId', 'Phone', 'PositionName', 'ReceiveEmail', 'RealName', 'Portrait', 'CanTalk', 'UserLevel']]
    for (var item in content) {
      let data = content[item]
      arr.push([data.userId, data.phone, data.positionName, data.receiveEmail, data.realName, data.portrait, data.canTalk,  data.userLevel])
    }
    dataArr[index] = {
      data: arr,
      name: path.split('./data/')[1] // 名字不能包含 /
    }
  })

// 数据格式
// var data = [
//   {
//     name : 'sheet1',
//     data : [
//       [
//         'ID',
//         'Name',
//         'Score'
//       ],
//       [
//         '1',
//         'Michael',
//         '99'
//
//       ],
//       [
//         '2',
//         'Jordan',
//         '98'
//       ]
//     ]
//   },
//   {
//     name : 'sheet2',
//     data : [
//       [
//         'AA',
//         'BB'
//       ],
//       [
//         '23',
//         '24'
//       ]
//     ]
//   }
// ]

// 写xlsx
  var buffer = xlsx.build(dataArr)
  fs.writeFile('./result.xlsx', buffer, function (err)
    {
      if (err)
        throw err;
      console.log('Write to xls has finished');

// 读xlsx
//     var obj = xlsx.parse("./" + "resut.xls");
//     console.log(JSON.stringify(obj));
    }
  );
}
exports.exportExcel = exportExcel