const DELIMITER = ';'
const NEWLINE = '\n';

function ExportToCSV(company, filename, Year) {
    var rows = []; //Initiate rows array
    //Initiate headers array with the given year and every month
    var headers = [Year, "Januar", "Februar", "Marts", "April", "May", "Juni", 
                  "Juli", "August", "September", "October", "November", "December", NEWLINE];

    rows.push(headers.join(DELIMITER)); // Add headers

    ExtractOmsætningData (company, Year, rows) //Run ExtractOmsætningData function with specific year

    rows[rows.length-1] = rows[rows.length-1] + ";\n" //Add NEWLINE

    ExtractOmkostningData (company, Year, rows) //Run ExtractOmkostningData function with specific year

    DownloadCSVToDisk(rows, filename) //Run "DownloadCSVToDisk" function
};

async function DownloadCSVToDisk(rows, filename) {
    const NEWLINE = '\n';

    //csvContent = each overcategory and its undercategories joined together by NEWLINE
    //This means csvContent is now one long string
    const csvContent = rows.join(NEWLINE);

    // Sanitize and ensure .csv extension
    let safeFilename = filename || 'financial_data';
    safeFilename = safeFilename.replace(/[^a-z0-9_\-]/gi, '_'); // optional: remove unsafe chars

    if (!safeFilename.toLowerCase().endsWith('.csv')) {
        safeFilename += '.csv';
    }


    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function ExtractOmsætningData (company, Year, rows) {
    //Push "omsætning" overcategory name into rows
    rows.push("Omsaetning:")

    //Push undercategory name and the given years' data into rowData array, and join each index
    //in the rowData array with a DELIMITER and push into "rows" array.
    Object.values(company.result.revenue).forEach(metric => {
        let rowData = []
        for (let l = 0; l < metric.data.length; l++) {
            if (Number(metric.data[l].year) === Number(Year)) {
                rowData.push(metric.name)
                Object.values(metric.data[l].months).forEach(r => {
                    rowData.push(r)
                })
                rows.push(rowData.join(DELIMITER));
            }
        }
    });
}

function ExtractOmkostningData (company, Year, rows) {
    //Initiate "rowDataVariabel" array, which will act as "rowData" but
    //for "Variabel Omkostning" overcategory
    let rowDataVariabel = []
    let rowDataFast = [] //Same as "rowDataVariabel" but for "faste omkostninger" overcategory

    //Same as in "ExtractOmsætningData" but checks for "characteristic" first to know which array
    //to place data into
    Object.values(company.result.expense).forEach(metric => {
        let rowData = []
        for (let k = 0; k < metric.data.length; k++) {
            if (Number(metric.data[k].year) === Number(Year)) {
                if (metric.characteristics === "Variabel") {
                    rowData.push(metric.name)
                    Object.values(metric.data[k].months).forEach(r => {
                        rowData.push(r)
                    })
                 rowDataVariabel.push(rowData.join(DELIMITER))
             } else {
                rowData.push(metric.name)
                Object.values(metric.data[k].months).forEach(r => {
                    rowData.push(r)
                })
                rowDataFast.push(rowData.join(DELIMITER))
              }
            }
        }
    });

    rows.push("Variable omkostninger:") //Push overcategory name
    rows.push(rowDataVariabel.join(NEWLINE)) //join "rowDataVariabel" index' with newline and push to "rows"
    rows[rows.length-1] = rows[rows.length-1] + ";\n"

    rows.push("Faste omkostninger:") //push overcategory name
    rows.push(rowDataFast.join(NEWLINE)) //join "rowDataFast" index' with newline and push to "rows"
    rows[rows.length-1] = rows[rows.length-1] + ";\n"
}


console.log("loaded")