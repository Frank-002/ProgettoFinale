import User from "../models/Utente.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

/**
 * Gestisce il login dell'utente.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente email e password nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "...Sono richiesti tutti i campi..."));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "...Utente non trovato..."));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid pasword!"));
    }

    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res.status(200).cookie("jwt-token", token, {
      httpOnly: true,
      /*SameSite: 'strict'  Questo attributo del cookie impedisce che il cookie venga inviato insieme alle
      richieste cross-site. Significa che il cookie verrà inviato solo se la richiesta proviene dal sito stesso,
      non da altri siti. Protegge il cookie contro attacchi di tipo Cross-Site Scripting (XSS), impedendo che script
      dannosi accedano al cookie.  */
      SameSite: 'strict',
      //Questo attributo(secure: false) indica che il cookie può essere inviato sia tramite connessioni HTTP che HTTPS.
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 12) //12 ore dalla creazione
    })
        .json(rest);
  } catch (error) {
    next(error);
  }
};

/**
 * Gestisce l'autenticazione tramite Google.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente nome, email e googlePhotoUrl nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;

      res.status(200).cookie("access_token", token, {
        httpOnly: true,
        SameSite: 'strict',
        secure: false,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 12) //12 ore dalla creazione
      })
          .json(rest);
    } else {
      const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);

      const passwordCriptata = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
            name.toLowerCase().split(" ").join("") +
            Math.random().toString(9).slice(-4),
        email,
        password: passwordCriptata,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      const token = jwt.sign(
          {
            id: newUser._id,
            isAdmin: newUser.isAdmin,
          },
          process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;

      res.status(200).cookie("access_token", token, {
        httpOnly: true,
        SameSite: 'strict',
        secure: false,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 12)
      })
          .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Gestisce la registrazione di un nuovo utente.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente username, email e password nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const registrazione = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    next(errorHandler(400, "...Sono richiesti tutti i campi..."));
  }

  const passwordCriptata = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: passwordCriptata,
  });

  try {
    await newUser.save();
    res.json("...Registrazione effettuata con successo...");
  } catch (error) {
    next(error);
  }
};
