import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => {
	res.send('Login');
});

router.get('/register', (req, res) => {
	res.send('Register');
});

export default router;