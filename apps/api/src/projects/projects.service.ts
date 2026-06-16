import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async validateMembership(userId: string, organizationId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a member of this organization');
    }
    return membership;
  }

  async create(userId: string, organizationId: string, dto: CreateProjectDto) {
    await this.validateMembership(userId, organizationId);
    
    return this.prisma.project.create({
      data: {
        name: dto.name,
        organizationId,
      },
    });
  }

  async findAllByOrganization(userId: string, organizationId: string) {
    await this.validateMembership(userId, organizationId);
    
    return this.prisma.project.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(userId: string, organizationId: string, projectId: string) {
    await this.validateMembership(userId, organizationId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found in this organization');
    }

    return this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }
}
