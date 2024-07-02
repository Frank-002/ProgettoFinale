import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/routeUtente.js';
import authRoutes from './routes/routeAutenticazione.js';
import postRoutes from './routes/routePost.js';
import commentRoutes from './routes/routeCommento.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

// Connessione a MongoDB tramite Mongoose
mongoose.connect(process.env.MONGO)
  .then(() => console.log('MongoDB CONNESSO!!!'))
  .catch(err => console.log(err));

const __dirname = path.resolve();

const app = express();

// Middleware per gestire il parsing del corpo delle richieste in formato JSON
app.use(express.json());

// Middleware per gestire i cookie
app.use(cookieParser());

// Avvio del server Express sulla porta 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Collegamento delle rotte per gestire gli endpoint relativi agli utenti, all'autenticazione, ai post e ai commenti
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Middleware per servire i file statici della parte client dell'applicazione
app.use(express.static(path.join(__dirname, 'client/dist')));

// Middleware per gestire tutte le altre richieste e inviare il file index.html della parte client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Rotta di base per il controllo del funzionamento del server
app.get('/', (req, res) => {
  res.send("...Node API server...");
});

// Middleware per gestire gli errori, invia una risposta JSON con lo stato e il messaggio dell'errore
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });    
});
