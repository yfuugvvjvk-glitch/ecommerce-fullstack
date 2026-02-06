import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import fs from 'fs';
import path from 'path';

export async function mediaRoutes(fastify: FastifyInstance) {
  // Get all media files (admin only)
  fastify.get(
    '/media',
    {
      preHandler: [authMiddleware, adminMiddleware]
    },
    async (request, reply) => {
      try {
        // Pentru moment, returnăm o listă goală
        // În viitor, poți adăuga un model Media în Prisma
        const uploadsDir = path.join(__dirname, '../../public/uploads');
        const files: any[] = [];

        // Scanează directoarele de upload
        const scanDirectory = (dir: string, category: string) => {
          if (!fs.existsSync(dir)) return;
          
          const items = fs.readdirSync(dir);
          items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            
            if (stats.isFile()) {
              const ext = path.extname(item).toLowerCase();
              const mimeTypes: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.pdf': 'application/pdf',
              };

              files.push({
                id: `${category}-${item}`,
                filename: item,
                originalName: item,
                path: `/uploads/${category}/${item}`,
                url: `/uploads/${category}/${item}`,
                mimeType: mimeTypes[ext] || 'application/octet-stream',
                size: stats.size,
                uploadedBy: 'admin@example.com',
                createdAt: stats.birthtime.toISOString(),
              });
            }
          });
        };

        // Scanează fiecare categorie
        ['products', 'avatars', 'offers'].forEach(category => {
          scanDirectory(path.join(uploadsDir, category), category);
        });

        reply.send(files);
      } catch (error) {
        console.error('Error fetching media files:', error);
        reply.code(500).send({ error: 'Failed to fetch media files' });
      }
    }
  );

  // Upload media files (admin only)
  fastify.post(
    '/media/upload',
    {
      preHandler: [authMiddleware, adminMiddleware]
    },
    async (request, reply) => {
      try {
        const data = await request.file();
        
        if (!data) {
          return reply.code(400).send({ error: 'No file uploaded' });
        }

        // Salvează fișierul
        const uploadsDir = path.join(__dirname, '../../public/uploads/media');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `${Date.now()}-${data.filename}`;
        const filepath = path.join(uploadsDir, filename);
        
        const buffer = await data.toBuffer();
        fs.writeFileSync(filepath, buffer);

        reply.send({
          success: true,
          file: {
            filename,
            url: `/uploads/media/${filename}`,
            size: buffer.length,
          }
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        reply.code(500).send({ error: 'Failed to upload file' });
      }
    }
  );

  // Delete media file (admin only)
  fastify.delete(
    '/media/:fileId',
    {
      preHandler: [authMiddleware, adminMiddleware]
    },
    async (request, reply) => {
      try {
        const { fileId } = request.params as { fileId: string };
        
        // Parse fileId (format: category-filename)
        const [category, ...filenameParts] = fileId.split('-');
        const filename = filenameParts.join('-');
        
        const filepath = path.join(__dirname, '../../public/uploads', category, filename);
        
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          reply.send({ success: true, message: 'File deleted' });
        } else {
          reply.code(404).send({ error: 'File not found' });
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        reply.code(500).send({ error: 'Failed to delete file' });
      }
    }
  );

  // Bulk delete media files (admin only)
  fastify.post(
    '/media/bulk-delete',
    {
      preHandler: [authMiddleware, adminMiddleware]
    },
    async (request, reply) => {
      try {
        const { fileIds } = request.body as { fileIds: string[] };
        
        let deleted = 0;
        let failed = 0;

        fileIds.forEach(fileId => {
          try {
            const [category, ...filenameParts] = fileId.split('-');
            const filename = filenameParts.join('-');
            const filepath = path.join(__dirname, '../../public/uploads', category, filename);
            
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
              deleted++;
            } else {
              failed++;
            }
          } catch (error) {
            failed++;
          }
        });

        reply.send({
          success: true,
          deleted,
          failed,
          message: `Deleted ${deleted} files, ${failed} failed`
        });
      } catch (error) {
        console.error('Error bulk deleting files:', error);
        reply.code(500).send({ error: 'Failed to bulk delete files' });
      }
    }
  );
}
