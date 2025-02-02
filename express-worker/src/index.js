/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from 'express';
import { createServer } from '@hono/node-server';
import { Hono } from 'hono';
import mongoose from 'mongoose';

const app = new Hono();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const CourseSchema = new mongoose.Schema({ name: String, prerequisites: [String], postrequisites: [String], description: String, creditHours: Number });
const Course = mongoose.model('Course', CourseSchema);

app.get('/node-api/courses', async (c) => {
    const courses = await Course.find();
    return c.json(courses);
});

export default createServer({
  fetch: app.fetch,
});
