/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

const app = new Hono();

app.get('/', (c) => c.text("AHHHHHHH"));

/*app.use('/api/*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type')
  return next()
})*/

app.get('/api/courses/:course_id', async (c) => {
  const { course_id } = c.req.param();  // Capture URL parameter

  // Construct the Flask backend URL
  const flaskUrl = `https://course-graphing-app.onrender.com/api/courses/${course_id}`;

  try {
    const response = await fetch(flaskUrl);
    const data = await response.json();

    return c.json(data);
  } catch (error) {
    console.error("Error proxying request:", error);
    return c.json({ error: "Failed to fetch data from backend" }, 500);
  }
});

app.get('/api/courses/', async (c) => {
  const flaskUrl = `https://course-graphing-app.onrender.com/api/courses/`;

  try {
    const response = await fetch(flaskUrl);
    const data = await response.json();

    return c.json(data);
  } catch (error) {
    console.error("Error proxying request:", error);
    return c.json({ error: "Failed to fetch data from backend" }, 500);
  }
})

app.post('/api/receive-data', async (c) => {
  const body = await c.req.json();
  console.log("Received from Flask:", body);
  return c.json({ message: "Data received successfully" });
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text('error', 500);
})

export default {
  fetch: app.fetch,
};
