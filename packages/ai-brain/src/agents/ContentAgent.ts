export class ContentAgent {
  async analyze(content: any) {
    return { tags: ["photo"], language: "en", nsfw: false };
  }
}
