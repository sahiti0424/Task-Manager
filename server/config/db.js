import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper to test database connection and print useful debugging tips
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully.');
    
    // Verify tables exist
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log(`📌 Found tables: [${tableNames.join(', ')}]`);
    
    if (tableNames.length === 0) {
      console.warn('⚠️ Warning: Database is empty! Please run the SQL queries in `server/database/schema.sql` inside MySQL Workbench.');
    }
    
    connection.release();
  } catch (err) {
    console.error('❌ Failed to connect to MySQL database.');
    console.error('----------------------------------------------------');
    console.error(`Error details: ${err.message}`);
    console.error('----------------------------------------------------');
    console.error('💡 Trouble-shooting tips:');
    console.error('1. Make sure your MySQL server is running (check MySQL Workbench or System Preferences).');
    console.error('2. Verify that the credentials in `server/.env` are correct.');
    console.error('3. Verify that the database `student_management_db` exists. If not, create it:');
    console.error('   `CREATE DATABASE student_management_db;`');
    console.error('----------------------------------------------------');
  }
};

export default pool;
