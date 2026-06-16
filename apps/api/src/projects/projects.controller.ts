import { Controller, Post, Get, Delete, Body, Headers, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Request() req,
    @Headers('x-organization-id') organizationId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    if (!organizationId) {
      throw new BadRequestException('Header x-organization-id is required');
    }
    return this.projectsService.create(req.user.id, organizationId, createProjectDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Headers('x-organization-id') organizationId: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('Header x-organization-id is required');
    }
    return this.projectsService.findAllByOrganization(req.user.id, organizationId);
  }

  @Delete(':id')
  async delete(
    @Request() req,
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('Header x-organization-id is required');
    }
    return this.projectsService.delete(req.user.id, organizationId, id);
  }
}
