const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authToken = require('../middlewares/authToken');


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Gestion des cartes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - picture
 *         - bonus
 *         - malus
 *       properties:
 *         id:
 *           type: string
 *           description: L'ID auto-généré de la carte
 *         firstname:
 *           type: string
 *           description: Le prénom de la carte
 *         lastname:
 *           type: string
 *           description: Le nom de famille de la carte
 *         picture:
 *           type: string
 *           description: URL de l'image de la carte
 *         bonus:
 *           type: string
 *           description: Bonus de la carte
 *         malus:
 *           type: string
 *           description: Malus de la carte
 *       example:
 *         id: d5fE_asz
 *         firstname: John
 *         lastname: Doe
 *         picture: https://example.com/image.jpg
 *         bonus: Speed Boost
 *         malus: Low Defense
 */

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Récupérer toutes les cartes
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: La liste de toutes les cartes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
router.get('/', cardController.getAllCards);

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Récupérer une carte par ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la carte
 *     responses:
 *       200:
 *         description: Détails de la carte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Carte non trouvée
 */
router.get('/:id', cardController.getCardById);

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Créer une nouvelle carte
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Carte créée avec succès
 *       400:
 *         description: Erreur de validation des données
 */
router.post('/', authToken, cardController.createCard);

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Mettre à jour une carte existante
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la carte à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Carte mise à jour avec succès
 *       404:
 *         description: Carte non trouvée
 *       400:
 *         description: Erreur de validation des données
 */
router.put('/:id', authToken, cardController.updateCard);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Supprimer une carte
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []  # Protection par token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la carte à supprimer
 *     responses:
 *       200:
 *         description: Carte supprimée avec succès
 *       404:
 *         description: Carte non trouvée
 */
router.delete('/:id', authToken, cardController.deleteCard);

module.exports = router;
