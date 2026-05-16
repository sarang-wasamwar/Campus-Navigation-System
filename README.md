# Campus Navigation System

An interactive **3D Campus Navigation System** developed as part of the **Advanced Data Structures (ADS) Formative Assessment Activity**.

This project aims to provide an intelligent and visually interactive navigation system for college campuses using graph-based pathfinding concepts and 3D visualization techniques.

Currently, the system is focused on **Building No. 6** of the campus and serves as the foundation for a future large-scale smart campus navigation platform.

---

# 📌 Project Description

The Campus Navigation System is designed to help students, faculty members, and visitors navigate academic buildings efficiently through an interactive 3D environment.

The project uses:

- **Three.js** for 3D rendering and visualization
- **SQLite** for storing navigation data
- **Node.js & Express.js** for backend services

All building layouts, room mappings, corridors, staircases, and navigation paths were manually modeled and mapped based on real-world observations throughout Building No. 6.

---

# 🎯 Objectives

- Build a 3D indoor campus navigation system
- Apply Advanced Data Structure concepts in a real-world project
- Implement graph-based navigation
- Create scalable architecture for future campus-wide expansion
- Develop intelligent pathfinding systems

---

# 🛠️ Technologies Used

## 🌐 Frontend
- Three.js
- JavaScript
- HTML5
- CSS3

## ⚙️ Backend
- Node.js
- Express.js

## 🗄️ Database
- SQLite *(Current Implementation)*

---

# 🧠 Advanced Data Structure Concepts Used

This project was developed under the **Advanced Data Structures (ADS)** subject and applies multiple graph-related concepts.

## ✅ Implemented Concepts
- Graph Representation
- Nodes and Edges
- Path Traversal
- Connectivity Mapping
- Route Navigation

## 🔮 Planned Implementations
- Weighted Graphs
- Dijkstra’s Algorithm
- A* Pathfinding Algorithm
- AI-assisted Route Optimization

---

# 🏗️ Current Working

The navigation system represents the building as a graph structure.

Each node represents:
- Classrooms
- Laboratories
- Corridors
- Staircases
- Toilets
- Cabins/Offices
- Lift

Edges define the connectivity between locations.

The paths are rendered visually inside a 3D model using Three.js.

---

# ⚠️ Current Limitations

- Currently supports only Building No. 6
- No weighted path implementation yet
- Total distance calculation is unavailable
- SQLite is not suitable for large-scale campus deployment
- Multi-building navigation is still under development

---

# 🔮 Future Scope

## 📍 Multi-Building Navigation
Expand the system to include all academic and departmental buildings across the campus.

## 📏 Intelligent Pathfinding
Implement:
- Weighted graph algorithms
- Distance-aware routing
- Shortest path calculations

Planned algorithms:
- Dijkstra’s Algorithm
- A* Algorithm

## 🗄️ Database Migration
Upgrade from SQLite to scalable databases such as:
- PostgreSQL
- MongoDB
- Firebase

## 🤖 AI Integration
Future AI features may include:
- Smart route prediction
- Dynamic rerouting
- Crowd-aware navigation
- Accessibility-aware navigation

## 📱 Additional Features
- Mobile responsive interface
- Real-time navigation
- Search functionality
- Voice-guided navigation
- Interactive minimap

---

# 📂 Project Structure

```bash
campus_nav/
│
├── public/                 # Frontend files
├── server.js               # Backend server
├── building6.db            # SQLite database
├── package.json
├── README.md
└── LICENSE
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

## 2️⃣ Navigate to Project Folder

```bash
cd campus_nav
```

## 3️⃣ Install Dependencies

```bash
npm install
```

## 4️⃣ Start the Server

```bash
node server.js
```

---

# 🎯 Long-Term Vision

The long-term goal of this project is to create a complete smart campus navigation ecosystem capable of helping students, faculty members, and visitors efficiently navigate across the entire campus using interactive 3D visualization and intelligent pathfinding systems.

---

# 👨‍💻 Developed By

## Sarang Wasamwar
Second Year Computer Science & Engineering Student  
PCCOE

&

## Ayush Thakare
Second Year Computer Science & Engineering Student
PCCOE
GitHub Link: []

---

# 📚 Academic Information

This project was developed as part of the:

### Advanced Data Structures (ADS)
Formative Assessment Activity

---

# 📄 License

This project is licensed under the MIT License.

---
