#!/usr/bin/env python3
"""
roto-text.py - Pure Optical Rotoscoping Engine for Creator Typography

Features:
- Pure sub-pixel optical occlusion: visible = text * (1.0 - subject_mask)
- Zero double-vision / zero ghosting guarantee (base camera pixels untouched)
- 4-tier cinematic optical neon bloom (core glow, mid-bloom, ambient diffusion, deep shadow)
- Keyframe-dense constant-frame-rate x264 encoding (-g 30) for instant seeking
- Automatic generation of 1/2, 1/4, and 1/8 preview proxies
"""

import os, sys, argparse, subprocess, time
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

COLOR_MAP = {
    "gold": {
        "text": (255, 230, 0, 255),
        "core": (255, 255, 120, 255),
        "bloom": (255, 230, 0, 230),
        "ambient": (255, 200, 0, 160),
    },
    "green": {
        "text": (0, 255, 102, 255),
        "core": (120, 255, 180, 255),
        "bloom": (0, 255, 102, 230),
        "ambient": (0, 200, 80, 160),
    },
    "red": {
        "text": (255, 59, 48, 255),
        "core": (255, 120, 110, 255),
        "bloom": (255, 59, 48, 230),
        "ambient": (200, 40, 30, 160),
    },
    "white": {
        "text": (255, 255, 255, 255),
        "core": (255, 255, 255, 255),
        "bloom": (220, 230, 255, 220),
        "ambient": (180, 200, 240, 140),
    }
}

def parse_args():
    parser = argparse.ArgumentParser(description="Optical Rotoscoped Typography Behind Subject")
    parser.add_argument("project", help="Project slug or project directory path")
    parser.add_argument("--text", required=True, help="Text to display behind subject (e.g. '$25M', '100%')")
    parser.add_argument("--start", type=float, required=True, help="Start time in seconds")
    parser.add_argument("--end", type=float, required=True, help="End time in seconds")
    parser.add_argument("--x", type=int, default=435, help="Left X coordinate (default: 435)")
    parser.add_argument("--y", type=int, default=95, help="Top Y coordinate (default: 95)")
    parser.add_argument("--size", type=int, default=230, help="Font size in pt (default: 230)")
    parser.add_argument("--color", choices=["gold", "green", "red", "white"], default="gold", help="Color preset")
    parser.add_argument("--font", help="Custom TTF font path")
    parser.add_argument("--model", default="u2netp", help="rembg model name (default: u2netp)")
    return parser.parse_args()

def main():
    args = parse_args()
    
    # Resolve project directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    studio_root = os.path.abspath(os.path.join(script_dir, ".."))
    
    if os.path.isdir(args.project):
        proj_dir = os.path.abspath(args.project)
    else:
        proj_dir = os.path.join(studio_root, "projects", args.project)
        
    if not os.path.isdir(proj_dir):
        print(f"Error: Project directory not found: {proj_dir}", file=sys.stderr)
        sys.exit(1)
        
    assets_dir = os.path.join(proj_dir, "assets")
    clean_src = os.path.join(assets_dir, "working_clean.mp4")
    working_src = os.path.join(assets_dir, "working.mp4")
    out_video = os.path.join(assets_dir, "working_with_roto.mp4")
    
    # Preserve pristine clean footage
    if not os.path.exists(clean_src):
        if os.path.exists(working_src):
            print(f"Backing up pristine clean footage to {clean_src}...")
            import shutil
            shutil.copyfile(working_src, clean_src)
        else:
            print(f"Error: No working video found at {working_src}", file=sys.stderr)
            sys.exit(1)
            
    # Resolve font path
    font_path = args.font
    if not font_path:
        default_font = os.path.join(assets_dir, "fonts", "Poppins-Bold.ttf")
        if os.path.exists(default_font):
            font_path = default_font
        else:
            font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
            
    print(f"=== Optical Rotoscoping Engine ===")
    print(f"Project:     {os.path.basename(proj_dir)}")
    print(f"Text:        '{args.text}'")
    print(f"Window:      {args.start:.2f}s -> {args.end:.2f}s ({args.end - args.start:.2f}s)")
    print(f"Position:    X={args.x}, Y={args.y}, Font Size={args.size}")
    print(f"Color:       {args.color}")
    print(f"Source:      {clean_src}")
    
    # Import rembg lazily
    from rembg import remove, new_session
    session = new_session(args.model)
    
    cap = cv2.VideoCapture(clean_src)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    start_f = int(args.start * fps)
    end_f = int(args.end * fps)
    base_pos = (args.x, args.y)
    
    font = ImageFont.truetype(font_path, args.size)
    palette = COLOR_MAP[args.color]
    
    # Pre-render 4-tier optical bloom master text
    # 1. Dark ambient drop shadow (offset +10, blur 24)
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.text((base_pos[0] + 8, base_pos[1] + 12), args.text, font=font, fill=(0, 0, 0, 240))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    
    # 2. Wide ambient golden diffusion (blur 60)
    ambient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    adraw = ImageDraw.Draw(ambient)
    adraw.text(base_pos, args.text, font=font, fill=palette["ambient"])
    ambient = ambient.filter(ImageFilter.GaussianBlur(60))
    
    # 3. Vibrant mid-range neon bloom (blur 22)
    bloom = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bloom)
    bdraw.text(base_pos, args.text, font=font, fill=palette["bloom"])
    bloom = bloom.filter(ImageFilter.GaussianBlur(22))
    
    # 4. Tight intense neon core glow (blur 8)
    core = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(core)
    cdraw.text(base_pos, args.text, font=font, fill=palette["core"])
    core = core.filter(ImageFilter.GaussianBlur(8))
    
    # 5. Crisp solid text face
    text_canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_canvas)
    tdraw.text(base_pos, args.text, font=font, fill=palette["text"])
    
    master_text = Image.alpha_composite(shadow, ambient)
    master_text = Image.alpha_composite(master_text, bloom)
    master_text = Image.alpha_composite(master_text, core)
    master_text = Image.alpha_composite(master_text, text_canvas)
    
    # Text center for scale transforms
    bbox = tdraw.textbbox(base_pos, args.text, font=font)
    text_cx = (bbox[0] + bbox[2]) // 2
    text_cy = (bbox[1] + bbox[3]) // 2
    
    # FFmpeg output pipe with keyframe density (-g 30)
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{w}x{h}", "-pix_fmt", "bgr24", "-r", str(fps),
        "-i", "-",
        "-i", clean_src,
        "-c:v", "libx264", "-preset", "medium", "-crf", "16",
        "-r", str(int(round(fps))),
        "-g", str(int(round(fps))),
        "-keyint_min", str(int(round(fps))),
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
        "-map", "0:v:0", "-map", "1:a:0?",
        "-movflags", "+faststart",
        out_video
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    
    t_start = time.time()
    total_roto_frames = end_f - start_f + 1
    
    print(f"Processing {total_frames} frames ({total_roto_frames} rotoscoped)...")
    
    for f in range(total_frames):
        ret, frame = cap.read()
        if not ret:
            break
            
        if start_f <= f <= end_f:
            rel_f = f - start_f
            rel_t = rel_f / fps
            duration = args.end - args.start
            
            # Smooth entrance slam and exit fade
            if rel_f < 6:
                t_norm = rel_f / 5.0
                scale = 1.30 - 0.30 * (1.0 - (1.0 - t_norm)**2)
                opacity = 0.2 + 0.8 * t_norm
                offset_y = int(-18 * (1.0 - t_norm))
            elif rel_t > (duration - 0.40):
                t_fade = (rel_t - (duration - 0.40)) / 0.40
                scale = 1.0
                opacity = max(0.0, 1.0 - t_fade)
                offset_y = int(12 * t_fade)
            else:
                scale = 1.0 + 0.012 * np.sin(rel_t * 3.5)
                opacity = 1.0
                offset_y = 0
                
            if abs(scale - 1.0) > 0.005 or offset_y != 0:
                sw = int(w * scale)
                sh = int(h * scale)
                scaled = master_text.resize((sw, sh), Image.Resampling.BILINEAR)
                dx = int(text_cx - (text_cx * scale))
                dy = int(text_cy - (text_cy * scale)) + offset_y
                frame_text = Image.new("RGBA", (w, h), (0, 0, 0, 0))
                frame_text.paste(scaled, (dx, dy), scaled)
            else:
                frame_text = master_text
                
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_pil = Image.fromarray(frame_rgb)
            
            # Segment subject with sub-pixel matte
            mask_pil = remove(frame_pil, session=session, only_mask=True)
            mask_np = np.array(mask_pil).astype(np.float32) / 255.0
            
            text_np = np.array(frame_text)
            text_rgb = text_np[:, :, :3].astype(np.float32)
            text_alpha = (text_np[:, :, 3].astype(np.float32) / 255.0) * opacity
            
            # Pure optical occlusion formula
            visible_alpha = text_alpha * (1.0 - mask_np)
            visible_alpha_3 = np.dstack([visible_alpha, visible_alpha, visible_alpha])
            
            base_float = frame_rgb.astype(np.float32)
            comp = base_float * (1.0 - visible_alpha_3) + text_rgb * visible_alpha_3
            comp = np.clip(comp, 0, 255).astype(np.uint8)
            
            out_bgr = cv2.cvtColor(comp, cv2.COLOR_RGB2BGR)
            proc.stdin.write(out_bgr.tobytes())
            
            if rel_f % 15 == 0 or rel_f == total_roto_frames - 1:
                elapsed = time.time() - t_start
                pct = (rel_f + 1) / total_roto_frames * 100
                print(f"Roto frame {rel_f + 1}/{total_roto_frames} ({pct:.0f}%) - {elapsed:.1f}s")
        else:
            proc.stdin.write(frame.tobytes())
            
    proc.stdin.close()
    proc.wait()
    cap.release()
    
    # Replace working.mp4 with rotoscoped output
    import shutil
    shutil.copyfile(out_video, working_src)
    print(f"Updated master video: {working_src}")
    
    # Auto-generate fractional preview proxies with keyframe density
    print("Generating keyframe-dense fractional proxies (1/2, 1/4, 1/8)...")
    proxies = [
        ("working_1_2.mp4", "540:960", "24"),
        ("working_1_4.mp4", "270:480", "26"),
        ("working_1_8.mp4", "136:240", "28")
    ]
    for p_name, scale, crf in proxies:
        p_path = os.path.join(assets_dir, p_name)
        cmd_proxy = [
            "ffmpeg", "-y",
            "-i", working_src,
            "-vf", f"scale={scale}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", crf,
            "-g", str(int(round(fps))), "-keyint_min", str(int(round(fps))),
            "-c:a", "copy",
            p_path
        ]
        subprocess.run(cmd_proxy, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print(f"  ✓ {p_name}")
        
    print(f"\nOptical Rotoscoping Complete in {time.time() - t_start:.1f}s!")

if __name__ == "__main__":
    main()
