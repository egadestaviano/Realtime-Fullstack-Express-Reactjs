import express from "express";
import appMiddleware from "./index.js";

const web = express();
web.use(appMiddleware);
export default web;
