import sql from 'mssql';

// Configuración de conexión segura para AWS RDS
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // OBLIGATORIO para Azure/AWS
    trustServerCertificate: true // Evita errores de certificados autofirmados
  }
};

// Patrón Singleton para evitar saturar conexiones en Serverless
let pool = null;

export const getDb = async () => {
  if (pool) return pool;

  try {
    pool = await sql.connect(sqlConfig);
    console.log('✅ Conexión establecida con SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Error fatal de conexión SQL:', err);
    throw err;
  }
};