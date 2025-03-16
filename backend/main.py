from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import StableDiffusionModel
import uvicorn

app = FastAPI()

# Configure CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize the Stable Diffusion model
model = StableDiffusionModel()

class ImageRequest(BaseModel):
    prompt: str
    height: int = 512
    width: int = 512
    num_inference_steps: int = 30
    guidance_scale: float = 7.5

class ImageResponse(BaseModel):
    image: str

class SuggestionRequest(BaseModel):
    keyword: str

class SuggestionResponse(BaseModel):
    suggestions: list

# Prompt suggestion endpoint
@app.post("/suggest-prompts", response_model=SuggestionResponse)
async def suggest_prompts(request: SuggestionRequest):
    keyword = request.keyword.lower().strip()
    
    # Dictionary of keywords and their suggested prompts
    suggestion_database = {
        "car": [
            "A sleek red sports car on a coastal road at sunset, photorealistic",
            "Vintage classic car in front of an old diner, cinematic lighting",
            "Futuristic concept car with glowing elements in a cyberpunk city",
            "A rugged off-road vehicle climbing a rocky mountain trail",
            "Luxury car interior with detailed dashboard and leather seats"
        ],
        "landscape": [
            "Majestic mountain range with snow-capped peaks at sunrise",
            "Rolling hills with wildflowers under a dramatic cloudy sky",
            "Desert landscape with red rock formations and a winding road",
            "Misty forest with ancient trees and dappled sunlight",
            "Coastal cliffs with crashing waves during a storm"
        ],
        "portrait": [
            "Professional studio portrait with dramatic lighting, shallow depth of field",
            "Vintage-style portrait with sepia tones and classic composition",
            "Artistic portrait with creative lighting and vivid colors",
            "Moody low-key portrait with strong contrast and shadows",
            "Bright high-key portrait with soft lighting and minimal shadows"
        ],
        "animal": [
            "Majestic lion in the savanna during golden hour",
            "Playful fox in a snowy forest landscape",
            "Colorful tropical birds in a lush rainforest",
            "Underwater scene with coral reef and tropical fish",
            "Close-up of a butterfly on a vibrant flower"
        ],
        "fantasy": [
            "Enchanted forest with glowing mushrooms and fairy lights",
            "Ancient dragon perched on a mountain overlooking a medieval castle",
            "Wizard's workshop filled with magical artifacts and potions",
            "Floating islands with waterfalls in a sky filled with unusual clouds",
            "Portal to another dimension with swirling magical energy"
        ]
    }
    
    # Add some generic fallback suggestions for keywords not in our database
    fallback_suggestions = [
        f"A beautiful {keyword} with stunning details, photorealistic, 8k",
        f"A creative interpretation of {keyword} in a surrealist style",
        f"{keyword} in a cyberpunk setting with neon lights",
        f"A vintage photograph of {keyword} from the 1950s",
        f"{keyword} in a fantasy world with magical elements"
    ]
    
    # Return matching suggestions or fallbacks
    if keyword in suggestion_database:
        return {"suggestions": suggestion_database[keyword]}
    else:
        return {"suggestions": fallback_suggestions}

@app.post("/generate-image", response_model=ImageResponse)
async def generate_image(request: ImageRequest):
    try:
        img_str = model.generate_image(
            prompt=request.prompt,
            height=request.height,
            width=request.width,
            num_inference_steps=request.num_inference_steps,
            guidance_scale=request.guidance_scale
        )
        return {"image": img_str}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add an OPTIONS endpoint to handle preflight requests
@app.options("/generate-image")
async def options_generate_image():
    return {}

@app.options("/suggest-prompts")
async def options_suggest_prompts():
    return {}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)