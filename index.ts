import app from './src/app'
import dotenv from 'dotenv' 

dotenv.config()

const PORT = process.env.PORT || 3000

const start = async() => { 
  console.log("Server test ready at: http://localhost:", PORT, "\n");
  app.listen(PORT); 
}

start();