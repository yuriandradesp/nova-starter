import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Requisito 1: Processo dentro de uma Transação do Prisma
    const userWithRelations = await this.prisma.$transaction(async (tx) => {
      // Passo 1 da Transação: Criar usuário com senha hasheada
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
        },
      });

      // Passo 2 da Transação: Criar uma Organização (Tenant) padrão
      const orgName = data.name ? `Workspace de ${data.name}` : 'Meu Workspace';
      const baseSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const orgSlug = `${baseSlug}-${newUser.id.substring(0, 8)}`;

      const newOrg = await tx.organization.create({
        data: {
          name: orgName,
          slug: orgSlug,
        },
      });

      // Passo 3 da Transação: Criar o vínculo no Membership
      await tx.membership.create({
        data: {
          userId: newUser.id,
          organizationId: newOrg.id,
          role: 'ADMIN',
        },
      });

      // Retorna o usuário criado buscando novamente com a estrutura de includes
      return tx.user.findUnique({
        where: { id: newUser.id },
        include: {
          memberships: {
            include: { organization: true },
          },
        },
      });
    });

    // Removendo a senha da resposta
    const { password, ...result } = userWithRelations!;
    return result;
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const { password, ...userWithoutPassword } = user;

    // Modificando a resposta do login para incluir os dados do usuário (com memberships)
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
