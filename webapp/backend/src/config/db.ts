import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//funcion de conexion a la db
export async function connectDB(){
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error);
    process.exit(1);
  }
}

export default pool