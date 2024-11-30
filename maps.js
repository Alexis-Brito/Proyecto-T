
router.get('/', (req, res) => {
  res.render('map', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

module.exports = router;
