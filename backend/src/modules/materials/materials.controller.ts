import { Request, Response } from 'express';
import { MaterialsService } from './materials.service';

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

      if (!file) {
        throw new Error('No file uploaded or file type is not allowed');
      }

      // We store the relative path for the fileUrl (e.g., /uploads/materials/filename.pdf)
      // On the frontend, this can be prepended with the backend server URL.
      // But for express static to serve it properly when mounted at /uploads,
      // it should ideally be stored as `uploads/materials/filename.pdf` or similar.
      // We will store it exactly as the relative path to the project root.
      const fileUrl = file.path.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\//, '');

      const material = await this.service.uploadMaterial(userId, groupId, {
        title,
        description,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
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

      const materials = await this.service.getGroupMaterials(userId, groupId);
      res.status(200).json({ data: materials });
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
