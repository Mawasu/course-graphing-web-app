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
import { cors } from 'hono/cors';

const app = new Hono();

// Apply CORS before defining routes
app.use(cors({
  origin: '*',  // Allow all origins (change this for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

const CourseSchema = new mongoose.Schema({ id: String, name: String, prerequisites: [String], description: String });
const Course = mongoose.model('Course', CourseSchema);

app.get('/', (c) => c.text("AHHHHHHH"));

app.get('/api', (c) => c.text("ok"));

app.get('/api/courses', async (c) => {
  const response = await fetch('http://localhost:5001/api/courses');
  const data = await response.json();
  return c.json(data);
});

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
