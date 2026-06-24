// File routing untuk modul Materials
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

/**
 * @openapi
 * tags:
 *   name: Materials
 *   description: Material management endpoints
 */

/**
 * @openapi
 * /api/v1/groups/{groupId}/materials:
 *   post:
 *     tags: [Materials]
 *     summary: Upload a material to a group
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Material uploaded successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 */
// We run multer upload.single('file') before validating the schema because Zod will parse req.body after multer has populated it.
groupMaterialsRouter.post(
  '/', 
  upload.single('file'), 
  validate(createMaterialSchema), 
  controller.uploadMaterial
);

/**
 * @openapi
 * /api/v1/groups/{groupId}/materials:
 *   get:
 *     tags: [Materials]
 *     summary: Get all materials for a group
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of materials
 *       401:
 *         description: Unauthorized
 */
groupMaterialsRouter.get('/', controller.getGroupMaterials);

// Global-level material routes (mounted at /api/v1/materials)
export const materialsRouter = Router();
materialsRouter.use(requireAuth);

/**
 * @openapi
 * /api/v1/materials/{materialId}/download:
 *   get:
 *     tags: [Materials]
 *     summary: Download a material
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material file stream
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Material not found
 */
materialsRouter.get('/:materialId/download', controller.downloadMaterial);

/**
 * @openapi
 * /api/v1/materials/{materialId}:
 *   delete:
 *     tags: [Materials]
 *     summary: Delete a material
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the uploader or group creator)
 *       404:
 *         description: Material not found
 */
materialsRouter.delete('/:materialId', controller.deleteMaterial);
