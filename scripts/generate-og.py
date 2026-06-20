#!/usr/bin/env python3
"""Generate OG image for kohchangsolarcell.com using Pillow."""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 1200, 630

# Brand colours
SOLAR_GREEN = (45, 122, 62)      # #2d7a3e
SOLAR_YELLOW = (245, 184, 0)     # #f5b800
SOLAR_DARK = (26, 26, 26)        # #1a1a1a
WHITE = (255, 255, 255)
WHITE_85 = (217, 217, 217)
WHITE_50 = (128, 128, 128)
WHITE_20 = (51, 51, 51)

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def interpolate_color(color1, color2, factor):
    return tuple(int(a + (b - a) * factor) for a, b in zip(color1, color2))

def create_gradient(width, height, color_top, color_bottom):
    """Create a vertical gradient."""
    img = Image.new('RGB', (width, height))
    for y in range(height):
        factor = y / height
        color = interpolate_color(color_top, color_bottom, factor)
        for x in range(width):
            img.putpixel((x, y), color)
    return img

def draw_sun(draw, cx, cy, radius, color):
    """Draw a stylised sun."""
    # Sun body
    for r in range(radius, 0, -1):
        alpha = int(255 * (1 - r / radius) * 0.8)
        # Blend with background for glow effect
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    
    # Sun rays
    for angle in range(0, 360, 45):
        import math
        rad = math.radians(angle)
        x1 = cx + int(math.cos(rad) * (radius + 10))
        y1 = cy + int(math.sin(rad) * (radius + 10))
        x2 = cx + int(math.cos(rad) * (radius + 35))
        y2 = cy + int(math.sin(rad) * (radius + 35))
        draw.line([(x1, y1), (x2, y2)], fill=(*color, 128), width=3)

def draw_logo_icon(draw, x, y, size, bg_color, icon_color):
    """Draw a simple sun icon in a rounded square."""
    # Rounded square background
    corner_radius = 12
    draw.rounded_rectangle([x, y, x + size, y + size], radius=corner_radius, fill=bg_color)
    
    # Sun symbol (circle with rays)
    cx, cy = x + size // 2, y + size // 2
    sun_r = size // 5
    draw.ellipse([cx - sun_r, cy - sun_r, cx + sun_r, cy + sun_r], fill=icon_color)
    
    # Simple rays
    import math
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        r1 = sun_r + 4
        r2 = sun_r + 14
        x1 = cx + int(math.cos(rad) * r1)
        y1 = cy + int(math.sin(rad) * r1)
        x2 = cx + int(math.cos(rad) * r2)
        y2 = cy + int(math.sin(rad) * r2)
        draw.line([(x1, y1), (x2, y2)], fill=icon_color, width=2)

def get_font(size, bold=False):
    """Try to find a good font."""
    font_paths = [
        '/System/Library/Fonts/Helvetica.ttc',
        '/System/Library/Fonts/HelveticaNeue.ttc',
        '/System/Library/Fonts/SFNSDisplay.ttf',
        '/System/Library/Fonts/SFNSRounded.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ]
    
    if bold:
        # Try bold variants
        bold_paths = [
            '/System/Library/Fonts/Helvetica.ttc',
            '/System/Library/Fonts/HelveticaNeue.ttc',
            '/System/Library/Fonts/SFNSDisplay.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        ]
        for path in bold_paths:
            if os.path.exists(path):
                try:
                    if 'Helvetica' in path or 'SFNS' in path:
                        return ImageFont.truetype(path, size, index=1)  # Bold index
                    return ImageFont.truetype(path, size)
                except:
                    continue
    
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
    
    return ImageFont.load_default()

def draw_text_centered(draw, text, y, font, fill, width):
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    draw.text((x, y), text, font=font, fill=fill)
    return text_width

def main():
    # Create gradient background (dark green blend)
    img = create_gradient(WIDTH, HEIGHT, SOLAR_DARK, (35, 90, 50))
    draw = ImageDraw.Draw(img)
    
    # Decorative circles (semi-transparent yellow)
    overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Large circle top-right
    overlay_draw.ellipse([700, -200, 1400, 500], fill=(*SOLAR_YELLOW, 20))
    
    # Medium circle bottom-left
    overlay_draw.ellipse([-100, 400, 400, 900], fill=(*SOLAR_YELLOW, 15))
    
    # Composite overlay
    img = img.convert('RGBA')
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)
    
    # Draw sun in top-right
    draw_sun(draw, 1100, 100, 40, SOLAR_YELLOW)
    
    # Logo icon (centered, near top)
    icon_size = 60
    icon_x = (WIDTH - icon_size) // 2
    icon_y = 140
    draw_logo_icon(draw, icon_x, icon_y, icon_size, SOLAR_YELLOW, SOLAR_DARK)
    
    # Load fonts
    font_title = get_font(56, bold=True)
    font_tagline = get_font(28)
    font_cta = get_font(20)
    font_footer = get_font(14)
    
    # Title
    title_text = "JJ Com Solar Cell"
    draw_text_centered(draw, title_text, icon_y + icon_size + 24, font_title, WHITE, WIDTH)
    
    # Tagline
    tagline_text = "Solar System Installation & Care in Thailand"
    # Split for highlighting
    tagline_y = icon_y + icon_size + 24 + 56 + 16
    
    # Measure parts
    part1 = "Solar System Installation "
    part2 = "& Care"
    part3 = " in Thailand"
    
    bbox1 = draw.textbbox((0, 0), part1, font=font_tagline)
    bbox2 = draw.textbbox((0, 0), part2, font=font_tagline)
    bbox3 = draw.textbbox((0, 0), part3, font=font_tagline)
    
    total_width = (bbox1[2]-bbox1[0]) + (bbox2[2]-bbox2[0]) + (bbox3[2]-bbox3[0])
    start_x = (WIDTH - total_width) // 2
    
    draw.text((start_x, tagline_y), part1, font=font_tagline, fill=WHITE_85)
    draw.text((start_x + bbox1[2]-bbox1[0], tagline_y), part2, font=font_tagline, fill=SOLAR_YELLOW)
    draw.text((start_x + bbox1[2]-bbox1[0] + bbox2[2]-bbox2[0], tagline_y), part3, font=font_tagline, fill=WHITE_85)
    
    # CTA bar
    cta_y = tagline_y + 28 + 32
    cta_text = "Free Quote  |  094 050 9623"
    bbox_cta = draw.textbbox((0, 0), cta_text, font=font_cta)
    cta_w = bbox_cta[2] - bbox_cta[0]
    cta_h = bbox_cta[3] - bbox_cta[1]
    
    # Rounded pill background
    pill_padding_x = 32
    pill_padding_y = 12
    pill_x = (WIDTH - cta_w) // 2 - pill_padding_x
    pill_y = cta_y - pill_padding_y
    pill_w = cta_w + pill_padding_x * 2
    pill_h = cta_h + pill_padding_y * 2
    
    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=50,
        fill=(*WHITE, 10),
        outline=(*WHITE, 40),
        width=1
    )
    
    draw_text_centered(draw, cta_text, cta_y, font_cta, WHITE, WIDTH)
    
    # Footer
    footer_text = "kohchangsolarcell.com"
    draw_text_centered(draw, footer_text, HEIGHT - 50, font_footer, WHITE_50, WIDTH)
    
    # Convert back to RGB for saving as JPEG
    img_rgb = img.convert('RGB')
    
    # Save
    output_dir = "/Users/hendrixclaw/.openclaw/workspace/projects/kohchang-solar/site/public/images"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "og-default.jpg")
    img_rgb.save(output_path, "JPEG", quality=92)
    
    print(f"OG image saved to: {output_path}")
    print(f"Dimensions: {WIDTH}x{HEIGHT}")

if __name__ == "__main__":
    main()
