require("dotenv").config();

import client from "./client";
import init from "../server/models/init";
import newChannel from "./commands/newChannel";

init();
