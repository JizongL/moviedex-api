const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const MovieData = require('../movies.json')
const app = express()

app.use(morgan('common'))
app.use(helmet())
app.use(cors())
let validGenres = []
MovieData.forEach(movie=>{
if(!validGenres.includes(movie.genre))
validGenres.push(movie.genre)
})

let validCountry = []
MovieData.forEach(movie=>{
if(!validCountry.includes(movie.country))
validCountry.push(movie.country)
})





app.use(function validateBearerToken(req,res,next){
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  console.log(apiToken)
  console.log('validate bearer token middleware')
  if(!authToken || authToken.split(' ')[1]!==apiToken)
  {return res.status(401).json({"error":"Unauthorized request"})}
  
  next()
})

function handleGetGenres(req,res){
   
    res.json(validGenres)
}

app.get('/getGenres',handleGetGenres)

function handleGetCountry(req,res){
  res.json(validCountry)
}

app.get('/getCountry',handleGetCountry)

function handleMovieSearch(req,res){  
  const {genre,avg_vote,country} = req.query

  if(genre){
    if(!validGenres.includes(genre)){
      res.status(400).send(`genre is not valid,must be one of the following\n${validGenres}`)
    }
    result = MovieData.filter(movie=> movie.genre.includes(genre))
    res.json(result)
  }


   if(avg_vote){
    if(avg_vote>10||avg_vote<0){
      res.status(400).send('average vote must be in range of 0 and 10,decimal is allowed,e.g. 1.5 or 3.5')
    }
    result=MovieData.filter(movie=>movie.avg_vote >=avg_vote)
    if(!result){
      res.send('your average vote does not match any movie in the database')
    }
    res.json(result)
}

  if(country){
    if(!validCountry.includes(country)){
      res.status(400).send(`provide a valid country. must be one of the following\n${validCountry}`)
    }
  }
  
res.json(MovieData)
}


app.get('/movie',handleMovieSearch)

module.exports=app