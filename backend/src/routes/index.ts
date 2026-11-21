import { Router } from 'express';
import apiRoutes from './api.routes.js';
import healthRoutes from './health.routes.js';
import produtoRoutes from './product.routes.js';
import vendaRoutes from './venda.routes.js';

const router = Router();

router.use('/', apiRoutes);
router.use('/produtos', produtoRoutes);
router.use('/vendas', vendaRoutes);
router.use('/health', healthRoutes);

export default router;
