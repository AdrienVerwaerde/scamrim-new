const express = require('express');
const swaggerJSDocs = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
const port = 4001;

require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

const Card = require('./models/cardModel');
const session = require('express-session');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
}));

let sessions = {}; // In-memory session store (remplacer par une base de données dans un vrai projet)

// Créer une session et retourner un QR code
app.post('/api/sessions', async (req, res) => {
    const sessionId = uuidv4();
    sessions[sessionId] = { players: [] };

    const sessionUrl = `http://localhost:3000/session/${sessionId}`;
    try {
        const qrCode = await QRCode.toDataURL(sessionUrl); // Génère le QR code
        res.status(201).json({ sessionId, qrCode });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du QR code.' });
    }
});

// Rejoindre une session
app.post('/api/sessions/:sessionId/join', (req, res) => {
    const { sessionId } = req.params;
    const { playerName } = req.body;

    if (!sessions[sessionId]) {
        return res.status(404).json({ error: 'Session introuvable.' });
    }

    sessions[sessionId].players.push({ playerName });
    res.status(200).json({ message: 'Rejoint la session.', session: sessions[sessionId] });
});

// Récupérer les informations d'une session
app.get('/api/sessions/:sessionId', (req, res) => {
    const { sessionId } = req.params;

    if (!sessions[sessionId]) {
        return res.status(404).json({ error: 'Session introuvable.' });
    }

    res.status(200).json(sessions[sessionId]);
});

// Utilisation de express-session pour gérer les sessions
app.use(session({
    secret: 'randomizer-secret',  // Secret pour signer la session
    resave: false,                // Ne pas enregistrer la session si elle n'a pas été modifiée
    saveUninitialized: true,      // Sauvegarde une session même si elle n'est pas encore utilisée
    cookie: { secure: false },    // Pour développement local, sécuriser pour prod avec HTTPS
}));

// Route pour obtenir une carte aléatoire depuis la base de données
app.get('/api/cards/random', async (req, res) => {
    if (!req.session.assignedCards) {
        req.session.assignedCards = [];  // Si aucune carte n'a été assignée, initialise un tableau vide
    }

    try {
        // Filtrer les cartes déjà attribuées dans la session
        const availableCards = await Card.find({
            _id: { $nin: req.session.assignedCards }  // Exclure les cartes déjà attribuées
        });

        if (availableCards.length === 0) {
            return res.status(400).json({ message: 'All cards have been assigned!' });
        }

        // Sélectionner une carte aléatoire parmi celles disponibles
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

        // Ajouter la carte sélectionnée à la session pour éviter la duplication
        req.session.assignedCards.push(randomCard._id);

        // Répondre avec la carte sélectionnée
        res.json(randomCard);
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ message: 'Error fetching card' });
    }
});

// Réinitialiser la session
app.get('/api/reset', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Session reset.' });
    });
});

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

/* Swagger Options */

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'NodeJS B3',
            version: '1.0.0',
            description: 'API du chef',
        },
        servers: [
            {
                url: 'http://localhost:4001/api',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http', // Type of security
                    scheme: 'bearer', // This is a bearer authentication
                    bearerFormat: 'JWT', // Format of the token
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
        apis: [
            `${__dirname}/routes.js`,
            `${__dirname}/routes/*.js`,
            `${__dirname}/models/*.js`,
            `${__dirname}/controllers/*.js`
        ],
};

const swaggerDocs = swaggerJSDocs(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to the database

mongoose.connect(mongoURI, {})
    .then(() => console.log('Connexion a MongoDB reussie !'))
    .catch((err) => console.log('Connexion a MongoDB echouée : ' + err));

app.get('/', (req, res) => {
    res.send('Hello World !');
})

app.listen(port, () => {
    console.log(`Serveur en ligne port ${port}`);
});