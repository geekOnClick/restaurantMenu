import { PrismaClient } from '@prisma/client';
import express from 'express';

const path = require('path')
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client', 'index.html'))
})

app.get('/menu', async (req, res) => {
    const menu = await prisma.menu.findMany();
    res.json(menu);
});

app.get('/dishes', async (req, res) => {
  const dishes = await prisma.dish.findMany()
  res.status(200).json(dishes)
})

app.get(`/dish/:id`, async (req, res) => {
  const { id } = req.params
  const dish = await prisma.dish.findUnique({
    where: { id: Number(id) },
  })
  res.json(dish)
})

app.post(`/newmenu`, async (req, res) => {
  const result = await prisma.menu.create({
    
    data: { ...req.body },
  })
  res.json(result)
})

app.post(`/newdish`, async (req, res) => {
  const { dish_id, title, description, price, fastcook, delivery } = req.body
    const result = await prisma.dish.create({
      data: {
        dish_menu: { connect: {id: dish_id} },
        title,
        description,
        price,
        fastcook,
        delivery,
      },
    })
    res.json(result)
})

app.put(`/dish/changed/:id`, async (req, res) => {
  const { id } = req.params
  const { title, description, price, fastcook, delivery } = req.body
  const result = await prisma.dish.update({
    where: { id: Number(id) },
    data: { 
      title,
      description,
      price,
      fastcook,
      delivery,
    },
  })
  res.json(result)
})

app.delete(`/dish/:id`, async (req, res) => {
  const { id } = req.params
  const result = await prisma.dish.delete({
    where: { id: Number(id) },
  })
  res.json(result)
})    

app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000')
);


