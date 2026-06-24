// File controller untuk modul Materials
import { Request, Response } from 'express';
import { MaterialsService } from './materials.service';
import { socketService } from '../../socket';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { env } from '../../config/env';
import fs from 'fs';
import path from 'path';

export class MaterialsController {
  private service: MaterialsService;

  constructor() {
    this.service = new MaterialsService();
  }

  uploadMaterial = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.groupId as string;
      const userId = req.user!.userId;
      const { title, description } = req.body;
      const file = req.file;

      if (!file || !file.buffer) {
        throw new Error('No file uploaded or file type is not allowed');
      }

      let fileUrl = '';

      if (env.CLOUDINARY_URL) {
        // Upload to Cloudinary
        fileUrl = await uploadToCloudinary(file.buffer, 'studycircle/materials', file.originalname);
      } else {
        // Fallback: save to disk locally
        const uploadDir = path.join(process.cwd(), 'uploads', 'materials');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueSuffix + ext;
        const filePath = path.join(uploadDir, filename);
        
        fs.writeFileSync(filePath, file.buffer);
        fileUrl = `uploads/materials/${filename}`;
      }

      const material = await this.service.uploadMaterial(userId, groupId, {
        title,
        description,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
      });

      // Emit real-time notification to the group
      socketService.notifyGroup(groupId, 'material_uploaded', {
        id: material.id,
        title: material.title,
        uploadedBy: material.uploadedBy,
      });

      res.status(201).json({ data: material });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getGroupMaterials = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.groupId as string;
      const userId = req.user!.userId;
      const { page, limit } = req.query;

      const result = await this.service.getGroupMaterials(
        userId, 
        groupId,
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      const mappedMaterials = result.materials.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        fileUrl: m.fileUrl,
        fileType: m.fileType,
        fileSize: m.fileSize,
        uploadedAt: m.uploadedAt,
        uploaderName: m.uploader?.fullName || m.uploader?.username || 'Unknown',
        uploaderId: m.uploadedBy
      }));

      res.status(200).json({ 
        success: true, 
        data: mappedMaterials, 
        pagination: result.pagination 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteMaterial = async (req: Request, res: Response) => {
    try {
      const materialId = req.params.materialId as string;
      const userId = req.user!.userId;

      await this.service.deleteMaterial(userId, materialId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  downloadMaterial = async (req: Request, res: Response) => {
    try {
      const materialId = req.params.materialId as string;
      const userId = req.user!.userId;

      const downloadPath = await this.service.getMaterialDownloadPath(userId, materialId);
      res.download(downloadPath);
    } catch (error: any) {
      // Return 403 or 404 for security depending on if they are a member, but our service throws Error
      res.status(400).json({ error: error.message });
    }
  };
}
