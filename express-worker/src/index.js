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

const app = new Hono();

const CourseSchema = new mongoose.Schema({ id: String, name: String, prerequisites: [String], description: String});
const Course = mongoose.model('Course', CourseSchema);

app.get('/', (c) => c.text("AHHHHHHH"));

app.get('/api/courses', async (c) => {
    const courses = await Course.find();
    return c.json(courses);
});

export default {
  fetch: app.fetch,
};
