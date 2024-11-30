import { Writing } from "@/models";
import { TextEffects } from "./textEffects";

class WritingSaver {
  static async createAndSaveWriting(options) {
        const { title, body, category, theme = 'default', effects, style } = options;
      
        // Validate input
        if (!body || typeof body !== 'string' || !body.trim()) {
          console.error("Error: Missing or invalid 'body' content.");
          throw new Error("Body content is required for generating an image.");
        }
      
        console.log("Creating writing with options:", { title, category, theme });
      
        const themeMap = { poem: 'love', philosophy: 'philosophical', article: 'default', 'short story': 'emotional' };
      
        try {
          const images = await TextEffects.generateForText(body, {
            title,
            theme: theme || themeMap[category] || 'default',
            effects,
            style
          });
      
          const writing = await Writing.create({
            title,
            body,
            category,
            images,
            createdAt: options.createdAt || new Date()
          });
      
          return writing;
        } catch (error) {
          console.error("Error in createAndSaveWriting:", error.message);
          throw error;
        }
      }
      
}

export default new WritingSaver()