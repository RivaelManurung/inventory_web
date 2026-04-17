import { prisma } from "./prisma";

export async function createLog(
  userId: string, 
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT", 
  module: string, 
  description?: string, 
  metadata?: any
) {
  try {
    return await prisma.activityLog.create({
      data: {
        userId,
        action,
        module,
        description,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
}
