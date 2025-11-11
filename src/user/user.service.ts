import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findBySupabaseId(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createFromSupabase(data: {
    id: string;
    email: string;
    fullName?: string;
  }) {
    return this.prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: UserRole.operator, // Default role
        isActive: true,
      },
    });
  }

  async updateUser(id: string, data: { fullName?: string; role?: UserRole }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deactivateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
