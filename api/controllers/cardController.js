const Card = require("../models/cardModel");

// Récupérer toutes les cartes
exports.getAllCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Récupérer une carte par son ID
exports.getCardById = async (req, res) => {
    const cardId = req.params.id;
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Créer une nouvelle carte
exports.createCard = async (req, res) => {
    
    const { firstname, lastname, picture, bonus, malus } = req.body;
    try {
        const newCard = new Card({
            firstname,
            lastname,
            picture,
            bonus,
            malus,
        });
        const savedCard = await newCard.save();
        res.status(201).json({ message: "Card created", card: savedCard });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.error('Erreur serveur :', error);
    }
};

// Mettre à jour une carte
exports.updateCard = async (req, res) => {
    const cardId = req.params.id;
    const { firstname, lastname, picture, bonus, malus } = req.body;
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        card.firstname = firstname;
        card.lastname = lastname;
        card.picture = picture;
        card.bonus = bonus;
        card.malus = malus;
        const updatedCard = await card.save();
        res.status(200).json({ message: "Card updated", card: updatedCard });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Supprimer une carte
exports.deleteCard = async (req, res) => {
    const cardId = req.params.id;
    try {
        const deletedCard = await Card.findByIdAndDelete(cardId);
        if (!deletedCard) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.status(200).json({ message: "Card deleted", card: deletedCard });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
