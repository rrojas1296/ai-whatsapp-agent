import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { Environments } from "../../config/environment.js";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { relations } from "./relations/index.js";

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  pool: Pool;
  db: NodePgDatabase<typeof relations>;

  constructor(config: ConfigService<Environments, true>) {
    this.pool = new Pool({
      connectionString: config.get("DATABASE_URL"),
    });

    this.db = drizzle({ client: this.pool, relations });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
