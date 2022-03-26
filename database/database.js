const mysql = require('mysql');
const fs = require('fs');


function conectar() {
    var config =
    {
        host: 'happyheartproject.mysql.database.azure.com',
        user: 'happyheartAdmin',
        password: 'hackathon2022.',
        database: 'quickstartdb',
        port: 3306,
        //ssl: {ca: fs.readFileSync("your_path_to_ca_cert_file_BaltimoreCyberTrustRoot.crt.pem")}
    };
    const conn = new mysql.createConnection(config);
    conn.connect(
        function (err) {
            if (err) {
                console.log("!!! Cannot connect !!! Error:");
                throw err;
            }
            else {
                console.log("Conexion establecida a la base de datos.");
            }
        });
};

function readData() {
    conn.query('SELECT * FROM inventory',
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Selected ' + results.length + ' row(s).');
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done.');
        })
    conn.end(
        function (err) {
            if (err) throw err;
            else console.log('Closing connection.')
        });
};
function updateData() {
    conn.query('UPDATE inventory SET quantity = ? WHERE name = ?', [200, 'banana'],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Updated ' + results.affectedRows + ' row(s).');
        })
    conn.end(
        function (err) {
            if (err) throw err;
            else console.log('Done.')
        });
};
function deleteData() {
    conn.query('DELETE FROM inventory WHERE name = ?', ['orange'],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Deleted ' + results.affectedRows + ' row(s).');
        })
    conn.end(
        function (err) {
            if (err) throw err;
            else console.log('Done.')
        });
};

module.exports = {
    "conectar": conectar,
    "readData": readData,
    "updateData": updateData,
    "deleteData": deleteData
}