export interface Session {
  id: string;
  userId: string;
  refreshHash: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertSession = Omit<Session, "createdAt" | "updatedAt" | "isDeleted">;
