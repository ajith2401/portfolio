import sharp from "sharp";
import ColorHelper from "./colorHelper";

export class BrandingGenerator {
    // Update branding elements with simpler SVG structure
   static async addBrandingElements(buffer, theme) {
        const brandingSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${theme.layout.branding.height || 150}" version="1.1">
        <!-- Brand Name -->
        <text
        x="600"
        y="40"
        font-family="${theme.fonts.branding.name.family.replace(/"/g, '&quot;')}"
        font-size="${theme.fonts.branding.name.size}"
        font-weight="${theme.fonts.branding.name.weight}"
        fill="${theme.colors.branding.name.color}"
        text-anchor="middle"
        class="branding-name"
        >அஜித்குமார்</text>
    
        <!-- Contact Information Group -->
        <g transform="translate(100, 100)">
        <!-- Website -->
        <text
            x="0"
            y="0"
            font-family="${theme.fonts.branding.web.family.replace(/"/g, '&quot;')}"
            font-size="${theme.fonts.branding.web.size}"
            font-weight="${theme.fonts.branding.web.weight}"
            fill="${theme.colors.branding.web.color}"
            class="branding-web"
        >www.ajithkumar.dev</text>
    
        <!-- Phone Number -->
        <text
            x="500"
            y="0"
            font-family="${theme.fonts.branding.phone.family.replace(/"/g, '&quot;')}"
            font-size="${theme.fonts.branding.phone.size}"
            font-weight="${theme.fonts.branding.phone.weight}"
            fill="${theme.colors.branding.phone.color}"
            text-anchor="middle"
            class="branding-phone"
        >9944154823</text>
    
        <!-- Social Media Handle -->
        <text
            x="900"
            y="0"
            font-family="${theme.fonts.branding.social.family.replace(/"/g, '&quot;')}"
            font-size="${theme.fonts.branding.social.size}"
            font-weight="${theme.fonts.branding.social.weight}"
            fill="${theme.colors.branding.social.color}"
            text-anchor="end"
            class="branding-social"
        >@vaanawill</text>
        </g>
    </svg>`;
    
        try {
        // Create background matching theme
        const brandingBackground = await sharp({
            create: {
            width: 1200,
            height: theme.layout.branding.height || 150,
            channels: 4,
            background: ColorHelper.parseBackgroundColor(theme.colors.branding.background)
            }
        }).png().toBuffer();
    
        const brandingBuffer = await sharp(brandingBackground)
            .composite([{
            input: Buffer.from(brandingSvg),
            top: 0,
            left: 0
            }])
            .toBuffer();
    
        return await sharp(buffer)
            .composite([{
            input: brandingBuffer,
            gravity: 'south'
            }])
            .toBuffer();
    
        } catch (error) {
        console.error('Error generating branding:', error);
        throw new Error(`Failed to generate branding: ${error.message}`);
        }
    }

}

export default new BrandingGenerator();