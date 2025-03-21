import sql from 'mssql';

const config: sql.config = {
  user: import.meta.env.VITE_MSSQL_USER,
  password: import.meta.env.VITE_MSSQL_PASSWORD,
  server: import.meta.env.VITE_MSSQL_SERVER,
  database: import.meta.env.VITE_MSSQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(config).connect();
    }
    return pool;
  } catch (err) {
    console.error('Failed to connect to MSSQL:', err);
    throw err;
  }
}

export async function query<T>(queryString: string, params?: any[]): Promise<T[]> {
  try {
    const connection = await getConnection();
    const request = connection.request();
    
    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
    }
    
    const result = await request.query(queryString);
    return result.recordset;
  } catch (err) {
    console.error('Failed to execute query:', err);
    throw err;
  }
}