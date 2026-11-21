import { Router } from 'express';
import * as controller from '../controllers/api.controller.js';

const router = Router();

router.get('/', controller.apresentar);

export default router;