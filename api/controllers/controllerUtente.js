import User from "../models/Utente.js";
import { errorHandler } from "../utils/error.js";

/**
 * Elimina un utente.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente userId come parametro.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const eliminaUtente = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "...Non autorizzato..."));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("...Utente eliminato...");
  } catch (error) {
    next(error);
  }
};

/**
 * Esegue il logout dell'utente.
 * 
 * @param {Object} req - L'oggetto della richiesta.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("Utente scollegato");
  } catch (error) {
    next(error);
  }
};

/**
 * Recupera gli utenti.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente parametri di query opzionali per paginazione e ordinamento.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "...Non autorizzato..."));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Recupera un utente per ID.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente userId come parametro.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "...Utente non trovato..."));
    }

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/**
 * Aggiorna un utente.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente userId come parametro e i dati aggiornati nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const aggiornaUtente = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "...Non autorizzato..."));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "...La password deve essere lunga almeno 6 caratteri...")
      );
    }
  }

  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 18) {
      return next(
        errorHandler(400, "...L'username deve essere lungo tra i 6 e 18 caratteri...")
      );
    }

    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "...L'username non deve contenere spazi..."));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "...L'username deve essere tutto minuscolo..."));
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "...L'username deve contenere solo lettere e numeri...")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/**
 * Test API.
 * 
 * @param {Object} req - L'oggetto della richiesta.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 */
export const test = (req, res) => {
  res.json({ message: "...Test per controllo API..." });
};
