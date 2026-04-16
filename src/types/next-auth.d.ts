import "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    roleId: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      roleId: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    roleId: string;
  }
}
