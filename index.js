const express = require('express')
const app = express()
const port = 3000
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

app.get('/', (req, res) => {
  res.send('ok')
})
app.get('/test', (req, res)=>{
    res.json({"status":200,"message":"Ok"})
});

app.get('/time', (req, res)=>{
    const d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes()
    res.json({"status":200,"message":`${hours}:${minutes}`})
}); 

app.get('/hello/:id', (req, res)=>{
    res.json({"status":200,"message":"Hello,"+req.params.id})
}); 

app.get('/search', (req, res)=>{
    const search = req.query.s;
    typeof search != 'undefined'?res.json({status:200, message:"ok", data:search}):res.json({status:500, error:true, message:"you have to provide a search"}) 
}); 

app.get('/movies/read', (req, res)=>{
    res.json({status:200, data:movies})
}); 

app.get('/movies/create', (req, res)=>{
   
}); 

app.get('/movies/update', (req, res)=>{
    
}); 

app.get('/movies/delete', (req, res)=>{
    
}); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})