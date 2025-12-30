import { ContentAgent } from "../agents/ContentAgent";
import { EconomicsAgent } from "../agents/EconomicsAgent";

export class SmartBrainOrchestrator {
  private contentAgent = new ContentAgent();
  private economicsAgent = new EconomicsAgent();

  async proposeMintFrame(ctx: { actorAddress: string; content: any }) {
    const contentInsights = await this.contentAgent.analyze(ctx.content);
    const pricing = await this.economicsAgent.recommendPricing({ contentInsights });

    return {
      contentInsights,
      pricing
    };
  }
}
