import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
} from '@mui/material';

export default function CardManager() {
    const [cards, setCards] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        picture: '',
        bonus: '',
        malus: ''
    });

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/cards');
            setCards(response.data);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const handleDelete = async (cardId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:4001/api/cards/${cardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchCards();
        } catch (error) {
            console.error('Error deleting card:', error.response?.data || error.message);
        }
    };

    const handleEditClick = (card) => {
        setIsAddMode(false);
        setCurrentCard(card);
        setFormData({
            firstname: card.firstname,
            lastname: card.lastname,
            picture: card.picture,
            bonus: card.bonus,
            malus: card.malus
        });
        setOpen(true);
    };

    const handleAddClick = () => {
        setIsAddMode(true);
        setFormData({
            firstname: '',
            lastname: '',
            picture: '',
            bonus: '',
            malus: ''
        });
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setCurrentCard(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            if (isAddMode) {
                await axios.post(`http://localhost:4001/api/cards`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.put(`http://localhost:4001/api/cards/${currentCard._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            fetchCards();
            handleDialogClose();
        } catch (error) {
            console.error('Error updating or adding card:', error.response?.data || error.message);
        }
    };

    return (
        <Container sx={{ mt: "5.5em" }}>
            <Typography variant="h4" gutterBottom>
                Card Manager
            </Typography>
            <Button variant="contained" onClick={handleAddClick} sx={{ mb: 2, backgroundColor: "#29a929", color: "white" }}>
                Create Card
            </Button>
            <Divider sx={{ width: 135 }} />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Picture</TableCell>
                            <TableCell>Bonus</TableCell>
                            <TableCell>Malus</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cards.map((card) => (
                            <TableRow key={card._id}>
                                <TableCell>{card._id}</TableCell>
                                <TableCell>{card.firstname}</TableCell>
                                <TableCell>{card.lastname}</TableCell>
                                <TableCell>
                                    <img src={card.picture} alt={card.firstname} width="50" height="50" />
                                </TableCell>
                                <TableCell>{card.bonus}</TableCell>
                                <TableCell>{card.malus}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{ marginRight: '1em' }}
                                        onClick={() => handleEditClick(card)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: 'red', color: 'white' }}
                                        onClick={() => handleDelete(card._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for editing card */}
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>{isAddMode ? "Add Card" : "Edit Card"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="First Name"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Picture URL"
                        name="picture"
                        value={formData.picture}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Bonus"
                        name="bonus"
                        value={formData.bonus}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Malus"
                        name="malus"
                        value={formData.malus}
                        onChange={handleFormChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        {isAddMode ? "Add" : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
