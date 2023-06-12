export default class GoCsv {
    constructor(){
    }
    
    loadFileOnChange(fieldId, callback){
        document.getElementById(fieldId).addEventListener('change', function(e){
            let csvFile = e.target.files[0];
            const csvReader = new FileReader();
            csvReader.onload = function(e){
                const rawData = e.target.result;
                const lines = rawData.split('\n');
                let csvObjects = [];
                let headers = [];
                for(let i=0;i<lines.length;i++){
                    const tokens = lines[i].match(/(?:"([^"]*)")|([^,\s]+)/g).map(field => field.replace(/"/g, ''));
                    if(i===0){
                        headers = tokens;
                    } else {
                        csvObjects[i-1] = {};
                        for(let j=0;j<headers.length;j++){
                            csvObjects[i-1][headers[j]] = tokens[j];
                        }   
                    }
                }
                callback(csvObjects);
            };
            csvReader.readAsText(csvFile);
        }, false);
    }

    csvForDownload(filename, csvObjects){
        let csvData = "";
        for(let i=0;i<csvObjects.length;i++){
            if(i===0){
                csvData += Object.keys(csvObjects[i]).map(header => {
                    if (typeof header === 'string') {
                      // Escape single and double quotes by doubling them
                      header = header.replace(/"/g, '""');
                      if (header.includes(',') || header.includes('"')) {
                        // Enclose the header in double quotes if it contains a comma or double quote
                        header = `"${header}"`;
                      }
                    }
                    return header;
                  }).join(',') + '\n';
            }
            csvData += Object.values(csvObjects[i]).map(value => {
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""');
                    if (value.includes(',') || value.includes('"')) {
                    value = `"${value}"`;
                    }
                }
                return value;
                }).join(',') + '\n';
        }
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
    }
}
