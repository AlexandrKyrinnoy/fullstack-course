const app = require('./app')
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server has been started on ${port}`))

/*
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Working'
    })
})
*/