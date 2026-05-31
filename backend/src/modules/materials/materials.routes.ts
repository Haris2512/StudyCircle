import { Router } from 'express';
import { MaterialsController } from './materials.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createMaterialSchema } from '../../validators/materials.validator';
import { upload } from '../../middleware/upload.middleware';

const router = Router({ mergeParams: true });
const controller = new MaterialsController();

router.use(requireAuth);

// Group-level material routes (mounted at /api/v1/groups/:groupId/materials)
export const groupMaterialsRouter = Router({ mergeParams: true });
groupMaterialsRouter.use(requireAuth);

// We run multer upload.single('file') before validating the schema because Zod will parse req.body after multer has populated it.
groupMaterialsRouter.post(
  '/', 
  upload.single('file'), 
  validate(createMaterialSchema), 
  controller.uploadMaterial
);
groupMaterialsRouter.get('/', controller.getGroupMaterials);

// Global-level material routes (mounted at /api/v1/materials)
export const materialsRouter = Router();
materialsRouter.use(requireAuth);
materialsRouter.get('/:materialId/download', controller.downloadMaterial);
materialsRouter.delete('/:materialId', controller.deleteMaterial);
