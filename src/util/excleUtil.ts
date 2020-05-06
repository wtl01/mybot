import { dateFormat } from "./dateUtil";
import excel = require('node-excel-export');
import * as fs from 'fs';
const styles = {
    headerDark: {
        font: {
            color: {
                rgb: '#000000'
            },
            sz: 14,
            bold: true,
        }
    },
};
const specification = {
    name: { // <- the key should match the actual data key
        displayName: '姓名', // <- Here you specify the column header
        headerStyle: styles.headerDark, // <- Header style
        width: 180 // <- width in pixels
    },
    sendtime: {
        displayName: '读经时间',
        headerStyle: styles.headerDark,
        width: 180
    }
}


export async function writeExcle(data,name){
    let dataset = data;
    const report = excel.buildExport(
        [ 
            {
                name: '名单', 
                specification: specification, 
                data: dataset 
            }
        ]
    );
    await fs.writeFile('d:/'+name+'.xlsx', report,  function(err) {
        if (err) {
            return console.error(err);
        }
    })
}