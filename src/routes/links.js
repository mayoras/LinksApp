const express = require('express');
const router = express.Router();

const pool = require('../database'); // Reference to the database
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
	const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);

	res.render('links/list', {links});
});

router.get('/add', isLoggedIn, (req, res) => {
	res.render('links/add');
});

router.post('/add', isLoggedIn, async (req,res) => {
	const { title, url, description } = req.body;
	console.log(req.body);
	const newLink = {
		title,
		url,
		description,
		user_id : req.user.id
	};
	await pool.query('INSERT INTO links SET ?', [newLink]);
	// res.send("Received!");
	req.flash('success', 'Link saved successfully!');
	res.redirect('/links');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
	const { id } = req.params;
	await pool.query('DELETE FROM links WHERE id=?', [id]);
	req.flash('success', 'Link removed successfully!');
	res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
	const { id } = req.params;
	const links = await pool.query('SELECT * FROM links WHERE id=?', [id]);
	res.render('links/edit', {link : links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {

	const { title, url, description } = req.body;
	const { id } = req.params;
	const linkEdited = {
		title,
		url,
		description
	};
	await pool.query('UPDATE links SET ? WHERE id=?', [linkEdited, id]);
	req.flash('success', 'Link edited successfuly!');
	res.redirect('/links');

});

module.exports = router;