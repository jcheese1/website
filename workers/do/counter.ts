
import { DurableObject } from "cloudflare:workers";
import type { worker } from "../../alchemy.run";

export class Counter extends DurableObject {
  declare env: typeof worker.Env;
  private count: number;

  constructor(ctx: DurableObjectState, env: typeof worker.Env) {
    super(ctx, env);
    // Initialize count from storage or 0
    this.count = Number(this.ctx.storage.kv.get('count') || 0);
  }

  increment() {
    this.count++;

    // Update count in storage
    this.ctx.storage.kv.put('count', this.count.toString());
    return Response.json({ count: this.count });
  }
  decrement() {
    this.count--;

    // Update count in storage
    this.ctx.storage.kv.put('count', this.count.toString());
    return Response.json({ count: this.count });
  }
}
