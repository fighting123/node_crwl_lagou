var xlsx = require('node-xlsx');
var fs = require('fs');

function exportExcel() {
  let list = fs.readdirSync('./data')
  let dataArr = []
  list.forEach((item, index) => {
    let path = `./data/${item}`
    let obj = fs.readFileSync(path, 'utf-8')
    let content = JSON.parse(obj).content.positionResult.result
    let arr = [['companyFullName', 'createTime', 'workYear', 'education', 'city', 'positionName', 'positionAdvantage', 'companyLabelList', 'salary']]
    content.forEach((contentItem) => {
      arr.push([contentItem.companyFullName, contentItem.phone, contentItem.workYear, contentItem.education, contentItem.city, contentItem.positionName, contentItem.positionAdvantage, contentItem.companyLabelList.join(','), contentItem.salary])
    })
    dataArr[index] = {
      data: arr,
      name: path.split('./data/')[1] // 名字不能包含 \ / ? * [ ]
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