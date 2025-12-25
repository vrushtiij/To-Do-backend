const sql = require('mssql/msnodesqlv8')

const config = {
    connectionString:
    "Driver={ODBC Driver 18 for SQL Server};" +
    "Server=localhost;" +
    "Database=tempdb;" +
    "Trusted_Connection=Yes;" +
    "Encrypt=Yes;" +
    "TrustServerCertificate=Yes;"
};

exports.connect = async () => {
    try{
        await sql.connect(config);
        console.log("Database Connected Successfully")
    }
    catch(err){
        console.log(err);
    }
}

exports.sql = sql;