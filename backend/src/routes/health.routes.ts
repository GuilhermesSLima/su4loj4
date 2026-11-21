import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ status: 'Sistema funcionando normalmente' });
});

export default router;