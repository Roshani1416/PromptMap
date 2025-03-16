import torch
from diffusers import StableDiffusionPipeline
from io import BytesIO
import base64

class StableDiffusionModel:
    def __init__(self, model_id="runwayml/stable-diffusion-v1-5"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
        )
        self.pipe = self.pipe.to(self.device)
        print(f"Stable Diffusion model loaded on {self.device}")

    def generate_image(self, prompt, height=512, width=512, num_inference_steps=50, guidance_scale=7.5):
        """
        Generate an image based on a text prompt
        Returns: base64 encoded image
        """
        image = self.pipe(
            prompt,
            height=height,
            width=width,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale
        ).images[0]
        
        # Convert PIL image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return img_str