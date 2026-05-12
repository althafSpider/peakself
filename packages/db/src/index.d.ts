import { PrismaClient } from "../generated/prisma/client";

declare const prisma: PrismaClient;

export { prisma };
export * from "../generated/prisma/client";
