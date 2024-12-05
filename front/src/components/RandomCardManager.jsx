import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { Button, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import cardsData from "../data/cardsData";


const RandomCardManager = () => {
    const [cards, setCards] = useState([]);
    const [randomCard, setRandomCard] = useState(null);
    const [shuffling, setShuffling] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [drawnCards, setDrawnCards] = useState([]);
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        setCards(cardsData);
    }, []);


    // Fonction pour récupérer toutes les cartes (pour le shuffle)
    // const fetchCards = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:4001/api/cards', { withCredentials: true });
    //         setCards(response.data); // Met à jour les cartes pour l'effet de shuffle
    //     } catch (error) {
    //         console.error('Error fetching cards:', error.response?.data || error.message);
    //     }
    // };
    // // Fonction pour récupérer une carte aléatoire (sans duplicata)
    // const fetchRandomCard = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:4001/api/cards/random', { withCredentials: true });
    //         setRandomCard(response.data);  // Carte unique générée pour l'utilisateur
    //     } catch (error) {
    //         console.error('Error fetching card:', error.response?.data || error.message);
    //     }
    // };

    // useEffect(() => {
    //     fetchCards();
    // }, []);

    const getRandomCard = () => {
        // Filtrer les cartes disponibles
        const availableCards = cards.filter((card) => !drawnCards.includes(card));
        if (availableCards.length === 0) {
            alert('Toutes les cartes ont été tirées !');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        return availableCards[randomIndex];
    };

    const toggleTimer = () => {
        if (timerRunning) {
            setTimerRunning(false);
            setTimeLeft(30); // Reset the timer
        } else {
            setTimerRunning(true);
        }
    };

    useEffect(() => {
        let timerInterval;
        if (timerRunning) {
            timerInterval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timerInterval);
                        setTimerRunning(false);
                        return 30; // Reset the timer
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [timerRunning]);

    // Shuffle les cartes de façon aléatoire pour l'effet visuel
    const shuffleAndFetchCard = () => {
        setShuffling(true); // Déclenche l'effet de shuffle

        // Démarrer l'animation de shuffle (en utilisant toutes les cartes)
        const shuffleInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * cards.length);
            setRandomCard(cards[randomIndex]);
        }, 100); // Change la carte toutes les 100ms pour simuler le shuffle

        // Après 2 secondes, arrête le shuffle et affiche une carte réelle
        setTimeout(() => {
            clearInterval(shuffleInterval);
            const newCard = getRandomCard();
            if (newCard) {
                setRandomCard(newCard); // Afficher la nouvelle carte
                setDrawnCards((prevDrawnCards) => [...prevDrawnCards, newCard]); // Ajouter à la liste des tirées
            }
            setShuffling(false); // Arrêter le shuffle
        }, 2000);
    };

    const reshuffleAndFetchCard = () => {
        // Mélanger les cartes restantes et tirer immédiatement
        const availableCards = cards.filter((card) => !drawnCards.includes(card));
        if (availableCards.length === 0) {
            alert('Toutes les cartes ont été tirées !');
            return;
        }

        const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5); // Mélanger
        const newCard = shuffledCards[0]; // Prendre la première carte après mélange
        setRandomCard(newCard);
        setDrawnCards((prevDrawnCards) => [...prevDrawnCards, newCard]); // Ajouter à la liste des tirées
    };
    

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100vh',
                backgroundImage: 'url(https://i.postimg.cc/1tVF7VMx/Fichier-1-4.png)',
                backgroundRepeat: 'repeat',
                backgroundSize: '107px',
                backgroundColor: '#2A0800',
            }}
        >

            <Typography
                variant="h4"
                component="div"
                sx={{
                    color: '#F5F5F5',
                    p: 1,
                    fontFamily: 'Centaur, serif',
                    fontWeight: 'bold',
                    textShadow: "2px 1px 1px rgba(0, 0, 0, 1), 2px 1px 1px rgba(0, 0, 0, 1), -2px 1px 1px rgba(0, 0, 0, 1), -2px -1px 1px rgba(0, 0, 0, 1), 2px 1px 1px rgba(0, 0, 0, 1), 2px 1px 1px rgba(0, 0, 0, 1), -2px 1px 1px rgba(0, 0, 0, 1), -2px -1px 1px rgba(0, 0, 0, 1)",
                    textAlign: 'center',
                    borderRadius: "12px",
                    width: "345px",
                    mb: 1,
                    letterSpacing: '0.1em',
                }}
            >
                {shuffling ? 'Shuffling...' : randomCard && `${randomCard.firstname} ${randomCard.lastname}`}
            </Typography>
            {randomCard || shuffling ? (
                <Box
                    sx={{
                        width: 345,
                        height: 530,
                        overflow: 'hidden',
                        position: 'relative',
                        borderRadius: '12px',
                    }}
                >
                    <Box
                        sx={{
                            animation: shuffling
                                ? 'shuffleAnimation 2s linear infinite'
                                : 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',

                        }}
                    >
                        {randomCard && (
                            <Card
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: '#856A61',
                                    borderRadius: '12px',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="340"
                                    image={randomCard.picture}
                                    sx={{ backgroundColor: "#F5F5F5", }}
                                />
                                <CardContent
                                    sx={{
                                        color: '#F5F5F5',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        p: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <Typography component="span" color="#F5F5F5">
                                            <Typography sx={{ color: "#F5F5F5", fontWeight: 'bold', backgroundColor: "#4EBBFF", borderRadius: "12px", p: 1, display: "inline-block", width: "315px"}}>{randomCard.bonus}
                                            </Typography>
                                        </Typography>
                                        <Typography component="span" color="#F5F5F5">
                                            <Typography sx={{ color: "#F5F5F5", fontWeight: 'bold', backgroundColor: "#930000", borderRadius: "12px", p: 1, display: "inline-block", width: "315px" }}>
                                                {randomCard.malus}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Box>
            ) : null}
            {randomCard ? (
                <Button
                    onClick={toggleTimer}
                    sx={{
                        cursor: 'pointer',
                        padding: 1,
                        borderRadius: '12px',
                        width: 'fit-content',
                        backgroundColor: timerRunning ? "red" : "green",
                        color: '#FFF',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        height: '50px',
                        width: '345px',
                        mt: "1em"
                    }}
                >
                    {timerRunning ? `Time left - ${timeLeft}s` : 'Click to start timer'}
                </Button>) : (
                <Button
                    variant="contained"
                    onClick={shuffleAndFetchCard}
                    sx={{
                        marginTop: '2em',
                        backgroundColor: '#856A61',
                        color: '#F5F5F5',
                        fontWeight: 'bold',
                        height: '50px',
                        boxShadow: "-4px 3px 1px rgba(78, 187, 255, 1), -4px -1px 1px rgba(78, 187, 255, 1), 3px 3px 1px rgba(78, 187, 255, 1), -2px -4px 1px rgba(78, 187, 255, 1), 3px -4px 1px rgba(78, 187, 255, 1)",
                    }}
                >
                    Get Character !
                </Button>)}
                {randomCard && (
                    <Button
                        variant="contained"
                        onClick={reshuffleAndFetchCard}
                        sx={{
                            marginTop: "2em",
                            backgroundColor: '#856A61',
                            color: '#F5F5F5',
                            fontWeight: 'bold',
                            height: '50px',
                            boxShadow: "-4px 3px 1px rgba(78, 187, 255, 1), -4px -1px 1px rgba(78, 187, 255, 1), 3px 3px 1px rgba(78, 187, 255, 1), -2px -4px 1px rgba(78, 187, 255, 1), 3px -4px 1px rgba(78, 187, 255, 1)",
                        }}
                    >
                        Get another character
                    </Button>
                )}

            {/* CSS Keyframes */}
            <style>
                {`
                @keyframes shuffleAnimation {
                    0% { transform: translateY(0); }
                    25% { transform: translateY(-10px); }
                    50% { transform: translateY(10px); }
                    75% { transform: translateY(-5px); }
                    100% { transform: translateY(0); }
                }
                `}
            </style>
        </Box>
    );
};

export default RandomCardManager;
