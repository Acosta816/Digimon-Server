require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
console.log(process.env.API_TOKEN);
const app = express();
const digimon = require('./database/digimon-database');

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// ------------------------------------------------------------------------
function handleDigiName(req,res, digiArray){
  const name = req.query.name.toLowerCase();
  const filteredNames = digiArray.filter(digi=> digi.name.toLowerCase().includes(name));
  if(!filteredNames.length){
    return res.status(400).send('👎🏻looks like those letters did not match any digimon names🤷🏻‍')
  }
  return filteredNames;
}

function handleDigiLevel(req,res, digiArray){
  const level = req.query.level.toLowerCase();
  const filteredLevel = digiArray.filter(digi=> digi.level.toLowerCase().includes(level));
  if(!filteredLevel.length){
    return res.status(400).send('👎🏻invalid level, use "In Training" , "Rookie", "champion", "fresh", or "ultimate" ')
  }
  return filteredLevel;
}
//-------------------------------------------------------------------------

app.use(function validateBearerToken(req, res, next){
  if(!req.get('Authorization') || req.get('Authorization').split(' ')[1] !== process.env.API_TOKEN){
    return res.status(401).send('🔑Invalid Authorization header. please provide corect Bearer token');
  }
  else {
    next();
  }

})

app.get('/digimon', (req, res)=>{
  if(!req.query.name && !req.query.level){
    res.status(200).send(`WELCOME to the Digimon API, search for digimon by name 
                          or by level.
                          To see ALL digimon, simply request to /digimon/all endpoint.`);
  }
  else if(req.query.name && !req.query.level){
    res.status(200).json(handleDigiName(req,res, digimon));
  }
  else if(req.query.level && !req.query.name){
    res.status(200).json(handleDigiLevel(req,res,digimon));
  }
  else if(req.query.level && req.query.name){
    const digiLevel = handleDigiLevel(req,res,digimon);
    res.status(200).json(handleDigiName(req,res, digiLevel)); 
  }

})




app.get('/digimon/all', (req,res)=>{
  res.status(200).json(digimon);
})








const PORT = 8000;
app.listen(PORT, ()=>{
  console.log(`Server is listening to PORT ${8000} `);
})
