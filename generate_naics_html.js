// This script generates an HTML table from NAICS CSV data
const fs = require('fs');

// Read CSV data from file
const csvData = fs.readFileSync('naics.csv', 'utf8');

// Parse CSV string into array of objects
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header =>
        header.replace(/^"/, '').replace(/"$/, '')
    );

    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
        // Handle commas within quoted strings
        const values = [];
        let currentValue = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue.replace(/^"/, '').replace(/"$/, ''));
                currentValue = '';
            } else {
                currentValue += char;
            }
        }

        values.push(currentValue.replace(/^"/, '').replace(/"$/, ''));

        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });

        return obj;
    });
}

// Generate HTML table rows
function generateTableRows(data) {
    return data.map(item => {
        return `            <tr>
                <td>${item.Code}</td>
                <td>${item.Description}</td>
                <td>${item.Level}</td>
                <td>${item.Parent_Code}</td>
            </tr>`;
    }).join('\n');
}

// Generate the complete HTML
function generateHTML(data) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAICS Codes</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            margin: 20px;
            background-color: #f9f9f9;
            color: #333;
        }

        h1 {
            text-align: center;
            color: #444;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            background-color: #fff;
        }

        th,
        td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        th {
            background-color: #f2f2f2;
            font-weight: 600;
            color: #555;
        }

        tr:hover {
            background-color: #f5f5f5;
        }

        td:first-child,
        th:first-child {
            width: 10%;
            /* Adjust width for Code */
        }

        td:nth-child(2),
        th:nth-child(2) {
            width: 60%;
            /* Adjust width for Description */
        }

        td:nth-child(3),
        th:nth-child(3) {
            width: 15%;
            /* Adjust width for Level */
        }

        td:nth-child(4),
        th:nth-child(4) {
            width: 15%;
            /* Adjust width for Parent Code */
        }
    </style>
</head>

<body>
    <h1>NAICS Code Listing</h1>
    
    <table>
        <thead>
            <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Level</th>
                <th>Parent Code</th>
            </tr>
        </thead>
        <tbody>
${generateTableRows(data)}
        </tbody>
    </table>
</body>

</html>`;
}

// Parse the CSV and generate HTML
const parsedData = parseCSV(csvData);
const html = generateHTML(parsedData);

// Write the HTML to a file
fs.writeFileSync('index.html', html);
console.log('Successfully generated new_naics.html with all NAICS codes from naics.csv'); 