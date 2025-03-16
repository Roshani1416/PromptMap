# 🚀 PromptMap - AI Image Generator  

PromptMap is a powerful AI-driven image generation tool that helps users create stunning visuals from text prompts.  
It not only generates high-quality images but also provides intelligent **prompt suggestions** based on keywords.  

## ✨ Features  

### 🖼️ AI Image Generation  
PromptMap allows users to **convert text-based prompts into high-quality images effortlessly** using advanced AI models.  
Simply enter a text description, and the system will generate a unique image based on your input.  

### 🔍 Smart Prompt Suggestions  
Instead of struggling to come up with creative prompts, **PromptMap provides relevant prompt suggestions** based on a given keyword.  
For example, if you type **"car"**, it will generate **detailed and descriptive prompts** to refine the image generation process.  

### ⚡ Unlimited Image Generation (No Subscription Required)  
Unlike many AI image-generation platforms like **ChatGPT, Midjourney, or DALL·E**, which **require a paid subscription**,  
PromptMap allows **unlimited** image generation **for free**! Generate as many images as you need without restrictions.  

### 🎨 Customizable Outputs  
Modify and **fine-tune the generated images** to match specific styles and themes.  
This feature ensures that users can generate **unique, creative, and high-quality** visuals.  

### 🏗️ Modern Tech Stack  
PromptMap is built using a **modern and optimized technology stack**, ensuring fast performance and a seamless user experience.  
- **Next.js** – For building an interactive and dynamic frontend.  
- **Tailwind CSS** – For a clean and responsive UI design.  
- **FastAPI** – For an efficient and high-performance backend.  
- **Stable Diffusion (Diffusers)** – For AI-powered image generation.  

---

## 🚀 Installation & Setup  

Follow these steps to set up and run PromptMap locally:  

### 1️⃣ Clone the Repository  
First, clone the GitHub repository and navigate into the project folder:  

```bash
git clone https://github.com/your-username/PromptMap.git
cd PromptMap

###2️⃣ Install Dependencies
📌 Install Backend Dependencies
The backend is built using FastAPI and requires the following dependencies:
pip install fastapi uvicorn torch diffusers numpy pydantic

📌 Install Frontend Dependencies
The frontend is developed using Next.js and requires the following dependencies:
npm install next react react-dom tailwindcss @tailwindcss/postcss @types/react @types/node eslint eslint-config-next

###3️⃣ Start the Development Server
🚀 Start the Frontend (Next.js)
To run the frontend, navigate to the frontend/ folder and start the Next.js server:
npm run dev
This will start the development server on http://localhost:3000.

⚙️ Start the Backend (FastAPI)
To start the FastAPI backend, run the following command inside the backend/ folder:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
The API will be available at http://localhost:8000

