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

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:4001/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error.response?.data || error.message);
        }
    };

    const handleEditClick = (user) => {
        setIsAddMode(false);
        setCurrentUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role
        });
        setOpen(true);
    };

    const handleAddClick = () => {
        setIsAddMode(true);
        setFormData({
            username: '',
            email: '',
            password: '',
            role: ''
        });
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setCurrentUser(null);
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
                await axios.post(`http://localhost:4001/api/users`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.put(`http://localhost:4001/api/users/${currentUser._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            fetchUsers();
            handleDialogClose();
        } catch (error) {
            console.error('Error updating or adding user:', error.response?.data || error.message);
        }
    };

    return (
        <Container sx={{ mt: "2em" }}>
            <Typography variant="h4" gutterBottom>
                User Manager
            </Typography>
            <Button variant="contained" onClick={handleAddClick} sx={{ mb:2, backgroundColor: "#29a929", color: "white" }}>
                create user
            </Button>
            <Divider sx={{width: 135}}/>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user._id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.password}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{ marginRight: '1em' }}
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: 'red', color: 'white' }}
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for editing user */}
            <Dialog open={open} onClose={handleDialogClose}>
            <DialogTitle>{isAddMode ? "Add User" : "Edit User"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="username"
                        value={formData.username}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Role"
                        name="role"
                        value={formData.role}
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
