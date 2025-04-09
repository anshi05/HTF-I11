<div align="center">

<img src="/VoiceViz/public/Icon.png" alt="VoiceViz Logo" width="120"/>

# **VoiceViz**
### ✨ Voice to Visualization ✨

Transform your voice into powerful data-driven visuals.<br>
[Generated Report Analysis](https://drive.google.com/file/d/1ed3BI9gA2o6WtzwgG45JUJqELxeh3qQF/view?usp=sharing)

</div>


# About VoiceViz

VoiceViz is designed as a SaaS application that empowers users—from data analysts to business users—to interact with complex datasets through natural language queries, eliminating the need for technical expertise in data tools.

## Features

### 🔑 Key Features

   - 💬 One-Click Database Connection
        - Connect to databases easily, current we support MySQL and Postgre database.

   - 🎙️ Voice to Query Conversion
        - Ask questions via voice; the system processes and shows results (like charts).

   - 🎧 Audio File Support
        - Upload .mp3 or .wav files to convert audio content into data queries.

   - 📊 Dynamic Visualizations
        - Real-time chart/graph generation based on queries.

   - 🔒 User Authentication
        - Secured access.

### 🛠️ Advanced Capabilities

   - 📈 Report Analysis & Generation
   - 🌍 Multilingual Support
   - 🛡️ Malicious SQL Detection Model
   - 🧑‍💼 Role-based Access (Admin/User Privileges)
   - 🧠 Handles Complex SQL Queries
   - 🤖 Integrated Chatbot for Interaction

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- A database (e.g., PostgreSQL, MySQL)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/anshi05/HTF-I11
   cd voiceviz
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

## Running the Application

### Frontend

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

### Backend(FastApi)

1. Build Docker Image:

   ```bash
   docker build -t my-fastapi-app
   ```

2. Run docker container:

    ```bash
   docker run -d -p 8000:8000 my-fastapi-app
   ```

3. Test your API:

    ```bash
   http://localhost:8000/docs
   ```


## Technologies Used

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Python, FastAPI
- **Database**: PostgreSQL/MySQL (configurable)
- **ML**: SQL Malicious Query Detection Model

## Testing Credentials

### Login Page:
- email: test@gmail.com
- password: test@12345

### Database Connection Credentials: 
1. MySQL Database:
   
- For Admin access:
  - Database Type: MySQL
  - Username: root
  - Host: gondola.proxy.rlwy.net
  - Database Name: railway
  - Port: 52183
  - Password: zObQpOszexItfXdPDMhpneMIVsWVnfyS
   
- For User access:
     - Database Type: MySQL
  - Username: user
  - Host: gondola.proxy.rlwy.net
  - Database Name: railway
  - Port: 52183
  - Password: ReadOnlyPass@2024

2. Postgre Database:
   - Database Type: PostgreSQL
  - Username: postgres
  - Host: shuttle.proxy.rlwy.net
  - Database Name: railway
  - Port: 53342
  - Password: GJelnYDQmEndwFGnbUbMeqndLjDphFOK

## Images

## Dashboard: 
![WhatsApp Image 2025-04-09 at 7 03 25 AM](https://github.com/user-attachments/assets/d951cc33-80b9-4b94-994a-50e767dc29b7)

## Query Generation: 
![WhatsApp Image 2025-04-09 at 7 06 36 AM](https://github.com/user-attachments/assets/f2e86555-cc3c-43bb-a447-80c78f1faee9)

## Visualization:
![WhatsApp Image 2025-04-09 at 7 07 56 AM](https://github.com/user-attachments/assets/5ea23e17-a016-47b3-906c-b46c28beef2a)

![WhatsApp Image 2025-04-09 at 7 09 02 AM](https://github.com/user-attachments/assets/17c74b86-f605-479a-af59-b17deed66337)

## Generated Report Analysis:

[Google Drive Link](https://drive.google.com/file/d/1ed3BI9gA2o6WtzwgG45JUJqELxeh3qQF/view?usp=sharing)


   
## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Python Documentation](https://docs.python.org/3/)
